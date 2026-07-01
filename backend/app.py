from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import numpy as np
import json

app = Flask(__name__)
CORS(app)

# Maksimal upload 5 MB
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024

MODEL_PATH = "model_penyakit_kulit_3kelas_best.keras"
CLASS_NAMES_PATH = "class_names_3kelas.json"

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}

# ===========================
# LOAD MODEL
# ===========================

model = tf.keras.models.load_model(MODEL_PATH)

with open(CLASS_NAMES_PATH, "r") as f:
    class_names = json.load(f)

print("=" * 50)
print("Model berhasil dimuat")
print("Class Names :", class_names)
print("=" * 50)


# ===========================
# VALIDASI FILE
# ===========================

def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )


# ===========================
# PREPROCESS IMAGE
# ===========================

def preprocess_image(image):
    image = image.convert("RGB")
    image = image.resize((224, 224))

    image = np.array(image)
    image = np.expand_dims(image, axis=0)

    return image


# ===========================
# HOME
# ===========================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "API Prediksi Penyakit Kulit",
        "classes": class_names
    })


# ===========================
# PREDICT
# ===========================

@app.route("/predict", methods=["POST"])
def predict():

    if "image" not in request.files:
        return jsonify({
            "error": "Tidak ada gambar."
        }), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({
            "error": "Nama file kosong."
        }), 400

    if not allowed_file(file.filename):
        return jsonify({
            "error": "Format harus JPG/JPEG/PNG."
        }), 400

    try:

        image = Image.open(file.stream)
        processed_image = preprocess_image(image)

        prediction = model.predict(processed_image, verbose=0)

        predicted_index = np.argmax(prediction)

        predicted_class = class_names[predicted_index]

        confidence = float(prediction[0][predicted_index] * 100)

        # ===========================
        # DEBUG
        # ===========================

        print("\n" + "=" * 50)
        print("HASIL PREDIKSI")

        for i, cls in enumerate(class_names):
            print(f"{cls} : {prediction[0][i]*100:.2f}%")

        print("-" * 50)
        print("Prediksi :", predicted_class)
        print("Confidence :", confidence)
        print("=" * 50)

        return jsonify({
            "prediction": predicted_class,
            "confidence": round(confidence, 2),
            "probabilities": {
                class_names[i]: round(float(prediction[0][i] * 100), 2)
                for i in range(len(class_names))
            }
        })

    except Image.UnidentifiedImageError:
        return jsonify({
            "error": "File bukan gambar."
        }), 400

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# ===========================
# FILE TERLALU BESAR
# ===========================

@app.errorhandler(413)
def too_large(e):
    return jsonify({
        "error": "Ukuran file maksimal 5 MB."
    }), 413


# ===========================
# RUN
# ===========================

if __name__ == "__main__":
    app.run(debug=True)