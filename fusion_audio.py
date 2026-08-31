import subprocess
import os

# ========== CONFIGURATION ==========
ffmpeg = r"D:\ffmpeg-8.0-full_build\ffmpeg-8.0-full_build\bin\ffmpeg.exe"

# Mets ici tes fichiers (peuvent être .wav OU .mp3)
fichiers = [
    r"D:\ipro audio\AARON\Court\AARON_Chapitre_1.wav",
    r"D:\ipro audio\AARON\Court\AARON_Chapitre_2.wav",
    r"D:\ipro audio\AARON\Court\AARON_Chapitre_3.wav",
    r"D:\ipro audio\AARON\Court\AARON_Chapitre_4.wav",
    r"D:\ipro audio\AARON\Court\AARON_Chapitre_5.wav",
    r"D:\ipro audio\AARON\Court\AARON_Chapitre_6.wav",
    
]

fichier_sortie = r"D:\ipro audio\AARON\Court\Histoire_Court_complete_Aaron.mp3"
# ===================================

fichiers_mp3 = []
print("Préparation des fichiers...")

for fichier in fichiers:
    if not os.path.exists(fichier):
        print(f"Erreur : {fichier} n'existe pas")
        exit()

    extension = os.path.splitext(fichier)[1].lower()

    if extension == ".mp3":
        # Déjà en MP3 → on le garde tel quel
        fichiers_mp3.append(fichier)
        print(f"  → Déjà en MP3 : {os.path.basename(fichier)} (conversion ignorée)")

    elif extension == ".wav":
        # Conversion WAV → MP3
        mp3 = os.path.splitext(fichier)[0] + ".mp3"
        fichiers_mp3.append(mp3)

        commande_conv = [
            ffmpeg,
            "-y",
            "-i", fichier,
            "-codec:a", "libmp3lame",
            "-b:a", "192k",
            mp3
        ]
        subprocess.run(commande_conv, check=True)
        print(f"  → Converti : {os.path.basename(mp3)}")

        # Suppression du WAV après conversion réussie
        os.remove(fichier)
        print(f"  → WAV supprimé : {os.path.basename(fichier)}")

    else:
        print(f"Erreur : format non supporté → {fichier}")
        exit()

print("\nTous les fichiers sont prêts.\n")

# ========== Fusion ==========
liste_file = "liste_temp.txt"

with open(liste_file, "w", encoding="utf-8") as f:
    for fichier in fichiers_mp3:
        chemin = fichier.replace("\\", "/")
        f.write(f"file '{chemin}'\n")

print("Fusion en cours...")

commande = [
    ffmpeg,
    "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", liste_file,
    "-c:a", "libmp3lame",
    "-b:a", "192k",
    fichier_sortie
]

subprocess.run(commande, check=True)

os.remove(liste_file)

print(f"\nTerminé !")
print(f"Fichier fusionné créé : {fichier_sortie}")