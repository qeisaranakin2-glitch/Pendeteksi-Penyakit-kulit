import { useState } from "react";

import Header from "./components/Header";
import UploadCard from "./components/UploadCard";
import ResultCard from "./components/ResultCard";
import ChatBox from "./components/ChatBox";

import diseaseInfo from "./data/diseaseInfo";

function App() {

    const [result,setResult] = useState(null);

    const info = result
        ? diseaseInfo[result.prediction]
        : null;

    return (

        <main className="min-h-screen bg-slate-100">

            <div className="max-w-7xl mx-auto p-8">

                <Header/>

                <div className="grid lg:grid-cols-2 gap-8 mt-8">

                    <div>

                        <UploadCard
                            setResult={setResult}
                        />

                        <ResultCard
                            result={result}
                        />

                    </div>

                    <div>

                        <ChatBox
                            result={result}
                            info={info}
                        />

                    </div>

                </div>

            </div>

        </main>

    );

}

export default App;