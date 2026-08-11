import cv2
import numpy as np

def is_skin_image(image, min_skin_ratio=0.08):
    image = image.convert("RGB")
    image = np.array(image)

    image = cv2.resize(image, (224, 224))
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    lower_skin = np.array([0, 20, 70], dtype=np.uint8)
    upper_skin = np.array([25, 255, 255], dtype=np.uint8)

    skin_mask = cv2.inRange(hsv, lower_skin, upper_skin)

    skin_ratio = cv2.countNonZero(skin_mask) / (224 * 224)

    return skin_ratio >= min_skin_ratio