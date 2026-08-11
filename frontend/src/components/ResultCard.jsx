import diseaseInfo from "../data/diseaseInfo";

function ResultCard({ result }) {
  if (!result) {
    return (
      <div className="bg-white/90 backdrop-blur rounded-3xl p-5 shadow-xl h-full flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800">Hasil Scan</h2>
        <p className="text-gray-500 text-sm mt-1">
          Hasil prediksi akan muncul di sini.
        </p>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-7xl mb-4">🔍</div>
            <p className="text-lg font-semibold">Belum ada hasil scan</p>
            <p className="text-sm mt-1">
              Upload gambar terlebih dahulu lalu tekan Mulai Scan.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const predictionKey = String(result.prediction || "").toLowerCase();
  const info = diseaseInfo[predictionKey];

  const isInvalid =
    result.valid === false ||
    result.color === "red" ||
    !info;

  if (isInvalid) {
    return (
      <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl h-full overflow-hidden flex flex-col">
        <div className="bg-red-600 text-white px-5 py-4">
          <h2 className="text-2xl font-bold">Hasil Scan</h2>
          <p className="text-sm text-white/80">Gambar tidak dikenali</p>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div>
            <div className="text-7xl mb-4">⚠️</div>

            <h1 className="text-3xl font-bold text-red-600">
              {result.prediction || "Gambar tidak dikenali"}
            </h1>

            <p className="mt-4 text-gray-600 max-w-md">
              Gambar yang diunggah tidak dapat dikenali oleh sistem.
              Gunakan foto kulit yang lebih jelas dan tidak terlalu blur.
            </p>

            <div className="mt-6 bg-red-50 rounded-2xl p-4">
              <p className="text-sm font-semibold text-gray-600">Confidence</p>
              <p className="text-red-600 text-3xl font-bold">
                {result.confidence ?? 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl h-full overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white px-5 py-4">
        <h2 className="text-2xl font-bold">Hasil Scan</h2>
        <p className="text-sm text-white/80">Prediksi penyakit kulit</p>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="bg-emerald-50 rounded-3xl p-5">
          <p className="text-gray-500 text-sm">Penyakit</p>
          <h1 className="text-4xl font-bold text-emerald-800 mt-1">
            {info.title}
          </h1>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-gray-700">Confidence</p>
              <p className="text-emerald-700 font-bold">
                {result.confidence ?? 0}%
              </p>
            </div>

            <div className="w-full bg-emerald-100 rounded-full h-4 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{
                  width: `${Math.min(result.confidence ?? 0, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 mt-4 text-sm">
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-bold text-gray-800">Penyebab</h3>
            <p className="text-gray-600 mt-1">{info.cause}</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-bold text-gray-800">Gejala</h3>
            <p className="text-gray-600 mt-1">{info.symptom}</p>
          </div>

          <div className="bg-yellow-50 rounded-2xl p-4 text-yellow-800">
            <h3 className="font-bold">Saran</h3>
            <p className="mt-1">{info.treatment}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultCard;