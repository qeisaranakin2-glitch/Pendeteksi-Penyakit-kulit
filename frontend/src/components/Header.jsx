function Header() {
  return (
    <header className="bg-gradient-to-r from-emerald-700 to-teal-600 rounded-3xl px-6 py-4 shadow-xl text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">🩺 SkinCare AI</h1>
          <p className="text-sm mt-1 text-white/80">
            Deteksi Penyakit Kulit Menggunakan MobileNetV2
          </p>
        </div>

        <div className="bg-white/20 px-4 py-2 rounded-full text-sm">
          ● Online
        </div>
      </div>
    </header>
  );
}

export default Header;