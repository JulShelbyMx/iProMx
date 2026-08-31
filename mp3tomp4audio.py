import subprocess
import os

# === Chemins ===
ffmpeg_path = r"D:\ffmpeg-8.0-full_build\ffmpeg-8.0-full_build\bin\ffmpeg.exe"
ffmpeg_dir  = os.path.dirname(ffmpeg_path)
os.environ["PATH"] = ffmpeg_dir + os.pathsep + os.environ.get("PATH", "")

audio_file = r"D:\ipro audio\AARON\Court\Histoire_Court_complete_Aaron.mp3"
image_file = r"D:\ipro audio\AARON\Court\aaron-bannière.jpg"   # j’ai mis .jpg comme dans ton log
output_video = r"D:\ipro audio\AARON\Court\Histoire_Courte_complete_Aaron.mp4"
output_srt   = r"D:\ipro audio\AARON\Court\Histoire_Courte_complete_Aaron.srt"
# ===============

for path in [ffmpeg_path, audio_file, image_file]:
    if not os.path.exists(path):
        raise FileNotFoundError(f"Fichier introuvable : {path}")

# -------------------------------------------------
# 1. Vidéo 1080p
# -------------------------------------------------
print("1/2 - Création de la vidéo 1080p...")

cmd = [
    ffmpeg_path, "-y",
    "-loop", "1", "-framerate", "1",
    "-i", image_file,
    "-i", audio_file,
    "-c:v", "libx264", "-tune", "stillimage",
    "-preset", "ultrafast", "-crf", "23", "-r", "30",
    "-c:a", "aac", "-b:a", "192k",
    "-pix_fmt", "yuv420p", "-shortest",
    "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black",
    "-movflags", "+faststart",
    output_video
]
subprocess.run(cmd, check=True)
print(f"Vidéo créée → {output_video}")

# -------------------------------------------------
# 2. Sous-titres (modèle tiny = très léger en RAM)
# -------------------------------------------------
print("\n2/2 - Génération des sous-titres (modèle tiny)...")

import whisper

model = whisper.load_model("tiny")   # ← le plus léger possible

result = model.transcribe(
    audio_file,
    language="fr",
    task="transcribe",
    fp16=False,
    verbose=False,
    condition_on_previous_text=False,   # économise de la RAM
)

def format_time(seconds):
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int((seconds - int(seconds)) * 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

with open(output_srt, "w", encoding="utf-8") as f:
    for i, seg in enumerate(result["segments"], 1):
        f.write(f"{i}\n")
        f.write(f"{format_time(seg['start'])} --> {format_time(seg['end'])}\n")
        f.write(f"{seg['text'].strip()}\n\n")

print(f"Sous-titres créés → {output_srt}")
print("\nTerminé !")