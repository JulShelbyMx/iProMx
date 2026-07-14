from PIL import Image
import os
from pathlib import Path

# Chemin du dossier
folder_path = r"D:\ipro images\images\galeries persos\zayn"

# Qualité du WEBP (entre 1 et 100, 80-90 est un bon compromis)
quality = 85

# Extensions à convertir
extensions = {'.png', '.jpg', '.jpeg', '.PNG', '.JPG', '.JPEG'}

def convert_to_webp():
    converted = 0
    deleted = 0
    skipped = 0
    
    for file_path in Path(folder_path).iterdir():
        if file_path.is_file() and file_path.suffix.lower() in {'.png', '.jpg', '.jpeg'}:
            try:
                # Ouvrir l'image
                with Image.open(file_path) as img:
                    # Conversion pour gérer la transparence
                    if img.mode in ('RGBA', 'LA', 'P'):
                        img = img.convert('RGBA')
                    else:
                        img = img.convert('RGB')
                    
                    # Créer le chemin du fichier WebP
                    webp_path = file_path.with_suffix('.webp')
                    
                    # Sauvegarder en WebP
                    img.save(webp_path, 'WEBP', quality=quality, method=6)
                    
                    print(f"✅ Converti : {file_path.name} → {webp_path.name}")
                    converted += 1
                    
                    # === SUPPRESSION de l'ancien fichier ===
                    try:
                        file_path.unlink()
                        print(f"🗑️  Supprimé : {file_path.name}")
                        deleted += 1
                    except Exception as del_err:
                        print(f"⚠️  Converti mais impossible de supprimer {file_path.name} : {del_err}")
                    
            except Exception as e:
                print(f"❌ Erreur avec {file_path.name} : {e}")
                skipped += 1
    
    print("\n" + "="*60)
    print(f"✅ Conversion terminée !")
    print(f"   • Fichiers convertis : {converted}")
    print(f"   • Fichiers supprimés : {deleted}")
    print(f"   • Erreurs           : {skipped}")
    print("="*60)

if __name__ == "__main__":
    if not os.path.exists(folder_path):
        print(f"❌ Le dossier n'existe pas : {folder_path}")
    else:
        convert_to_webp()