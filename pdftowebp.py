import fitz  # PyMuPDF
from PIL import Image
import io
import os

# ================= CONFIGURATION =================
pdf_path = r"D:\iProMx\arbre\ARBRE GÉNÉALOGIQUE + RELATION MANTOR DISCIPLE.pdf"
output_folder = r"D:\iProMx\arbre"

webp_quality = 85        # Entre 1 et 100 (85 = bon compromis)
# ================================================

os.makedirs(output_folder, exist_ok=True)

doc = fitz.open(pdf_path)

print(f"📄 PDF chargé : {len(doc)} pages\n")
print("Conversion en cours vers WebP...\n")

for i, page in enumerate(doc, start=1):
    # Rendu haute qualité
    pix = page.get_pixmap(dpi=300)
    
    # Conversion vers WebP avec qualité
    img_data = pix.tobytes("ppm")  # ou "png"
    image = Image.open(io.BytesIO(img_data))
    
    filename = f"page_{i:02d}.webp"
    filepath = os.path.join(output_folder, filename)
    
    image.save(filepath, "WEBP", quality=webp_quality, method=6)
    
    print(f"✅ Page {i:02d} sauvegardée → {filename}")

print("\n🎉 Conversion terminée avec succès !")
print(f"📁 Dossier : {output_folder}")