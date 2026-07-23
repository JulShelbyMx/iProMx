import random

# ==================== CONFIGURATION ====================
MAX_IMAGES = 353         # ← Change ce nombre simplement pour les prochaines fois
# ====================================================

def generate_gallery(max_img=MAX_IMAGES):
    # Liste de tous les numéros
    numbers = list(range(1, max_img + 1))
    
    # Retirer 42 pour le placer en position fixe
    if 42 in numbers:
        numbers.remove(42)
    
    # Mélange aléatoire
    random.shuffle(numbers)
    
    # Création du tableau
    gallery = [0] * max_img
    gallery[4] = 42  # Position obligatoire (index 4)
    
    # Remplissage
    idx = 0
    for i in range(max_img):
        if i == 4:
            continue
        gallery[i] = numbers[idx]
        idx += 1
    
    # Génération du code JavaScript
    print(f"const GALLERY_IMAGES = [  // {max_img} images")
    for i in range(max_img):
        num = gallery[i]
        
        # === EXCEPTION img5 ===
        if num == 5:
            base = f"  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img5.1.webp')"
        else:
            base = f"  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img{num}.webp')"
        
        if i % 8 == 4:
            line = base + ", //grande image"
        else:
            if i < max_img - 1:
                line = base + ","
            else:
                line = base  # dernière ligne sans virgule
        
        print(line)
    print("];")

# ==================== GÉNÉRATION ====================
random.seed()  # Retire cette ligne si tu veux le même mélange à chaque fois
generate_gallery()