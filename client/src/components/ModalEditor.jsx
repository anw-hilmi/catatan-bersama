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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-card-text/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-card-border space-y-5 max-h-[95vh] overflow-y-auto">
        <div className="border-b border-card-border pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-card-text">
            Form Catatan
          </h2>
        </div>

        <div className="space-y-5">
          {/* Penampil Pesan Error */}
          {errorMsg && (
            <div className="p-3 text-sm text-danger bg-danger-light border border-danger/30 rounded-xl text-center font-medium">
              {errorMsg}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-card-text mb-1.5">
              Judul
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              placeholder="MASUKKAN JUDUL..."
              className="w-full px-4 py-2.5 bg-card-header border border-card-border rounded-xl text-card-text font-bold uppercase tracking-wide focus:bg-white focus:ring-2 focus:ring-secondary focus:border-secondary transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-card-text mb-1.5">
              Konten
            </label>
            {/* Wrapper tambahan agar RichTextEditor menyatu dengan tema */}
            <div className="rounded-xl overflow-hidden border border-card-border focus-within:ring-2 focus-within:ring-secondary transition-all">
              <RichTextEditor value={content} onChange={setContent} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-card-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-card-muted hover:bg-secondary-light hover:text-card-text rounded-xl transition-colors focus:outline-none"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-secondary hover:bg-secondary-dark active:bg-secondary-dark rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-1"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
