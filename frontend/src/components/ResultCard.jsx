import diseaseInfo from "../data/diseaseInfo";

function ResultCard({ result }) {

  if (!result) {

    return (

      <div className="bg-white rounded-3xl p-6 shadow-lg mt-5">

        <h2 className="font-bold text-xl">
          Hasil Scan
        </h2>

        <div className="text-center py-10 text-gray-400">

          Belum ada hasil scan.

        </div>

      </div>

    );

  }

  const info =
    diseaseInfo[result.prediction];

  return (

    <div className="bg-white rounded-3xl shadow-lg mt-5 overflow-hidden">

      <div className="bg-green-600 text-white p-4">

        <h2 className="text-xl font-bold">

          Hasil Scan

        </h2>

      </div>

      <div className="p-6">

        <div>

          <p className="text-gray-500">

            Penyakit

          </p>

          <h1 className="text-3xl font-bold">

            {info.title}

          </h1>

        </div>

        <div className="mt-5">

          <div className="flex justify-between">

            <span>Confidence</span>

            <span>

              {result.confidence}%

            </span>

          </div>

          <div className="w-full h-3 bg-gray-200 rounded-full mt-2">

            <div
              className="h-3 bg-green-600 rounded-full"
              style={{
                width: `${result.confidence}%`,
              }}
            />

          </div>

        </div>

        <div className="mt-6">

          <h3 className="font-bold">

            Penyebab

          </h3>

          <p className="text-gray-600 mt-2">

            {info.cause}

          </p>

        </div>

        <div className="mt-6">

          <h3 className="font-bold">

            Saran

          </h3>

          <p className="text-gray-600 mt-2">

            {info.treatment}

          </p>

        </div>

      </div>

    </div>

  );

}

export default ResultCard;