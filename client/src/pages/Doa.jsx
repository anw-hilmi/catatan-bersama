import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CardItem from "../components/CardItem";
import AddButton from "../components/AddButton";
import DownloadButton from "../components/DownloadButton";
import ModalUploadPdf from "../components/ModalUploadPdf"; // <-- Ganti ke ModalUploadPdf
import ModalLogin from "../components/ModalLogin";
import SearchInput from "../components/SearchInput";
import { useNotes } from "../hooks/useNotes";
import { useNoteActions } from "../hooks/useNoteActions";

export default function Doa() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  // 1. Hook Data API
  const {
    notes,
    loading,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    downloadAllNotes,
  } = useNotes("doa");

  // 2. Hook Actions (Modal & UI State)
  const {
    expandedId,
    setExpandedId,
    isEditorOpen,
    isLoginOpen,
    actionType,
    editingItem,
    handleStartAdd,
    handleStartEdit,
    handleStartDelete,
    handleEditorSubmit, // Akan menerima FormData / { title, files }
    handleLoginSuccess,
    handleCloseEditor,
    handleCloseLogin,
  } = useNoteActions({ fetchNotes, createNote, updateNote, deleteNote });

  useEffect(() => {
    fetchNotes(searchQuery);
  }, [fetchNotes, searchQuery]);

  return (
    <div>
      <SearchInput />

      {loading ? (
        <p className="text-center text-gray-500 py-8">Memuat data...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {notes.map((item) => (
            <CardItem
              key={item.id}
              title={item.title}
              content={item.body || item.content}
              pdfPaths={item.pdf_paths || item.pdfUrls || []} // <-- Oper data pdf_paths dari database
              isExpanded={expandedId === item.id}
              onToggleExpand={() =>
                setExpandedId((prev) => (prev === item.id ? null : item.id))
              }
              onEdit={() => handleStartEdit(item)}
              onDelete={() => handleStartDelete(item.id)}
            />
          ))}
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50 flex gap-3">
        <DownloadButton onClick={downloadAllNotes} />
        <AddButton onClick={handleStartAdd} />
      </div>

      {/* Modal Upload PDF Baru */}
      <ModalUploadPdf
        isOpen={isEditorOpen}
        actionType={actionType}
        editingItem={editingItem}
        onClose={handleCloseEditor}
        onSubmit={handleEditorSubmit}
      />

      <ModalLogin
        isOpen={isLoginOpen}
        onClose={handleCloseLogin}
        onLoginSuccess={handleLoginSuccess}
        actionType={actionType}
      />
    </div>
  );
}
