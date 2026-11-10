"""
Prepara le foto del catalogo per il sito.

Il programma:
1. legge solo le immagini elencate in data/gonfiabili.json;
2. copre le quote tecniche conosciute con inpainting;
3. corregge leggermente colore, contrasto e nitidezza;
4. esporta tutto in 4:3, 1200 x 900, nella cartella img/gonfiabili/web;
5. aggiorna i percorsi nel catalogo senza sovrascrivere gli originali.

Per aggiungere una nuova area da pulire, inserisci il nome del file in
TEXT_MASKS e aggiungi rettangoli normalizzati (x1, y1, x2, y2), con valori
compresi tra 0 e 1.
"""

from pathlib import Path
import json

import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / "data" / "gonfiabili.json"
OUTPUT_DIR = ROOT / "img" / "gonfiabili" / "web"
TARGET_SIZE = (1200, 900)

# Quote e frecce aggiunte sopra le fotografie. Le coordinate sono proporzionali
# alla foto originale, quindi funzionano anche se cambia la risoluzione.
TEXT_MASKS = {
    "combinato-alieno.jpg": [(0.48, 0.00, 1.00, 0.20)],
    "snake.JPG": [(0.00, 0.00, 1.00, 0.28)],
    "galleone2.jpg": [(0.15, 0.74, 0.85, 0.92)],
    "palmslide.jpg": [(0.00, 0.00, 1.00, 0.34)],
    "bollamagica.JPG": [(0.00, 0.00, 1.00, 0.34)],
    "aereoslidee.JPG": [(0.00, 0.72, 0.90, 1.00)],
    "scivolomare.JPG": [(0.25, 0.00, 1.00, 0.20)],
    "new-dragon-slide.jpeg": [(0.15, 0.00, 1.00, 0.20)],
    "saltaclown.JPG": [(0.15, 0.78, 0.85, 0.94)],
    "rainbowslide.jpeg": [(0.00, 0.00, 1.00, 0.30)],
    "trattore.jpeg": [(0.00, 0.66, 1.00, 0.98)],
    "carozzafrozen.jpeg": [(0.00, 0.55, 1.00, 1.00)],
}

# In queste foto la quota è sul bordo: il ritaglio la elimina senza lasciare
# segni visibili. I valori indicano la parte da togliere in proporzione.
CROP_AWAY = {
    "snake.JPG": {"top": 0.16},
    "galleone2.jpg": {"bottom": 0.30},
    "palmslide.jpg": {"top": 0.22, "bottom": 0.08},
    "bollamagica.JPG": {"top": 0.22},
    "aereoslidee.JPG": {"bottom": 0.20},
    "scivolomare.JPG": {"top": 0.16},
    "rainbowslide.jpeg": {"top": 0.30, "bottom": 0.08},
    "trattore.jpeg": {"bottom": 0.28},
    "carozzafrozen.jpeg": {"bottom": 0.40},
    "new-dragon-slide.jpeg": {"top": 0.10, "bottom": 0.08},
    "saltaclown.JPG": {"bottom": 0.18},
}


def crop_away_overlays(image, filename):
    """Ritaglia solo quote posizionate sul bordo dell'immagine."""
    crop = CROP_AWAY.get(filename)
    if crop is None:
        crop = next(
            (
                values
                for key, values in CROP_AWAY.items()
                if Path(key).stem == Path(filename).stem
            ),
            None,
        )
    if not crop:
        return image

    left = 0
    top = int(image.height * crop.get("top", 0))
    right = image.width
    bottom = image.height - int(image.height * crop.get("bottom", 0))
    return image.crop((left, top, right, bottom))


def trim_black_borders(image):
    """Rimuove bande nere tecniche ai bordi delle foto verticali."""
    array = np.asarray(image)
    dark = np.max(array, axis=2) < 18
    row_dark = dark.mean(axis=1)
    col_dark = dark.mean(axis=0)

    top = 0
    while top < image.height - 1 and row_dark[top] > 0.85:
        top += 1
    bottom = image.height
    while bottom > top + 1 and row_dark[bottom - 1] > 0.85:
        bottom -= 1
    left = 0
    while left < image.width - 1 and col_dark[left] > 0.85:
        left += 1
    right = image.width
    while right > left + 1 and col_dark[right - 1] > 0.85:
        right -= 1

    return image.crop((left, top, right, bottom))


def has_crop_rule(filename):
    return filename in CROP_AWAY or any(
        Path(key).stem == Path(filename).stem for key in CROP_AWAY
    )


def mask_for_image(image, rectangles):
    """Individua solo i caratteri chiari nelle aree da ripulire."""
    width, height = image.size
    mask = np.zeros((height, width), dtype=np.uint8)
    # Le quote del catalogo sono scritte bianche: la soglia evita di
    # cancellare intere zone di cielo, soffitto o pavimento.
    source = cv2.cvtColor(np.asarray(image), cv2.COLOR_RGB2HSV)
    for x1, y1, x2, y2 in rectangles:
        left, top = int(width * x1), int(height * y1)
        right, bottom = int(width * x2), int(height * y2)
        roi = source[top:bottom, left:right]
        bright = (roi[:, :, 2] > 175) & (roi[:, :, 1] < 115)
        mask[top:bottom, left:right] = np.where(bright, 255, 0).astype(np.uint8)
    # Un piccolo margine evita aloni ai bordi della scritta.
    return cv2.dilate(mask, np.ones((3, 3), np.uint8), iterations=1)


def remove_overlays(image, filename):
    """Rimuove quote e testi indicati in TEXT_MASKS con ricostruzione naturale."""
    rectangles = TEXT_MASKS.get(filename)
    if rectangles is None:
        rectangles = next(
            (
                values
                for key, values in TEXT_MASKS.items()
                if Path(key).stem == Path(filename).stem
            ),
            None,
        )
    if not rectangles:
        return image

    source = cv2.cvtColor(np.asarray(image), cv2.COLOR_RGB2BGR)
    mask = mask_for_image(image, rectangles)
    restored = cv2.inpaint(source, mask, 5, cv2.INPAINT_TELEA)
    return Image.fromarray(cv2.cvtColor(restored, cv2.COLOR_BGR2RGB))


def improve(image):
    """Applica correzioni moderate, evitando un effetto artificiale."""
    image = ImageOps.exif_transpose(image).convert("RGB")
    image = ImageEnhance.Color(image).enhance(1.04)
    image = ImageEnhance.Contrast(image).enhance(1.05)
    image = ImageEnhance.Brightness(image).enhance(1.02)
    return ImageEnhance.Sharpness(image).enhance(1.12)


def fit_to_4_3(image):
    """Restituisce una foto 4:3 senza deformarla o tagliare il soggetto."""
    target_width, target_height = TARGET_SIZE
    target_ratio = target_width / target_height
    ratio = image.width / image.height

    if ratio >= target_ratio:
        # Le foto panoramiche vengono ritagliate al centro.
        crop_width = int(image.height * target_ratio)
        left = max(0, (image.width - crop_width) // 2)
        return image.crop((left, 0, left + crop_width, image.height)).resize(
            TARGET_SIZE, Image.Resampling.LANCZOS
        )

    # Per foto verticali/quadrate manteniamo tutto il soggetto su uno sfondo
    # sfocato ricavato dalla foto stessa.
    foreground = image.copy()
    foreground.thumbnail(TARGET_SIZE, Image.Resampling.LANCZOS)
    background = ImageOps.fit(
        image,
        TARGET_SIZE,
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.5),
    ).filter(ImageFilter.GaussianBlur(24))
    background = ImageEnhance.Brightness(background).enhance(0.72)
    left = (target_width - foreground.width) // 2
    top = (target_height - foreground.height) // 2
    background.paste(foreground, (left, top))
    return background


def find_source(path):
    """Trova l'originale anche dopo che il catalogo è stato aggiornato a web/."""
    direct = ROOT / path
    if direct.exists() and "img/gonfiabili/web" not in path:
        return direct

    requested_name = Path(path).name
    stem = Path(requested_name).stem
    candidates = sorted(
        p
        for p in (ROOT / "img" / "gonfiabili").glob(f"{stem}.*")
        if p.is_file() and p.parent.name == "gonfiabili"
    )
    for candidate in candidates:
        if f"{candidate.stem}.jpg" == requested_name:
            return candidate
    if candidates:
        return candidates[0]
    return ROOT / path


def main():
    catalog = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    processed = {}
    for item in catalog:
        for original_path in item.get("foto", []):
            if original_path in processed:
                continue

            # Il catalogo può già contenere percorsi web dopo una precedente
            # esecuzione: il nome del file originale resta invariato.
            source_path = find_source(original_path)
            if not source_path.exists():
                raise FileNotFoundError(f"Immagine mancante: {original_path}")

            image = Image.open(source_path)
            image = trim_black_borders(image)
            image = crop_away_overlays(image, source_path.name)
            if not has_crop_rule(source_path.name):
                image = remove_overlays(image, source_path.name)
            image = improve(image)
            image = fit_to_4_3(image)

            output_name = f"{source_path.stem}.jpg"
            output_path = OUTPUT_DIR / output_name
            image.save(
                output_path,
                format="JPEG",
                quality=90,
                optimize=True,
                progressive=True,
            )
            processed[original_path] = f"img/gonfiabili/web/{output_name}"

    for item in catalog:
        item["foto"] = [processed[path] for path in item.get("foto", [])]

    CATALOG_PATH.write_text(
        json.dumps(catalog, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Elaborate {len(processed)} immagini in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
