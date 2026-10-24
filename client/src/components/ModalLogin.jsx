import { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function ModalLogin({
  isOpen,
  onClose,
  onLoginSuccess,
  actionType,
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
      // Pastikan data selalu bertipe string agar lolos validasi Joi backend
      const payload = {
        username: String(formData.username),
        password: String(formData.password),
      };

      await onLoginSuccess?.(payload);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-5 border border-stone-100">
        <div className="text-center border-b border-stone-100 pb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-800">Akun</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl text-center font-medium">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">
              Username
            </label>
            <div className="relative">
              <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                type="text"
                required
                placeholder="Masukkan username"
                value={formData.username}
                onChange={(e) => {
                  setFormData({ ...formData, username: e.target.value });
                  if (errorMsg) setErrorMsg("");
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-stone-200 rounded-xl text-stone-800 text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Masukkan password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errorMsg) setErrorMsg("");
                }}
                className="w-full pl-10 pr-10 py-2.5 bg-[#FAF8F5] border border-stone-200 rounded-xl text-stone-800 text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <FaEyeSlash className="w-4 h-4" />
                ) : (
                  <FaEye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 rounded-xl transition-colors focus:outline-none"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:bg-amber-400 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
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
