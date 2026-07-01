import { useState } from "react";
import axios from "axios";

const allowedTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
];

function UploadCard({ setResult }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setError("Format harus JPG atau PNG.");
      return;
    }

    setError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const predict = async () => {
    if (!image) {
      setError("Upload gambar terlebih dahulu.");
      return;
    }

    const form = new FormData();
    form.append("image", image);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        form,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setResult(response.data);
    } catch (err) {
      console.log(err);

      setError(
        "Backend Flask belum berjalan."
      );
    }

    setLoading(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl">

      <h2 className="text-2xl font-bold">
        Upload Gambar
      </h2>

      <p className="text-gray-500 mt-2 mb-4">
        Upload foto kulit untuk diprediksi.
      </p>

      <label className="border-2 border-dashed rounded-2xl h-80 flex items-center justify-center cursor-pointer overflow-hidden">

        {preview ? (
          <img
            src={preview}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">

            <div className="text-6xl">
              📷
            </div>

            <p className="mt-3">
              Klik untuk upload gambar
            </p>

          </div>
        )}

        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          hidden
          onChange={handleImage}
        />

      </label>

      {error && (
        <div className="mt-4 bg-red-100 text-red-600 rounded-xl p-3">
          {error}
        </div>
      )}

      <button
        onClick={predict}
        disabled={loading}
        className="w-full mt-5 bg-[#294f46] text-white py-4 rounded-xl font-bold hover:bg-[#1d3933]"
      >
        {loading
          ? "Mendeteksi..."
          : "Mulai Scan"}
      </button>
    </div>
  );
}

export default UploadCard;