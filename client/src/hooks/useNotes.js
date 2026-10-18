import { useState, useCallback, useEffect } from "react";
import { asBlob } from "html-docx-js-typescript";
import { saveAs } from "file-saver";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const useNotes = (category) => {
  // Read initial data from localStorage if available
  const [notes, setNotes] = useState(() => {
    const cached = localStorage.getItem(`catatan_${category}`);
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync state to localStorage whenever notes change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem(`catatan_${category}`, JSON.stringify(notes));
    }
  }, [notes, category]);

  const fetchNotes = useCallback(
    async (search = "") => {
      setLoading(false);
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
    const res = await fetch(`${API_BASE_URL}/${category}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (result.status === "success") await fetchNotes();
    return result;
  };

  const updateNote = async (id, payload) => {
    const res = await fetch(`${API_BASE_URL}/${category}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
        return `
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 5px 0;">Judul: ${n.title}</h3>
            <p style="margin: 0 0 15px 0;"><strong>Tanggal:</strong> ${date}</p>
            <div>${n.body || n.content || ""}</div>
            <hr style="margin-top: 20px;"/>
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
            p { margin: 0 0 5px 0; }
            ul, ol { margin: 0 0 5px 0; }
            li { margin-bottom: 2px; }
          </style>
        </head>
        <body>${contentHTML}</body>
      </html>
    `;

    const converted = await asBlob(htmlString);
    saveAs(converted, `Catatan_${category}.docx`);
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
