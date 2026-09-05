import subprocess
import time
import os
import glob
import shutil
import ctypes
from datetime import datetime
from zoneinfo import ZoneInfo

# ================== CONFIG ==================
CHANNEL = "ipromx"                    # ← change uniquement ici
OUTPUT_DIR = r"D:\Twitch_VODs"
FFMPEG = r"D:\ffmpeg-8.0-full_build\ffmpeg-8.0-full_build\bin\ffmpeg.exe"
YTDLP = r"D:\yt-dlp.exe"              # chemin vers yt-dlp.exe
MAX_HEIGHT = 1080                     # 1080p60 inclus (yt-dlp prend le meilleur framerate dispo à cette hauteur)

CHECK_INTERVAL = 30                   # intervalle entre checks pendant l'attente du live
LIVE_CHECK_RETRIES = 3                # nb de checks négatifs consécutifs avant de conclure "live fini"
LIVE_CHECK_RETRY_DELAY = 15           # secondes entre chaque check de confirmation
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


def raw_is_live():
    """Un seul check rapide, peut renvoyer un faux négatif (timeout, hoquet API...)."""
    try:
        result = subprocess.run(
            ["streamlink", "--json", f"twitch.tv/{CHANNEL}"],
            capture_output=True, text=True, timeout=20
        )
        return result.returncode == 0
    except Exception as e:
        print(f"   (check échoué : {e})")
        return False


def is_live_confirmed():
    """
    True dès qu'un check est positif.
    False seulement après LIVE_CHECK_RETRIES checks négatifs consécutifs,
    espacés de LIVE_CHECK_RETRY_DELAY secondes. Évite qu'un simple hoquet
    réseau/API soit pris pour une vraie fin de live.
    """
    for attempt in range(1, LIVE_CHECK_RETRIES + 1):
        if raw_is_live():
            return True
        print(f"   → check négatif ({attempt}/{LIVE_CHECK_RETRIES})")
        if attempt < LIVE_CHECK_RETRIES:
            time.sleep(LIVE_CHECK_RETRY_DELAY)
    return False


def run_ytdlp(session_dir, segment_idx, from_start):
    """
    Lance yt-dlp sur le live. from_start=True uniquement pour le tout premier
    segment (récupère le buffer depuis le début du live, même lancé en retard).
    Les segments suivants (après une vraie coupure) partent d'où le live en est.
    """
    output_template = os.path.join(session_dir, f"segment_{segment_idx:03d}.%(ext)s")
    log_path = os.path.join(session_dir, f"segment_{segment_idx:03d}.log")

    cmd = [
        YTDLP,
        "-f", f"bv*[height<={MAX_HEIGHT}]+ba/b[height<={MAX_HEIGHT}]/best",
        "--merge-output-format", "mp4",
        "--ffmpeg-location", FFMPEG,
        "--retries", "infinite",
        "--fragment-retries", "infinite",
        "--retry-sleep", "5",
        "--no-part",
        "-o", output_template,
    ]
    if from_start:
        cmd.append("--live-from-start")

    cmd.append(f"https://twitch.tv/{CHANNEL}")

    print(f"   ▶ Segment {segment_idx} démarré" + (" (depuis le début du live)" if from_start else ""))

    with open(log_path, "wb") as logf:
        p = subprocess.Popen(cmd, stdout=logf, stderr=subprocess.STDOUT)
        try:
            p.wait()
        except KeyboardInterrupt:
            p.terminate()
            try:
                p.wait(timeout=10)
            except subprocess.TimeoutExpired:
                p.kill()
            raise

    produced = glob.glob(os.path.join(session_dir, f"segment_{segment_idx:03d}.*"))
    produced = [f for f in produced if not f.endswith(".log") and not f.endswith(".part")]
    valid = [f for f in produced if os.path.getsize(f) > 1_000_000]

    if valid:
        return valid[0]
    return None


def concat_segments(segment_paths, final_output, session_dir):
    """Recolle les segments en un seul fichier continu, sans ré-encodage (stream copy)."""
    if len(segment_paths) == 1:
        shutil.move(segment_paths[0], final_output)
        return True

    list_file = os.path.join(session_dir, "concat_list.txt")
    with open(list_file, "w", encoding="utf-8") as f:
        for p in segment_paths:
            safe_path = p.replace("'", "'\\''")
            f.write(f"file '{safe_path}'\n")

    concat_cmd = [
        FFMPEG,
        "-hide_banner",
        "-loglevel", "warning",
        "-f", "concat",
        "-safe", "0",
        "-i", list_file,
        "-c", "copy",
        "-movflags", "+faststart",
        final_output
    ]
    result = subprocess.run(concat_cmd, capture_output=True, text=True)
    ok = os.path.exists(final_output) and os.path.getsize(final_output) > 1_000_000
    if not ok:
        print(f"⚠️ Concat ffmpeg a échoué : {result.stderr[-2000:]}")
    return ok


def record_live_session():
    """
    Enregistre le live entier via yt-dlp (--live-from-start pour rattraper le
    début). Si une vraie coupure force yt-dlp à s'arrêter en cours de route,
    relance un nouveau segment et recolle tout en UN SEUL fichier final continu.
    """
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    start = datetime.now(PARIS)
    session_name = f"{CHANNEL}_{start.strftime('%Y%m%d_%Hh%M')}"
    session_dir = os.path.join(OUTPUT_DIR, f".{session_name}_tmp")
    os.makedirs(session_dir, exist_ok=True)

    final_output = os.path.join(OUTPUT_DIR, f"{session_name}.mp4")
    segments = []
    idx = 0

    print(f"\n🔴 Enregistrement : {session_name}.mp4")

    first = True
    while True:
        idx += 1
        seg = run_ytdlp(session_dir, idx, from_start=first)
        first = False

        if seg:
            segments.append(seg)
            print(f"   ✔ Segment {idx} OK ({os.path.getsize(seg)//1_000_000} Mo)")
        else:
            print(f"   ✘ Segment {idx} vide/invalide, ignoré")

        # yt-dlp s'est arrêté : vérif rapide d'abord (cas fréquent : hoquet bref / fin normale)
        if raw_is_live():
            print("   → Live toujours en cours, reprise immédiate...")
            time.sleep(2)
            continue

        print("   → Pas de réponse immédiate, vérification approfondie...")
        if is_live_confirmed():
            print("   → Live toujours en cours (confirmé), reprise...")
            continue
        else:
            print("→ Live terminé (confirmé), finalisation...")
            break

    if not segments:
        print("⚠️ Aucun segment valide enregistré.")
        shutil.rmtree(session_dir, ignore_errors=True)
        return None

    print(f"\n🔧 Fusion de {len(segments)} segment(s) en un seul fichier...")
    ok = concat_segments(segments, final_output, session_dir)

    if ok:
        print(f"✅ Enregistrement terminé : {os.path.basename(final_output)}")
        shutil.rmtree(session_dir, ignore_errors=True)
        return final_output
    else:
        print(f"⚠️ Fusion échouée, les segments bruts restent dans : {session_dir}")
        return None


def main():
    print(f"Script lancé – Surveillance de {CHANNEL}")
    print("Mode : yt-dlp --live-from-start (rattrape le début du live)")
    print(f"Dossier : {OUTPUT_DIR}")
    print("En attente du live...\n")

    prevent_sleep()

    try:
        while not raw_is_live():
            now = datetime.now(PARIS).strftime("%H:%M:%S")
            print(f"[{now}] Pas encore en live... check dans {CHECK_INTERVAL}s")
            time.sleep(CHECK_INTERVAL)

        print("\n🟢 Live détecté !")
        record_live_session()
        print("\n✅ Live terminé")

    except KeyboardInterrupt:
        print("\nArrêt manuel")
    finally:
        allow_sleep()


if __name__ == "__main__":
    main()