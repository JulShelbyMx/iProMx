from pathlib import Path

# ================= CONFIGURATION =================
DOSSIER = r"D:\iProMx\images\downloadimg"

# IMPORTANT : Mets False au début pour tester !
MODE_TEST = False
# ================================================

def supprimer_jpg(dossier):
    dossier_path = Path(dossier)
    
    if not dossier_path.exists():
        print(f"❌ Le dossier n'existe pas : {dossier}")
        return
    
    # Recherche tous les fichiers .jpg et .jpeg (insensible à la casse)
    fichiers_jpg = list(dossier_path.glob("*.jpg")) + \
                   list(dossier_path.glob("*.jpeg")) + \
                   list(dossier_path.glob("*.JPG")) + \
                   list(dossier_path.glob("*.JPEG"))

    if not fichiers_jpg:
        print("✅ Aucun fichier JPG/JPEG trouvé dans le dossier.")
        return

    print(f"🔍 {len(fichiers_jpg)} fichier(s) JPG/JPEG trouvé(s) :\n")
    
    for fichier in fichiers_jpg:
        print(f"   - {fichier.name}")

    if MODE_TEST:
        print("\n" + "="*70)
        print("⚠️  MODE TEST ACTIVÉ - Aucun fichier ne sera supprimé")
        print("Pour supprimer réellement les fichiers, change la ligne :")
        print("   MODE_TEST = True  →  MODE_TEST = False")
        print("="*70)
    else:
        confirmation = input(f"\n⚠️  Veux-tu vraiment supprimer ces {len(fichiers_jpg)} fichiers JPG/JPEG ? (oui/non) : ")
        
        if confirmation.lower() in ['oui', 'o', 'yes', 'y']:
            supprimes = 0
            for fichier in fichiers_jpg:
                try:
                    fichier.unlink()
                    print(f"🗑️  Supprimé : {fichier.name}")
                    supprimes += 1
                except Exception as e:
                    print(f"❌ Erreur suppression {fichier.name} : {e}")
            
            print("\n" + "="*60)
            print(f"✅ Suppression terminée ! {supprimes} fichier(s) JPG/JPEG supprimé(s).")
            print("="*60)
        else:
            print("⛔ Suppression annulée par l'utilisateur.")

# ===================== LANCEMENT =====================
if __name__ == "__main__":
    print("Script de suppression des fichiers JPG/JPEG\n")
    supprimer_jpg(DOSSIER)