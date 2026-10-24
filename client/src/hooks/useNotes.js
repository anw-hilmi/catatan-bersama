import { useState, useCallback, useEffect } from "react";
import { asBlob } from "html-docx-js-typescript";
import { saveAs } from "file-saver";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const useNotes = (category) => {
  const [notes, setNotes] = useState(() => {
    const cached = localStorage.getItem(`catatan_${category}`);
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem(`catatan_${category}`, JSON.stringify(notes));
    }
  }, [notes, category]);

  const fetchNotes = useCallback(
    async (search = "") => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/${category}?search=${search}`);
        const result = await res.json();
        if (result.status === "success") {
          setNotes(result.data);
          if (!search) {
            localStorage.setItem(
              `catatan_${category}`,
              JSON.stringify(result.data),
            );
          }
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [category],
  );

  const createNote = async (payload) => {
    const isFormData = payload instanceof FormData;

    const res = await fetch(`${API_BASE_URL}/${category}`, {
      method: "POST",
      headers: isFormData ? {} : { "Content-Type": "application/json" },
      body: isFormData ? payload : JSON.stringify(payload),
    });
    const result = await res.json();
    if (result.status === "success") await fetchNotes();
    return result;
  };

  const updateNote = async (id, payload) => {
    const isFormData = payload instanceof FormData;

    const res = await fetch(`${API_BASE_URL}/${category}/${id}`, {
      method: "PUT",
      headers: isFormData ? {} : { "Content-Type": "application/json" },
      body: isFormData ? payload : JSON.stringify(payload),
    });
    const result = await res.json();
    if (result.status === "success") await fetchNotes();
    return result;
  };

  const deleteNote = async (id, credentials) => {
    const res = await fetch(`${API_BASE_URL}/${category}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const result = await res.json();
    if (result.status === "success") await fetchNotes();
    return result;
  };

  const downloadAllNotes = async () => {
    if (notes.length === 0) return alert("Tidak ada catatan untuk diunduh");

    const contentHTML = notes
      .map((n) => {
        const date = n.created_at
          ? new Date(n.created_at).toLocaleDateString("id-ID")
          : "-";

        // Mengambil daftar URL PDF (baik tunggal maupun multiple)
        const pdfList = Array.isArray(n.pdfUrls || n.files)
          ? n.pdfUrls || n.files
          : n.pdfUrl
            ? [n.pdfUrl]
            : [];

        const filesListHTML =
          pdfList.length > 0
            ? pdfList
                .map(
                  (url, idx) =>
                    `<li><a href="${url}">Unduh Lampiran PDF ${idx + 1}</a></li>`,
                )
                .join("")
            : "<li><em>Tidak ada lampiran PDF</em></li>";

        return `
        <div style="margin-bottom: 30px;">
          <h2 style="margin: 0 0 5px 0; color: #44403c;">${n.title}</h2>
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #78716c;"><strong>Tanggal:</strong> ${date}</p>
          <p style="margin: 0 0 5px 0; font-size: 13px;"><strong>Daftar Lampiran PDF:</strong></p>
          <ul>${filesListHTML}</ul>
          <hr style="margin-top: 20px; border: 1px solid #e7e5e4;"/>
        </div>
      `;
      })
      .join("");

    const htmlString = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: sans-serif; color: #57534e; font-size: 11pt; }
          h1 { font-size: 16pt; font-weight: bold; margin-bottom: 10px; }
          h2 { font-size: 14pt; font-weight: bold; margin-bottom: 10px; }
          p { margin: 0 0 10px 0; }
          ul { margin: 0 0 10px 20px; list-style-type: disc; }
          li { margin-bottom: 5px; }
          a { color: #2563eb; text-decoration: underline; }
        </style>
      </head>
      <body>${contentHTML}</body>
    </html>
  `;

    const converted = await asBlob(htmlString);
    saveAs(converted, `Daftar_Doa_PDF_${category}.docx`);
  };

  return {
    notes,
    loading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    downloadAllNotes,
  };
};
