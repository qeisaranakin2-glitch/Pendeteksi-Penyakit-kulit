import { useState } from "react";
import Header from "./components/Header";
import UploadCard from "./components/UploadCard";
import ResultCard from "./components/ResultCard";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50 px-5 py-4 overflow-hidden">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        <Header />

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4 flex-1 min-h-0">
          <UploadCard setResult={setResult} />
          <ResultCard result={result} />
        </main>
      </div>
    </div>
  );
}

export default App;