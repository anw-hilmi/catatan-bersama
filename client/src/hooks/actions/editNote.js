export const startEdit = (item, setActionConfig, setIsEditorOpen) => {
  setActionConfig({ type: "EDIT", payload: item, pendingData: null });
  setIsEditorOpen(true);
};

export const processEdit = async (credentials, actionConfig, updateNote) => {
  const { payload, pendingData } = actionConfig; // payload = item (id)

  // Jika pendingData adalah FormData (Upload PDF)
  if (pendingData instanceof FormData) {
    if (!pendingData.has("username")) {
      pendingData.append("username", credentials.username);
    }
    if (!pendingData.has("password")) {
      pendingData.append("password", credentials.password);
    }
    return await updateNote(payload.id, pendingData);
  }

  // Fallback jika berupa objek JSON biasa
  return await updateNote(payload.id, {
    ...credentials,
    ...pendingData,
  });
};
