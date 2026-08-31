import subprocess
import time
import os
import ctypes
from datetime import datetime
from zoneinfo import ZoneInfo

# ================== CONFIG ==================
CHANNEL = "ipromx"                    # ← change uniquement ici
OUTPUT_DIR = r"D:\Twitch_VODs"
FFMPEG = r"D:\ffmpeg-8.0-full_build\ffmpeg-8.0-full_build\bin\ffmpeg.exe"
QUALITY = "1080p60,1080p,best"        # ← 1080p60 en priorité
CHECK_INTERVAL = 30
# ============================================

PARIS = ZoneInfo("Europe/Paris")

ES_CONTINUOUS = 0x80000000
ES_SYSTEM_REQUIRED = 0x00000001
ES_DISPLAY_REQUIRED = 0x00000002

def prevent_sleep():
    ctypes.windll.kernel32.SetThreadExecutionState(
        ES_CONTINUOUS | ES_SYSTEM_REQUIRED | ES_DISPLAY_REQUIRED
    )
    print("→ Veille désactivée")

def allow_sleep():
    ctypes.windll.kernel32.SetThreadExecutionState(ES_CONTINUOUS)
    print("→ Veille réactivée")

def is_live():
    try:
        result = subprocess.run(
            ["streamlink", "--json", f"twitch.tv/{CHANNEL}"],
            capture_output=True, text=True, timeout=15
        )
        return result.returncode == 0
    except Exception:
        return False

def record_continuous():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    start = datetime.now(PARIS)
    filename = f"{CHANNEL}_{start.strftime('%Y%m%d_%Hh%M')}.mp4"
    output_file = os.path.join(OUTPUT_DIR, filename)

    print(f"\n🔴 Enregistrement continu : {filename}")

    streamlink_cmd = [
        "streamlink",
        "--twitch-disable-ads",
        "--retry-streams", "5",
        "--retry-max", "8",
        f"twitch.tv/{CHANNEL}",
        QUALITY,
        "-O"
    ]

    ffmpeg_cmd = [
        FFMPEG,
        "-hide_banner",
        "-loglevel", "warning",
        "-fflags", "+discardcorrupt+genpts",
        "-thread_queue_size", "4096",
        "-i", "pipe:0",
        "-c:v", "copy",
        "-c:a", "copy",
        "-avoid_negative_ts", "make_zero",
        "-movflags", "+faststart",
        output_file
    ]

    p1 = None
    p2 = None

    try:
        p1 = subprocess.Popen(streamlink_cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
        p2 = subprocess.Popen(ffmpeg_cmd, stdin=p1.stdout)
        p1.stdout.close()

        # On attend simplement que streamlink se termine (fin du live)
        # ou qu'on force l'arrêt
        while True:
            if p1.poll() is not None or p2.poll() is not None:
                break
            if not is_live():
                print("\n→ Live terminé détecté, arrêt propre...")
                break
            time.sleep(CHECK_INTERVAL)

    except Exception as e:
        print(f"❌ Erreur : {e}")
    finally:
        # Arrêt propre des processus
        if p2 and p2.poll() is None:
            p2.terminate()
            try:
                p2.wait(timeout=10)
            except subprocess.TimeoutExpired:
                p2.kill()

        if p1 and p1.poll() is None:
            p1.terminate()
            try:
                p1.wait(timeout=5)
            except subprocess.TimeoutExpired:
                p1.kill()

        if os.path.exists(output_file) and os.path.getsize(output_file) > 1_000_000:
            print(f"✅ Enregistrement terminé : {filename}")
            return output_file
        else:
            print("⚠️ Fichier trop petit ou inexistant")
            return None

def main():
    print(f"Script lancé – Surveillance de {CHANNEL}")
    print(f"Mode 1080p60 + enregistrement continu (sans segments)")
    print(f"Dossier : {OUTPUT_DIR}")
    print("En attente du live...\n")

    prevent_sleep()

    try:
        while not is_live():
            now = datetime.now(PARIS).strftime("%H:%M:%S")
            print(f"[{now}] Pas encore en live... check dans {CHECK_INTERVAL}s")
            time.sleep(CHECK_INTERVAL)

        print("\n🟢 Live détecté !")
        record_continuous()
        print("\n✅ Live terminé")

    except KeyboardInterrupt:
        print("\nArrêt manuel")
    finally:
        allow_sleep()

if __name__ == "__main__":
    main()