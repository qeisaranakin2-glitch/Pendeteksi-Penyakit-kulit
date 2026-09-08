from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import numpy as np
import json
import os

from filter_image.image_validator import is_skin_image

app = Flask(__name__)
CORS(app)

app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024

# Path folder backend
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model_penyakit_kulit_3kelas_best.keras"
)

CLASS_NAMES_PATH = os.path.join(
    BASE_DIR,
    "class_names_3kelas.json"
)

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}
CONFIDENCE_THRESHOLD = 50


# Load model
print("Loading model...")

model = tf.keras.models.load_model(MODEL_PATH)

print("Model berhasil dimuat.")


# Load class names
with open(CLASS_NAMES_PATH, "r", encoding="utf-8") as f:
    class_names = json.load(f)

print("Class names:", class_names)


# Cek format file
def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )


# Preprocess gambar
def preprocess_image(image):
    image = image.convert("RGB")
    image = image.resize((224, 224))
    image = np.array(image)
    image = np.expand_dims(image, axis=0)

    return image


# Halaman utama API
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "API Prediksi Penyakit Kulit",
        "classes": class_names
    })


# Endpoint prediksi
@app.route("/predict", methods=["POST"])
def predict():

    # Cek apakah ada file image
    if "image" not in request.files:
        return jsonify({
            "error": "Tidak ada gambar."
        }), 400

    file = request.files["image"]

    # Cek nama file
    if file.filename == "":
        return jsonify({
            "error": "Nama file kosong."
        }), 400

    # Cek ekstensi
    if not allowed_file(file.filename):
        return jsonify({
            "error": "Format harus JPG/JPEG/PNG."
        }), 400

    try:

        # Buka gambar
        image = Image.open(file.stream)
        image = image.convert("RGB")

        # =========================
        # VALIDASI GAMBAR KULIT
        # =========================

        print("\nIMAGE VALIDATOR")
        print("-" * 40)

        skin_valid = is_skin_image(image)

        print(f"Skin image : {skin_valid}")

        # Jika bukan foto kulit
        if not skin_valid:

            print("STATUS : BUKAN FOTO KULIT")
            print("Model penyakit TIDAK dijalankan.")

            return jsonify({
                "prediction": "Gambar tidak dikenali",
                "confidence": 0,
                "color": "red",
                "valid": False,
                "message": (
                    "Gambar bukan foto kulit yang sesuai. "
                    "Silakan upload foto kulit."
                ),
                "probabilities": {},
                "top_predictions": []
            })


        # =========================
        # JALANKAN MODEL
        # =========================

        print("STATUS : FOTO KULIT")
        print("Menjalankan model penyakit...")

        processed_image = preprocess_image(image)

        prediction = model.predict(
            processed_image,
            verbose=0
        )

        probs = prediction[0]


        # =========================
        # HASIL PREDIKSI
        # =========================

        predicted_index = int(np.argmax(probs))

        predicted_class = class_names[predicted_index]

        confidence = float(
            probs[predicted_index] * 100
        )


        # Probabilitas semua kelas
        probabilities = {
            class_names[i]: round(
                float(probs[i] * 100),
                2
            )
            for i in range(len(class_names))
        }


        # Urutkan confidence tertinggi
        top_indices = np.argsort(probs)[::-1]

        top_predictions = [
            {
                "class": class_names[i],
                "confidence": round(
                    float(probs[i] * 100),
                    2
                )
            }
            for i in top_indices
        ]


        # Log di terminal
        print("\nHASIL PREDIKSI")
        print("-" * 40)

        for item in top_predictions:
            print(
                f"{item['class']} : "
                f"{item['confidence']}%"
            )

        print("-" * 40)

        print("Prediksi :", predicted_class)
        print("Confidence :", round(confidence, 2))


        # =========================
        # CEK CONFIDENCE
        # =========================

        if confidence < CONFIDENCE_THRESHOLD:

            return jsonify({
                "prediction": "Gambar tidak dikenali",
                "confidence": round(confidence, 2),
                "color": "red",
                "valid": False,
                "message": "Hasil prediksi terlalu rendah.",
                "probabilities": probabilities,
                "top_predictions": top_predictions
            })


        # =========================
        # HASIL VALID
        # =========================

        return jsonify({
            "prediction": predicted_class,
            "confidence": round(confidence, 2),
            "color": "green",
            "valid": True,
            "message": "Gambar berhasil dianalisis.",
            "probabilities": probabilities,
            "top_predictions": top_predictions
        })


    # File bukan gambar
    except Image.UnidentifiedImageError:

        return jsonify({
            "error": "File bukan gambar."
        }), 400


    # Error lainnya
    except Exception as e:

        print("ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500


# Batas ukuran file
@app.errorhandler(413)
def too_large(e):

    return jsonify({
        "error": "Ukuran file maksimal 5 MB."
    }), 413


# Jalankan server lokal
if __name__ == "__main__":
    app.run(debug=True)
