import { useState, useEffect, useCallback } from "react";
import { FaEdit, FaSave, FaUserShield, FaTimes } from "react-icons/fa";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function EditSandi({ token }) {
  const [groupedItems, setGroupedItems] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ username: "", password: "" });

  const fetchAllData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/credentials`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (result.status !== "success") throw new Error(result.message);

      // Simpan data langsung dalam bentuk objek (berdasarkan kategori/tabel)
      setGroupedItems(result.data);
    } catch (error) {
      alert(error.message || "Gagal mengambil data");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const loadData = async () => {
      await fetchAllData();
    };
    loadData();
  }, [fetchAllData]);

  const handleEditClick = (category, item) => {
    setEditingId(`${category}-${item.id}`);
    setEditForm({ username: item.username, password: item.password });
  };

  const handleSave = async (category, item) => {
    if (!editForm.username || !editForm.password) {
      return alert("Username dan password baru tidak boleh kosong!");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/credentials`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tableName: category,
          id: item.id,
          username: editForm.username,
          password: editForm.password,
        }),
      });

      const result = await response.json();
      if (result.status !== "success") throw new Error(result.message);

      await fetchAllData();
      setEditingId(null);
    } catch (error) {
      alert(error.message || "Gagal menyimpan perubahan");
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full p-4 sm:p-6">
      <div className="bg-white rounded-2xl border border-card-border shadow-sm overflow-hidden">
        {/* Header Tema Cream */}
        <div className="p-5 sm:p-6 border-b border-card-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card-header">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-card-text flex items-center gap-2">
              <FaUserShield className="text-secondary" />
              Kelola Data & Sandi Catatan
            </h2>
            <p className="text-sm sm:text-base text-card-muted mt-1">
              Manajemen kredensial untuk setiap tabel terpisah
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6 lg:p-8">
          {isLoading ? (
            <p className="text-center text-card-muted py-8 font-medium">
              Memuat data...
            </p>
          ) : (
            Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="mb-10 last:mb-0">
                <h3 className="text-lg font-bold text-card-text capitalize mb-4 pl-3 border-l-4 border-secondary">
                  Tabel: {category.replace("_", " ")}
                </h3>
                <div className="overflow-x-auto border border-card-border rounded-xl shadow-sm">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-card-header text-xs font-semibold text-card-muted uppercase tracking-wider border-b border-card-border">
                        <th className="px-6 py-4 w-16 text-center">No</th>
                        <th className="px-6 py-4">Judul</th>
                        <th className="px-6 py-4">Username</th>
                        <th className="px-6 py-4">Password</th>
                        <th className="px-6 py-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border/60 text-sm">
                      {items.map((item, index) => {
                        const uniqueId = `${category}-${item.id}`;
                        const isEditing = editingId === uniqueId;

                        return (
                          <tr
                            key={uniqueId}
                            className="hover:bg-primary-light/40 transition-colors"
                          >
                            <td className="px-6 py-4 font-medium text-card-muted text-center">
                              {index + 1}
                            </td>

                            <td className="px-6 py-4 font-medium text-card-text">
                              {item.title || "-"}
                            </td>

                            <td className="px-6 py-4">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editForm.username}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      username: e.target.value,
                                    })
                                  }
                                  className="w-full min-w-32 px-3 py-1.5 bg-white border border-card-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                                  placeholder="Username baru"
                                />
                              ) : (
                                <span className="font-semibold text-card-text">
                                  {item.username}
                                </span>
                              )}
                            </td>

                            <td className="px-6 py-4">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editForm.password}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      password: e.target.value,
                                    })
                                  }
                                  className="w-full min-w-32 px-3 py-1.5 bg-white border border-card-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                                  placeholder="Password baru"
                                />
                              ) : (
                                <span className="font-mono text-card-text bg-card-header px-2.5 py-1.5 rounded-md text-sm border border-card-border">
                                  {item.password}
                                </span>
                              )}
                            </td>

                            <td className="px-6 py-4 text-right">
                              {isEditing ? (
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setEditingId(null)}
                                    className="p-2 text-card-muted bg-secondary-light hover:bg-card-border rounded-lg transition-colors focus:outline-none"
                                  >
                                    <FaTimes className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSave(category, item)}
                                    className="p-2 text-white bg-success hover:bg-success-dark rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-success-light focus:ring-offset-1"
                                  >
                                    <FaSave className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEditClick(category, item)
                                    }
                                    className="p-2 text-secondary bg-secondary-light hover:bg-primary-light hover:text-secondary-dark rounded-lg transition-all focus:outline-none"
                                  >
                                    <FaEdit className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {items.length === 0 && (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-6 py-8 text-center text-card-muted font-medium"
                          >
                            Belum ada data.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
