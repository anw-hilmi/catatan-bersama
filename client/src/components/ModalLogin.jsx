import { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function ModalLogin({
  isOpen,
  onClose,
  onLoginSuccess,
  actionType, // <-- Terima prop actionType
}) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await onLoginSuccess?.(formData);
      setFormData({ username: "", password: "" });
      setShowPassword(false);
      onClose();
    } catch (error) {
      setErrorMsg(error.message || "Username atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrorMsg("");
    setFormData({ username: "", password: "" });
    setShowPassword(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-card-text/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-5 border border-card-border">
        <div className="text-center border-b border-card-border pb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-card-text">Akun</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="p-3 text-sm text-danger bg-danger-light border border-danger/30 rounded-xl text-center font-medium">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-card-text mb-1.5">
              Username
            </label>
            <div className="relative">
              <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-card-muted w-4 h-4" />
              <input
                type="text"
                required
                placeholder="Masukkan username"
                value={formData.username}
                onChange={(e) => {
                  setFormData({ ...formData, username: e.target.value });
                  if (errorMsg) setErrorMsg("");
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-card-header border border-card-border rounded-xl text-card-text text-sm focus:bg-white focus:ring-2 focus:ring-secondary focus:border-secondary transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-card-text mb-1.5">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-card-muted w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Masukkan password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errorMsg) setErrorMsg("");
                }}
                className="w-full pl-10 pr-10 py-2.5 bg-card-header border border-card-border rounded-xl text-card-text text-sm focus:bg-white focus:ring-2 focus:ring-secondary focus:border-secondary transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-card-muted hover:text-card-text transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <FaEyeSlash className="w-4 h-4" />
                ) : (
                  <FaEye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-card-border">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 text-sm font-medium text-card-muted hover:bg-secondary-light hover:text-card-text rounded-xl transition-colors focus:outline-none"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2.5 text-sm font-semibold text-white rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 ${
                actionType === "DELETE"
                  ? "bg-danger hover:bg-danger/90 focus:ring-danger"
                  : "bg-secondary hover:bg-secondary-dark focus:ring-secondary"
              }`}
            >
              {loading
                ? "Memproses..."
                : actionType === "DELETE"
                  ? "Hapus"
                  : actionType === "EDIT"
                    ? "Edit"
                    : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
