import subprocess
import time
import os
import ctypes
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

# ================== CONFIG ==================
CHANNEL = "ipromx"                    # ← change uniquement ici
OUTPUT_DIR = r"D:\Twitch_VODs"
FFMPEG = r"D:\ffmpeg-8.0-full_build\ffmpeg-8.0-full_build\bin\ffmpeg.exe"
QUALITY = "1080p60,1080p,best"                    # ← 1080p60 en priorité
CHECK_INTERVAL = 30
SEGMENT_MINUTES = 60
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

def format_time(dt):
    return dt.strftime("%Hh%M")

def record_segment(start_time, segment_list):
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    end_time = start_time + timedelta(minutes=SEGMENT_MINUTES)
    filename = f"{CHANNEL}_{format_time(start_time)}-{format_time(end_time)}.mp4"
    output_file = os.path.join(OUTPUT_DIR, filename)

    print(f"\n🔴 Segment : {filename}")

    streamlink_cmd = [
        "streamlink",
        "--twitch-disable-ads",
        "--retry-streams", "5",
        "--retry-max", "8",
        f"twitch.tv/{CHANNEL}",
        QUALITY,
        "-O"
    ]

    # Réglages légers même en 1080p
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
        "-t", str(SEGMENT_MINUTES * 60),
        "-movflags", "+faststart",
        output_file
    ]

    try:
        p1 = subprocess.Popen(streamlink_cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
        p2 = subprocess.Popen(ffmpeg_cmd, stdin=p1.stdout)
        p1.stdout.close()
        p2.wait()
        p1.terminate()

        if os.path.exists(output_file) and os.path.getsize(output_file) > 1000000:
            segment_list.append(output_file)
            print(f"✅ Segment OK : {filename}")
            return True
        else:
            print("⚠️ Segment trop petit, ignoré")
            return False
    except Exception as e:
        print(f"❌ Erreur : {e}")
        return False

def concat_segments(segment_list):
    if len(segment_list) < 2:
        print("Un seul fichier → pas de fusion nécessaire")
        return

    print("\n🔗 Fusion des segments...")

    list_file = os.path.join(OUTPUT_DIR, "concat_list.txt")
    with open(list_file, "w", encoding="utf-8") as f:
        for seg in segment_list:
            f.write(f"file '{seg}'\n")

    final_name = f"{CHANNEL}_FULL_{datetime.now(PARIS).strftime('%Y%m%d_%Hh%M')}.mp4"
    final_path = os.path.join(OUTPUT_DIR, final_name)

    cmd = [
        FFMPEG,
        "-hide_banner",
        "-loglevel", "warning",
        "-f", "concat",
        "-safe", "0",
        "-i", list_file,
        "-c", "copy",
        final_path
    ]

    try:
        subprocess.run(cmd, check=True)
        print(f"✅ Fichier unique créé : {final_name}")
    except Exception as e:
        print(f"❌ Erreur fusion : {e}")
    finally:
        if os.path.exists(list_file):
            os.remove(list_file)

def main():
    print(f"Script lancé – Surveillance de {CHANNEL}")
    print(f"Mode 1080p60 + allégé pour portable")
    print(f"Dossier : {OUTPUT_DIR}")
    print("En attente du live...\n")

    prevent_sleep()
    segment_list = []

    try:
        while not is_live():
            now = datetime.now(PARIS).strftime("%H:%M:%S")
            print(f"[{now}] Pas encore en live... check dans {CHECK_INTERVAL}s")
            time.sleep(CHECK_INTERVAL)

        print("\n🟢 Live détecté !")

        while is_live():
            start = datetime.now(PARIS)
            success = record_segment(start, segment_list)
            if not success:
                break
            time.sleep(3)

        print("\n✅ Live terminé")
        concat_segments(segment_list)

    except KeyboardInterrupt:
        print("\nArrêt manuel")
        if segment_list:
            concat_segments(segment_list)
    finally:
        allow_sleep()

if __name__ == "__main__":
    main()