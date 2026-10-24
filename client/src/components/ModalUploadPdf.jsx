import { useState } from "react";

export default function ModalUploadPdf({
  isOpen,
  onClose,
  onSubmit,
  defaultValue,
  editingItem,
  actionType = "ADD",
}) {
  const activeData = defaultValue || editingItem || {};

  const [title, setTitle] = useState("");
  const [files, setFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [prevProps, setPrevProps] = useState({ isOpen, activeData });

  if (isOpen !== prevProps.isOpen || activeData !== prevProps.activeData) {
    setPrevProps({ isOpen, activeData });
    if (isOpen) {
      setTitle(activeData.title || "");
      setFiles([]);
      // Aman dari null/undefined:
      const rawPaths = activeData.pdf_paths || activeData.pdfUrls || [];
      setExistingFiles(Array.isArray(rawPaths) ? rawPaths.filter(Boolean) : []);
      setErrorMsg("");
    }
  }

  if (!isOpen) return null;

  const handleRemoveExistingFile = (index) => {
    setExistingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const pdfFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf",
    );

    if (pdfFiles.length < selectedFiles.length) {
      setErrorMsg("Hanya file berformat PDF yang diperbolehkan!");
    } else if (errorMsg) {
      setErrorMsg("");
    }

    setFiles((prev) => [...prev, ...pdfFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title.trim()) {
      return setErrorMsg("Judul doa/catatan tidak boleh kosong!");
    }

    if (actionType === "ADD" && files.length === 0) {
      return setErrorMsg("Pilih minimal 1 file PDF untuk diunggah!");
    }

    setErrorMsg("");

    const formData = new FormData();
    formData.append("title", title.toUpperCase());

    files.forEach((file) => {
      formData.append("pdfFiles", file);
    });

    existingFiles.forEach((path) => {
      formData.append("existingPdfPaths", path);
    });

    onSubmit(formData);
    setTitle("");
    setFiles([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-stone-100 space-y-5 max-h-[95vh] overflow-y-auto">
        <div className="border-b border-stone-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-800">
            {actionType === "EDIT"
              ? "Edit Form PDF Doa"
              : "Form Tambah PDF Doa"}
          </h2>
        </div>

        <div className="space-y-5">
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

          {actionType === "EDIT" && existingFiles.length > 0 && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider">
                File Terpasang Saat Ini ({existingFiles.length}):
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto border border-stone-200 rounded-xl p-2 bg-stone-50">
                {existingFiles.map((url, idx) => {
                  const rawName = url.split("/").pop().split("?")[0] || "";
                  const hexPart = rawName.replace(/^[^-]+-\d+-\d+-/, "");

                  const fileName = (() => {
                    try {
                      return decodeURIComponent(
                        hexPart.replace(/(..)/g, "%$1"),
                      );
                    } catch {
                      return hexPart || rawName || `File Doa ${idx + 1}.pdf`;
                    }
                  })();

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs text-stone-600 bg-white p-2.5 rounded-lg border border-stone-200 shadow-sm"
                    >
                      <span className="truncate max-w-[80%] font-medium">
                        📄 {fileName}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingFile(idx)}
                        className="text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded-md transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">
              {actionType === "EDIT"
                ? "Tambah File PDF Baru (Opsional)"
                : "Upload File PDF (Bisa pilih multiple)"}
            </label>
            <input
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleFileChange}
              className="w-full text-sm text-stone-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer transition-colors"
            />
          </div>

          {files.length > 0 && (
            <div className="max-h-40 overflow-y-auto border border-stone-200 rounded-xl p-3 space-y-2 bg-[#FAF8F5]">
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                File Baru Terpilih ({files.length}):
              </p>
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-stone-200 shadow-sm"
                >
                  <span className="truncate max-w-[80%] font-medium text-stone-700">
                    📄 {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    className="text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded-md transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          )}
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
