import { useEffect, useRef, useState } from "react";

import ChatMessage from "./ChatMessage";
import { getBotReply } from "../utils/chatbot";

function ChatBox({ result, info }) {

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([]);

  const bottomRef = useRef();

  useEffect(() => {

    if (result && info) {

      setMessages([
        {
          sender: "bot",
          message:
            `Halo 👋

Hasil scan menunjukkan kemungkinan:

🩺 ${info.title}

📊 Confidence : ${result.confidence}%

Silakan tanyakan mengenai:

• Penyebab
• Gejala
• Cara mengobati
• Tingkat bahaya
• Akurasi hasil`
        }
      ]);

    }

  }, [result]);



  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);



  const sendMessage = () => {

    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      message: input,
    };

    const botMessage = {
      sender: "bot",
      message: getBotReply(
        input,
        result,
        info
      ),
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
      botMessage,
    ]);

    setInput("");

  };



  const handleKeyDown = (e) => {

    if (e.key === "Enter") {

      sendMessage();

    }

  };



  return (

    <div className="bg-[#202722] rounded-3xl p-6 text-white flex flex-col h-[700px] shadow-xl">

      <div className="border-b border-white/10 pb-4">

        <h2 className="text-2xl font-bold">
          🤖 SkinCare Assistant
        </h2>

        <p className="text-sm text-white/60 mt-1">
          Tanyakan apa saja mengenai hasil scan kulit Anda.
        </p>

      </div>



      <div className="flex-1 overflow-y-auto mt-5 pr-2">

        {messages.map((chat, index) => (

          <ChatMessage
            key={index}
            sender={chat.sender}
            message={chat.message}
          />

        ))}

        <div ref={bottomRef}></div>

      </div>



      <div className="mt-4 flex gap-3">

        <input

          value={input}

          onChange={(e) =>
            setInput(e.target.value)
          }

          onKeyDown={handleKeyDown}

          placeholder="Tulis pertanyaan..."

          className="flex-1 rounded-xl px-4 py-3 text-black outline-none"

        />

        <button

          onClick={sendMessage}

          className="bg-green-600 hover:bg-green-700 px-6 rounded-xl font-semibold"

        >

          Kirim

        </button>

      </div>

    </div>

  );

}

export default ChatBox;