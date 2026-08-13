import re
import shutil
import subprocess
import sys
from pathlib import Path

import yt_dlp

try:
    import requests
except ImportError:
    requests = None


ARIA2C_PATH = r"D:\aria2-1.37.0-win-64bit-build1\aria2-1.37.0-win-64bit-build1\aria2c.exe"
OUTPUT_DIR = Path(r"D:\Twitch_VODs")
COOKIES_PATH = Path("cookies.txt")

# Client-Id public utilisé par le front-end web de Twitch.
# (le même que celui utilisé en interne par yt-dlp / streamlink / twitch-dl)
TWITCH_PUBLIC_CLIENT_ID = "kimne78kx3ncx6brgo4mv6wki5h1ko"


def sanitize_filename(name: str) -> str:
    """Retire les caractères invalides pour un nom de fichier Windows."""
    return re.sub(r'[\\/:*?"<>|]', "_", name).strip()


def extract_vod_id(url: str) -> str | None:
    match = re.search(r"videos/(\d+)", url)
    return match.group(1) if match else None


def extract_auth_token(cookies_path: Path) -> str | None:
    """Lit le cookie 'auth-token' Twitch depuis un cookies.txt au format Netscape."""
    if not cookies_path.exists():
        return None

    with cookies_path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            parts = line.split("\t")
            if len(parts) < 7:
                continue
            domain, _, _, _, _, name, value = parts[:7]
            if "twitch.tv" in domain and name == "auth-token":
                return value
    return None


def fetch_vod_metadata(vod_id: str) -> dict:
    """Récupère titre + chaîne via l'API GraphQL publique de Twitch (best effort)."""
    default = {"title": f"vod_{vod_id}", "uploader": "twitch"}
    if requests is None:
        return default

    query = {
        "query": (
            'query { video(id: "%s") { title owner { displayName } } }' % vod_id
        )
    }
    try:
        resp = requests.post(
            "https://gql.twitch.tv/gql",
            json=query,
            headers={"Client-Id": TWITCH_PUBLIC_CLIENT_ID},
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()
        video = data.get("data", {}).get("video")
        if not video:
            return default
        title = video.get("title") or default["title"]
        uploader = (video.get("owner") or {}).get("displayName") or default["uploader"]
        return {"title": title, "uploader": uploader}
    except Exception:
        return default


def try_ytdlp_download(url: str) -> bool:
    """Tente le téléchargement via yt-dlp (chemin rapide, VODs publiques).
    Retourne True si succès, False si échec (y compris VOD sub-only)."""

    ydl_opts = {
        "outtmpl": str(OUTPUT_DIR / "%(uploader)s - %(title)s [%(id)s].%(ext)s"),
        "format": "bestvideo[height<=1080][fps<=60]+bestaudio/best",
        "merge_output_format": "mp4",
        "concurrent_fragment_downloads": 32,
        "cookiefile": str(COOKIES_PATH),
        "external_downloader": "aria2c",
        "external_downloader_args": {
            "aria2c": [
                "--min-split-size=1M",
                "--max-connection-per-server=16",
                "--split=16",
                "--max-concurrent-downloads=16",
                "--file-allocation=none",
                "--summary-interval=0",
            ]
        },
    }

    if not Path(ARIA2C_PATH).exists():
        print(f"⚠️  aria2c introuvable ({ARIA2C_PATH}), utilisation du downloader natif.")
        ydl_opts.pop("external_downloader", None)
        ydl_opts.pop("external_downloader_args", None)
    else:
        import os
        os.environ["PATH"] = str(Path(ARIA2C_PATH).parent) + os.pathsep + os.environ["PATH"]

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        return True
    except Exception as e:
        print(f"\n⚠️  yt-dlp a échoué ({type(e).__name__}: {e})")
        return False


def try_streamlink_download(url: str, vod_id: str, auth_token: str) -> bool:
    """Tente le téléchargement via streamlink (VODs sub-only)."""

    streamlink_path = shutil.which("streamlink")
    if not streamlink_path:
        print("\n❌ streamlink n'est pas installé.")
        print("   Installe-le avec : pip install streamlink")
        return False

    meta = fetch_vod_metadata(vod_id)
    filename = sanitize_filename(f"{meta['uploader']} - {meta['title']} [{vod_id}].mp4")
    output_path = OUTPUT_DIR / filename

    cmd = [
        streamlink_path,
        f"--twitch-api-header=Authorization=OAuth {auth_token}",
        "--twitch-disable-ads",
        url,
        "best",
        "-o",
        str(output_path),
    ]

    print(f"\n🔁 Bascule sur streamlink (VOD probablement réservée aux abonnés)…")
    print(f"   Fichier de sortie : {output_path}")

    result = subprocess.run(cmd)
    return result.returncode == 0


def main():
    print("=== Twitch VOD Downloader (cookies.txt) ===\n")

    url = input("Colle le lien de la VOD ici → ").strip()
    if not url:
        sys.exit(1)

    OUTPUT_DIR.mkdir(exist_ok=True)

    if not COOKIES_PATH.exists():
        print("⚠️  Aucun fichier cookies.txt trouvé à côté du script.")
        print("   Exporte tes cookies Twitch (connecté) via une extension")
        print("   type 'Get cookies.txt LOCALLY', et place le fichier ici.")
        sys.exit(1)

    print(f"\n🚀 Téléchargement de : {url}")
    print("Utilisation du fichier cookies.txt\n")

    success = try_ytdlp_download(url)

    if not success:
        vod_id = extract_vod_id(url)
        auth_token = extract_auth_token(COOKIES_PATH)

        if not vod_id:
            print("\n❌ Impossible d'extraire l'ID de la VOD depuis l'URL.")
            sys.exit(1)

        if not auth_token:
            print("\n❌ Impossible de trouver le cookie 'auth-token' dans cookies.txt.")
            print("   Reconnecte-toi sur twitch.tv et réexporte tes cookies.")
            sys.exit(1)

        success = try_streamlink_download(url, vod_id, auth_token)

    if success:
        print("\n✅ Terminé !")
    else:
        print("\n❌ Échec du téléchargement (yt-dlp et streamlink ont tous les deux échoué).")
        sys.exit(1)


if __name__ == "__main__":
    main()