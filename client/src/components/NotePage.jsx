import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CardItem from "./CardItem";
import AddButton from "./AddButton";
import DownloadButton from "./DownloadButton";
import ModalEditor from "./ModalEditor";
import ModalLogin from "./ModalLogin";
import SearchInput from "./SearchInput";
import { useNotes } from "../hooks/useNotes";
import { useNoteActions } from "../hooks/useNoteActions";

export default function NotePage({ category }) {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const {
    notes,
    loading,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    downloadAllNotes,
  } = useNotes(category);

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
    handleEditorSubmit,
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

      <ModalEditor
        isOpen={isEditorOpen}
        defaultValue={
          editingItem && actionType === "EDIT"
            ? {
                title: editingItem.title,
                content: editingItem.body || editingItem.content,
              }
            : { title: "", content: "" }
        }
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
