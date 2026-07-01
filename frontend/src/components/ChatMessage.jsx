function ChatMessage({ sender, message }) {

    const isBot = sender === "bot";

    return (

        <div
            className={`flex mb-4 ${
                isBot
                    ? "justify-start"
                    : "justify-end"
            }`}
        >

            <div
                className={`max-w-[80%] rounded-3xl px-5 py-4 shadow ${
                    isBot
                        ? "bg-gray-100 text-gray-800"
                        : "bg-emerald-600 text-white"
                }`}
            >

                <p className="font-bold text-sm mb-2">

                    {isBot ? "🤖 SkinCare AI" : "👤 Anda"}

                </p>

                <p className="whitespace-pre-line">

                    {message}

                </p>

            </div>

        </div>

    );

}

export default ChatMessage;