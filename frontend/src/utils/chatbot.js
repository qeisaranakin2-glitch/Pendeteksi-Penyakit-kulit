import knowledgeBase from "../data/knowledgeBase";

export function getBotReply(message, result, info) {

  if (!result || !info) {
    return "Silakan lakukan scan gambar terlebih dahulu agar saya dapat membantu menjelaskan hasilnya.";
  }

  const text = message.toLowerCase();

  const contains = (words) =>
    words.some((word) => text.includes(word));

  // penyebab
  if (contains(knowledgeBase.cause)) {
    return info.cause;
  }

  // gejala
  if (contains(knowledgeBase.symptom)) {
    return info.symptom;
  }

  // pengobatan
  if (contains(knowledgeBase.treatment)) {
    return info.treatment;
  }

  // bahaya
  if (contains(knowledgeBase.danger)) {
    return info.danger;
  }

  // akurasi
  if (contains(knowledgeBase.accuracy)) {
    return `Model mendeteksi kemungkinan ${info.title} dengan confidence ${result.confidence}%. Namun hasil ini hanya prediksi AI dan bukan diagnosis dokter.`;
  }

  // sapaan
  if (
    text.includes("halo") ||
    text.includes("hai") ||
    text.includes("hi")
  ) {
    return `Halo 👋 Saya SkinCare Assistant.

Saya siap membantu menjelaskan hasil scan kulit Anda.

Silakan tanyakan mengenai:

• Penyebab
• Gejala
• Cara mengobati
• Tingkat bahaya
• Tingkat akurasi hasil`;
  }

  return `Maaf, saya hanya dapat menjawab pertanyaan yang berkaitan dengan hasil deteksi penyakit kulit.

Contoh pertanyaan yang dapat Anda ajukan:

• Kenapa bisa seperti ini?
• Apa gejalanya?
• Apakah berbahaya?
• Bagaimana cara mengobatinya?
• Apakah hasil ini akurat?`;
}