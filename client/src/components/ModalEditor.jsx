import { RichTextEditor } from "./RichTextEditor";
import { useState } from "react";

export default function ModalEditor({
  isOpen,
  onClose,
  onSubmit,
  defaultValue = {},
  editingItem,
  actionType = "ADD",
}) {
  const activeData = editingItem || defaultValue || {};

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [prevProps, setPrevProps] = useState({ isOpen: false, activeData });

  // Reset/sync state saat render jika props berubah (bebas dari warning useEffect)
  if (isOpen !== prevProps.isOpen || activeData !== prevProps.activeData) {
    setPrevProps({ isOpen, activeData });
    if (isOpen) {
      setTitle(activeData.title || "");
      setContent(
        activeData.body ||
          activeData.content ||
          (typeof activeData === "string" ? activeData : ""),
      );
      setErrorMsg("");
    }
  }

  if (!isOpen) return null;

  const handleSave = () => {
    const isBodyEmpty =
      !content || content.replace(/<[^>]*>?/gm, "").trim() === "";

    if (!title.trim() || isBodyEmpty) {
      return setErrorMsg("Judul dan isi catatan tidak boleh kosong!");
    }

    setErrorMsg("");
    // Kirim HANYA 'body'
    onSubmit({
      title: title.toUpperCase(),
      body: content,
    });
    setTitle("");
    setContent("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-stone-100 space-y-5 max-h-[95vh] overflow-y-auto">
        <div className="border-b border-stone-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-800">
            {actionType === "EDIT" ? "Edit Catatan" : "Tambah Catatan"}
          </h2>
        </div>

        <div className="space-y-4">
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
              Isi Catatan
            </label>
            <RichTextEditor content={content} onChange={setContent} />
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
