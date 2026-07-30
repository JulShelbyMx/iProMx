import sys
from pathlib import Path
import yt_dlp


def main():
    print("=== Twitch VOD Downloader (cookies.txt) ===\n")

    url = input("Colle le lien de la VOD ici → ").strip()
    if not url:
        sys.exit(1)

    output_dir = Path(r"D:\Twitch_VODs")
    output_dir.mkdir(exist_ok=True)

    cookies_path = Path("cookies.txt")
    if not cookies_path.exists():
        print("⚠️  Aucun fichier cookies.txt trouvé à côté du script.")
        print("   Exporte tes cookies Twitch (connecté) via une extension")
        print("   type 'Get cookies.txt LOCALLY', et place le fichier ici.")
        sys.exit(1)

    ARIA2C_PATH = r"D:\aria2-1.37.0-win-64bit-build1\aria2-1.37.0-win-64bit-build1\aria2c.exe"

    ydl_opts = {
        'outtmpl': str(output_dir / '%(uploader)s - %(title)s [%(id)s].%(ext)s'),
        'format': 'bestvideo[height<=1080][fps<=60]+bestaudio/best',
        'merge_output_format': 'mp4',
        'concurrent_fragment_downloads': 32,
        'cookiefile': str(cookies_path),   # ✅ bonne clé (au lieu de 'cookies')
        'external_downloader': 'aria2c',
        'external_downloader_args': {
            'aria2c': [
                '--min-split-size=1M',
                '--max-connection-per-server=16',
                '--split=16',
                '--max-concurrent-downloads=16',
                '--file-allocation=none',
                '--summary-interval=0',
            ]
        },
    }

    # Vérifie qu'aria2c est bien présent, sinon on retombe sur le downloader
    # natif (hlsnative) avec un fort niveau de concurrence
    if not Path(ARIA2C_PATH).exists():
        print(f"⚠️  aria2c introuvable ({ARIA2C_PATH}), utilisation du downloader natif.")
        ydl_opts.pop('external_downloader', None)
        ydl_opts.pop('external_downloader_args', None)
    else:
        # yt-dlp cherche aria2c dans le PATH ; on ajoute son dossier temporairement
        import os
        os.environ['PATH'] = str(Path(ARIA2C_PATH).parent) + os.pathsep + os.environ['PATH']

    print(f"\n🚀 Téléchargement de : {url}")
    print("Utilisation du fichier cookies.txt\n")

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
    except yt_dlp.utils.DownloadError as e:
        print(f"\n❌ Échec du téléchargement : {e}")
        sys.exit(1)

    print("\n✅ Terminé !")


if __name__ == "__main__":
    main()