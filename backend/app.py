from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import numpy as np
import json

app = Flask(__name__)
CORS(app)

app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024

MODEL_PATH = "model_penyakit_kulit_3kelas_best.keras"
CLASS_NAMES_PATH = "class_names_3kelas.json"

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}
CONFIDENCE_THRESHOLD = 50

model = tf.keras.models.load_model(MODEL_PATH)

with open(CLASS_NAMES_PATH, "r") as f:
    class_names = json.load(f)


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )


def preprocess_image(image):
    image = image.convert("RGB")
    image = image.resize((224, 224))
    image = np.array(image)
    image = np.expand_dims(image, axis=0)
    return image


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "API Prediksi Penyakit Kulit",
        "classes": class_names
    })


@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "Tidak ada gambar."}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "Nama file kosong."}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Format harus JPG/JPEG/PNG."}), 400

    try:
        image = Image.open(file.stream)
        processed_image = preprocess_image(image)

        prediction = model.predict(processed_image, verbose=0)
        probs = prediction[0]

        predicted_index = int(np.argmax(probs))
        predicted_class = class_names[predicted_index]
        confidence = float(probs[predicted_index] * 100)

        probabilities = {
            class_names[i]: round(float(probs[i] * 100), 2)
            for i in range(len(class_names))
        }

        top_indices = np.argsort(probs)[::-1]

        top_predictions = [
            {
                "class": class_names[i],
                "confidence": round(float(probs[i] * 100), 2)
            }
            for i in top_indices
        ]

        print("\n" + "=" * 50)
        print("HASIL PREDIKSI")
        for item in top_predictions:
            print(f"{item['class']} : {item['confidence']}%")
        print("-" * 50)
        print("Prediksi :", predicted_class)
        print("Confidence :", round(confidence, 2))
        print("=" * 50)

        if confidence < CONFIDENCE_THRESHOLD:
            return jsonify({
                "prediction": "Gambar tidak dikenali",
                "confidence": round(confidence, 2),
                "color": "red",
                "valid": False,
                "probabilities": probabilities,
                "top_predictions": top_predictions
            })

        return jsonify({
            "prediction": predicted_class,
            "confidence": round(confidence, 2),
            "color": "green",
            "valid": True,
            "probabilities": probabilities,
            "top_predictions": top_predictions
        })

    except Image.UnidentifiedImageError:
        return jsonify({"error": "File bukan gambar."}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.errorhandler(413)
def too_large(e):
    return jsonify({"error": "Ukuran file maksimal 5 MB."}), 413


if __name__ == "__main__":
    app.run(debug=True)