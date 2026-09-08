import cv2
import numpy as np
from PIL import Image


def is_skin_image(image, min_skin_ratio=0.20):
    """
    Mengecek apakah gambar kemungkinan merupakan foto kulit.

    True  = kemungkinan foto kulit
    False = kemungkinan bukan foto kulit
    """

    # Konversi gambar
    if isinstance(image, Image.Image):
        image = image.convert("RGB")
        image = np.array(image)
    else:
        image = np.array(image)

    # Pastikan gambar RGB
    if len(image.shape) != 3 or image.shape[2] != 3:
        return False

    # Resize gambar
    image = cv2.resize(image, (224, 224))

    # Konversi RGB ke HSV
    hsv = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)

    # Range warna kulit
    lower_skin = np.array(
        [0, 20, 50],
        dtype=np.uint8
    )

    upper_skin = np.array(
        [25, 255, 255],
        dtype=np.uint8
    )

    skin_mask = cv2.inRange(
        hsv,
        lower_skin,
        upper_skin
    )

    # Menghilangkan noise
    kernel = np.ones(
        (5, 5),
        np.uint8
    )

    skin_mask = cv2.morphologyEx(
        skin_mask,
        cv2.MORPH_OPEN,
        kernel
    )

    skin_mask = cv2.morphologyEx(
        skin_mask,
        cv2.MORPH_CLOSE,
        kernel
    )

    # Hitung skin ratio
    skin_pixels = np.count_nonzero(skin_mask)
    total_pixels = skin_mask.size

    skin_ratio = skin_pixels / total_pixels

    print(f"Skin ratio : {skin_ratio:.4f}")

    if skin_ratio < min_skin_ratio:
        return False

    # Connected component
    num_labels, labels, stats, centroids = (
        cv2.connectedComponentsWithStats(
            skin_mask,
            connectivity=8
        )
    )

    if num_labels <= 1:
        return False

    areas = stats[
        1:,
        cv2.CC_STAT_AREA
    ]

    if len(areas) == 0:
        return False

    largest_area = np.max(areas)
    largest_ratio = largest_area / total_pixels

    print(
        f"Largest skin area : "
        f"{largest_ratio:.4f}"
    )

    # Cek luas area kulit
    if largest_ratio < 0.05:
        return False

    # Cek distribusi kulit
    h, w = skin_mask.shape

    regions = [
        skin_mask[:h // 2, :w // 2],
        skin_mask[:h // 2, w // 2:],
        skin_mask[h // 2:, :w // 2],
        skin_mask[h // 2:, w // 2:]
    ]

    valid_regions = 0

    for region in regions:
        region_ratio = (
            np.count_nonzero(region) /
            region.size
        )

        if region_ratio >= 0.05:
            valid_regions += 1

    print(f"Valid regions : {valid_regions}")

    if valid_regions < 2:
        return False

    # Cek warna rata-rata
    skin_pixels_rgb = image[skin_mask > 0]

    if len(skin_pixels_rgb) < 100:
        return False

    mean_color = np.mean(
        skin_pixels_rgb,
        axis=0
    )

    r, g, b = mean_color

    print(
        f"Mean RGB : "
        f"R={r:.2f}, "
        f"G={g:.2f}, "
        f"B={b:.2f}"
    )

    if r < 60 or g < 30 or b < 20:
        return False

    # Gambar valid
    return True