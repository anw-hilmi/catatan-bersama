import { RichTextEditor } from "./RichTextEditor";
import { useState, useEffect } from "react";

export default function ModalEditor({
  isOpen,
  onClose,
  onSubmit,
  defaultValue = {},
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [prevProps, setPrevProps] = useState({ isOpen: false, defaultValue });

  useEffect(() => {
    if (isOpen) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setTitle(defaultValue?.title || "");
      setContent(defaultValue?.content || "");
      setErrorMsg("");
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [isOpen, defaultValue]);

  if (isOpen !== prevProps.isOpen || defaultValue !== prevProps.defaultValue) {
    setPrevProps({ isOpen, defaultValue });
    if (isOpen) {
      setTitle(defaultValue.title || "");
      setContent(
        defaultValue.content ||
          (typeof defaultValue === "string" ? defaultValue : ""),
      );
    }
  }

  if (!isOpen) return null;

  const handleSave = () => {
    const isBodyEmpty =
      !content || content.replace(/<[^>]*>?/gm, "").trim() === "";

    if (!title.trim() || isBodyEmpty) {
      return setErrorMsg("Judul dan isi catatan tidak boleh kosong!"); // <-- Ubah di sini
    }

    setErrorMsg(""); // Kosongkan error jika sukses
    onSubmit({ title: title.toUpperCase(), content });
    setTitle("");
    setContent("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-stone-100 space-y-5 max-h-[95vh] overflow-y-auto">
        <div className="border-b border-stone-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-800">
            Form Catatan
          </h2>
        </div>

        <div className="space-y-5">
          {/* Penampil Pesan Error (No 3 ditaruh di sini) */}
          {errorMsg && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl text-center font-medium">
              {errorMsg}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">
              Judul
            </label>
            <input
              type="text"
              value={title}
              // Taruh onChange di sini
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              placeholder="MASUKKAN JUDUL..."
              className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-stone-200 rounded-xl text-stone-800 font-bold uppercase tracking-wide focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">
              Konten
            </label>
            {/* Wrapper tambahan agar RichTextEditor menyatu dengan tema */}
            <div className="rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 transition-all">
              <RichTextEditor value={content} onChange={setContent} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 rounded-xl transition-colors focus:outline-none"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
