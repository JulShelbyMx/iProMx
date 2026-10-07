import os
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
FFMPEG_PATH = r"D:\ffmpeg-8.0-full_build\ffmpeg-8.0-full_build\bin"
OUTPUT_DIR = Path(r"D:\Twitch_VODs")
COOKIES_PATH = Path(r"D:\Twitch_VODs\cookies.txt")

TWITCH_PUBLIC_CLIENT_ID = "kimne78kx3ncx6brgo4mv6wki5h1ko"

# Timeout de sécurité pour la réparation ffmpeg (en secondes)
FIX_TIMEOUT = 1800  # 30 min


def sanitize_filename(name: str) -> str:
    return re.sub(r'[\\/:*?"<>|]', "_", name).strip()


def extract_vod_id(url: str) -> str | None:
    match = re.search(r"videos/(\d+)", url)
    return match.group(1) if match else None


def extract_auth_token(cookies_path: Path) -> str | None:
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


def fast_fix_mp4(file_path: Path) -> None:
    """
    Réparation rapide (remux only) pour les problèmes MPEG-TS / AAC.
    Utilisée uniquement sur les fichiers issus de streamlink (flux .ts bruts),
    PAS sur les fichiers déjà mergés par yt-dlp (qui sont déjà de bons mp4).
    """
    if not file_path.exists():
        return

    ffmpeg_exe = Path(FFMPEG_PATH) / "ffmpeg.exe"
    if not ffmpeg_exe.exists():
        print("⚠️  ffmpeg introuvable, skip de la réparation.")
        return

    temp_path = file_path.with_name(file_path.stem + "_fixed.mp4")

    cmd = [
        str(ffmpeg_exe),
        "-y",
        "-nostdin",               # empêche ffmpeg d'attendre une entrée clavier -> évite les blocages
        "-hide_banner",
        "-loglevel", "warning",
        "-stats",                 # affiche la progression en continu (voir si ça avance)
        "-i", str(file_path),
        "-c", "copy",
        "-bsf:a", "aac_adtstoasc",
        "-movflags", "+faststart",
        str(temp_path),
    ]

    print("\n🔧 Réparation rapide en cours...")
    try:
        result = subprocess.run(cmd, timeout=FIX_TIMEOUT)
    except subprocess.TimeoutExpired:
        print(f"⚠️  Timeout ({FIX_TIMEOUT}s) : réparation interrompue.")
        temp_path.unlink(missing_ok=True)
        return

    if result.returncode == 0 and temp_path.exists() and temp_path.stat().st_size > 1000:
        file_path.unlink(missing_ok=True)
        temp_path.rename(file_path)
        print("✅ Réparation terminée (rapide).")
    else:
        print("⚠️  Échec de la réparation rapide, fichier original conservé.")
        temp_path.unlink(missing_ok=True)


def try_ytdlp_download(url: str) -> bool:
    ydl_opts = {
        "outtmpl": str(OUTPUT_DIR / "%(uploader)s - %(title)s [%(id)s].%(ext)s"),
        "format": "bestvideo[height<=720]+bestaudio/best",
        "merge_output_format": "mp4",
        "concurrent_fragment_downloads": 16,
        "http_chunk_size": 10485760,
        "retries": 10,
        "fragment_retries": 10,
        "cookiefile": str(COOKIES_PATH),
        "ffmpeg_location": FFMPEG_PATH,
        "fixup": "never",
        "external_downloader": "aria2c",
        "external_downloader_args": {
            "aria2c": [
                "--min-split-size=1M",
                "--max-connection-per-server=16",
                "--split=16",
                "--max-concurrent-downloads=16",
                "--file-allocation=none",
                "--summary-interval=0",
                "--max-tries=5",
            ]
        },
        # 👉 faststart appliqué directement pendant le merge par yt-dlp
        # (une seule passe ffmpeg au lieu de deux -> gain de temps énorme sur les gros VODs)
        "postprocessor_args": {
            "merger": ["-movflags", "+faststart"],
        },
    }

    if not Path(ARIA2C_PATH).exists():
        print(f"⚠️  aria2c introuvable ({ARIA2C_PATH}), utilisation du downloader natif.")
        ydl_opts.pop("external_downloader", None)
        ydl_opts.pop("external_downloader_args", None)
    else:
        os.environ["PATH"] = str(Path(ARIA2C_PATH).parent) + os.pathsep + os.environ["PATH"]

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.extract_info(url, download=True)
        # Pas de fast_fix_mp4 ici : yt-dlp produit déjà un mp4 propre avec faststart.
        return True
    except Exception as e:
        print(f"\n⚠️  yt-dlp a échoué ({type(e).__name__}: {e})")
        return False


def try_streamlink_download(url: str, vod_id: str, auth_token: str) -> bool:
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
        "--ffmpeg-ffmpeg", str(Path(FFMPEG_PATH) / "ffmpeg.exe"),
        url,
        "720p",
        "-o",
        str(output_path),
    ]

    print("\n🔁 Bascule sur streamlink (VOD probablement réservée aux abonnés)…")
    print(f"   Fichier de sortie : {output_path}")

    result = subprocess.run(cmd)
    if result.returncode == 0 and output_path.exists():
        # Ici le fix reste justifié : le flux streamlink est du MPEG-TS concaténé,
        # avec les vrais problèmes d'ADTS et de moov atom mal placé.
        fast_fix_mp4(output_path)
        return True
    return False


def main():
    print("=== Twitch VOD Downloader (cookies.txt) ===\n")

    url = input("Colle le lien de la VOD ici → ").strip()
    if not url:
        sys.exit(1)

    OUTPUT_DIR.mkdir(exist_ok=True)

    if not COOKIES_PATH.exists():
        print("⚠️  Aucun fichier cookies.txt trouvé.")
        print(f"   Place-le ici : {COOKIES_PATH}")
        sys.exit(1)

    print(f"\n🚀 Téléchargement de : {url}")
    print("Utilisation du fichier cookies.txt\n")

    success = try_ytdlp_download(url)

    if not success:
        vod_id = extract_vod_id(url)
        auth_token = extract_auth_token(COOKIES_PATH)

        if not vod_id:
            print("\n❌ Impossible d'extraire l'ID de la VOD.")
            sys.exit(1)

        if not auth_token:
            print("\n❌ Cookie 'auth-token' introuvable.")
            sys.exit(1)

        success = try_streamlink_download(url, vod_id, auth_token)

    if success:
        print("\n✅ Terminé !")
    else:
        print("\n❌ Échec du téléchargement.")
        sys.exit(1)


if __name__ == "__main__":
    main()