import { useState } from "react";
import { startAdd, processAdd } from "./actions/addNote";
import { startEdit, processEdit } from "./actions/editNote";
import { startDelete, processDelete } from "./actions/deleteNote";

export const useNoteActions = ({
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
}) => {
  const [expandedId, setExpandedId] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [actionConfig, setActionConfig] = useState({
    type: null,
    payload: null,
    pendingData: null,
  });

  // Panggil fungsi dari file terpisah
  const handleStartAdd = () => startAdd(setActionConfig, setIsEditorOpen);
  const handleStartEdit = (item) =>
    startEdit(item, setActionConfig, setIsEditorOpen);
  const handleStartDelete = (id) =>
    startDelete(id, setActionConfig, setIsLoginOpen);

  const handleEditorSubmit = (data) => {
    setIsEditorOpen(false);
    setActionConfig((prev) => ({ ...prev, pendingData: data }));
    setIsLoginOpen(true);
  };

  const handleLoginSuccess = async (credentials) => {
    let res;
    if (actionConfig.type === "ADD")
      res = await processAdd(credentials, actionConfig, createNote);
    else if (actionConfig.type === "EDIT")
      res = await processEdit(credentials, actionConfig, updateNote);
    else if (actionConfig.type === "DELETE")
      res = await processDelete(credentials, actionConfig, deleteNote);

    if (res && res.status !== "success") {
      throw new Error(
        res.message || "Gagal memproses data. Username atau password salah.",
      );
    }

    await fetchNotes();
    handleCloseLogin();
    return res;
  };

  const handleCloseEditor = () => setIsEditorOpen(false);

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
    setActionConfig({ type: null, payload: null, pendingData: null });
  };

  return {
    expandedId,
    setExpandedId,
    isEditorOpen,
    isLoginOpen,
    actionType: actionConfig.type,
    editingItem: actionConfig.payload,
    handleStartAdd,
    handleStartEdit,
    handleStartDelete,
    handleEditorSubmit,
    handleLoginSuccess,
    handleCloseEditor,
    handleCloseLogin,
  };
};
