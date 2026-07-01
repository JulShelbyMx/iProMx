import random

def generate_gallery(max_img=333):
    numbers = list(range(1, max_img + 1))
    if 42 in numbers:
        numbers.remove(42)
    
    random.shuffle(numbers)
    
    gallery = [0] * max_img
    gallery[4] = 42
    
    idx = 0
    for i in range(max_img):
        if i == 4:
            continue
        gallery[i] = numbers[idx]
        idx += 1
    
    print(f"const GALLERY_IMAGES = [  // {max_img} images")
    for i in range(max_img):
        num = gallery[i]
        base = f"  _gimg('https://ik.imagekit.io/ipromx/images/downloadimg/img{num}.webp')"
        
        if i % 8 == 4:
            # Virgule avant le commentaire
            line = base + ", //grande image"
        else:
            if i < max_img - 1:
                line = base + ","
            else:
                line = base
        
        print(line)
    print("];")

# Générer jusqu'à 333
random.seed()
generate_gallery(333)