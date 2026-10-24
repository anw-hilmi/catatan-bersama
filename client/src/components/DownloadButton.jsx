import { FaDownload } from "react-icons/fa";

export default function DownloadButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-4 right-[4.5rem] sm:bottom-6 sm:right-24 z-50 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-btn-download text-white rounded-full shadow-lg hover:bg-btn-download-dark active:bg-btn-download-dark active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-btn-download-light"
      title="Download Semua Catatan"
      aria-label="Download Semua Catatan"
    >
      <FaDownload className="w-6 h-6" />
    </button>
  );
}
