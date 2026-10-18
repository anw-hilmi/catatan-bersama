import { FaInfoCircle, FaVideo, FaWhatsapp } from "react-icons/fa";

export default function Informasi() {
  const tutorials = [
    {
      id: 1,
      title: "Cara Menambah Catatan",
      videoUrl: "https://www.youtube.com/embed4w9WgXcQ",
    },
    {
      id: 2,
      title: "Cara Mengelola Kredensial Admin",
      videoUrl: "https://www.youtube.com/embQw4w9WgXcQ",
    },
    {
      id: 3,
      title: "Cara Mengunduh Catatan",
      videoUrl: "https://www.youtube.com/embed/dQw4gXcQ",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full p-4 sm:p-6">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {/* Header (Tema Cream) */}
        <div className="p-5 sm:p-6 border-b border-stone-100 bg-[#FAF8F5]">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-800 flex items-center gap-2">
            <FaInfoCircle className="text-amber-600" />
            Pusat Informasi & Bantuan
          </h2>
          <p className="text-sm sm:text-base text-stone-500 mt-1.5">
            Panduan penggunaan website dan bantuan teknis.
          </p>
        </div>

        <div className="p-5 sm:p-6 lg:p-8">
          {/* Bagian Video Tutorial */}
          <h3 className="text-lg sm:text-xl font-bold text-stone-800 mb-5 flex items-center gap-2 border-l-4 border-amber-500 pl-3">
            <FaVideo className="text-amber-500" />
            Video Tutorial Penggunaan
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-10">
            {tutorials.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="aspect-video bg-stone-100 relative">
                  <iframe
                    className="w-full h-full absolute top-0 left-0"
                    src={video.videoUrl}
                    title={video.title}
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-4 bg-white">
                  <h4 className="font-semibold text-stone-700 text-sm group-hover:text-amber-700 transition-colors">
                    {video.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          {/* Bagian Kontak Bantuan (Aksen Emerald/Hijau Alam) */}
          <div className="bg-emerald-50/50 rounded-2xl p-6 sm:p-8 border border-emerald-100 text-center shadow-sm">
            <h3 className="text-lg sm:text-xl font-bold text-emerald-800 mb-2">
              Mengalami Masalah atau Kendala?
            </h3>
            <p className="text-sm sm:text-base text-emerald-700/80 mb-6 max-w-2xl mx-auto">
              Jika ada masalah mengenai website ini, menemukan <i>bug</i>, atau
              butuh bantuan lebih lanjut, silakan menghubungi nomor WhatsApp di
              bawah ini.
            </p>
            <a
              href="https://wa.me/6281232787293"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-3 px-6 sm:px-8 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-md text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-emerald-200"
            >
              <FaWhatsapp className="w-5 h-5 sm:w-6 sm:h-6" />
              Hubungi Admin via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
