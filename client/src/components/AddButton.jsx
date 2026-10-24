import { FaPlus } from "react-icons/fa";

export default function AddButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-btn-add text-white rounded-full shadow-lg hover:bg-btn-add-dark active:bg-btn-add-dark active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-btn-add-light"
      title="Tambah Card"
      aria-label="Tambah Card"
    >
      <FaPlus className="w-6 h-6" />
    </button>
  );
}
