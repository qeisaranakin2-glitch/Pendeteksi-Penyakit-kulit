import { useState } from "react";
import axios from "axios";

const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

function UploadCard({ setResult }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setError("Format harus JPG, JPEG, atau PNG.");
      return;
    }

    setError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
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
      setError("");

      const response = await axios.post(
        "https://pendeteksi-penyakit-kulit1.vercel.app/predict",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
    } catch (err) {
      console.log(err);

      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Terjadi error saat menghubungi backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur rounded-3xl p-5 shadow-xl h-full min-h-0 flex flex-col">
      <div className="shrink-0">
        <h2 className="text-2xl font-bold text-gray-800">Upload Gambar</h2>

        <p className="text-gray-500 text-sm mt-1">
          Upload foto kulit dengan format JPG, JPEG, atau PNG.
        </p>
      </div>

      <label className="mt-4 border-2 border-dashed border-emerald-300 bg-emerald-50/50 rounded-3xl flex-1 min-h-0 flex items-center justify-center cursor-pointer overflow-hidden hover:bg-emerald-50 transition">
        {preview ? (
          <div className="w-full h-full overflow-auto flex items-start justify-center bg-white">
            <img
              src={preview}
              alt="Preview"
              className="max-w-full h-auto object-contain"
            />
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <div className="text-6xl">📷</div>

            <p className="mt-3 font-semibold">
              Klik untuk upload gambar
            </p>

            <p className="text-sm mt-1">
              PNG / JPG / JPEG
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
        <div className="mt-3 bg-red-100 text-red-600 rounded-2xl px-4 py-3 text-sm shrink-0">
          {error}
        </div>
      )}

      <button
        onClick={predict}
        disabled={loading}
        className="w-full mt-3 bg-emerald-700 text-white py-3 rounded-2xl font-bold hover:bg-emerald-800 disabled:opacity-60 transition shrink-0"
      >
        {loading ? "Mendeteksi..." : "Mulai Scan"}
      </button>
    </div>
  );
}

export default UploadCard;
