export const startAdd = (setActionConfig, setIsEditorOpen) => {
  setActionConfig({ type: "ADD", payload: null, pendingData: null });
  setIsEditorOpen(true);
};

export const processAdd = async (credentials, actionConfig, createNote) => {
  const { pendingData } = actionConfig;

  // Jika pendingData adalah FormData (Upload PDF)
  if (pendingData instanceof FormData) {
    if (!pendingData.has("username")) {
      pendingData.append("username", credentials.username);
    }
    if (!pendingData.has("password")) {
      pendingData.append("password", credentials.password);
    }
    return await createNote(pendingData);
  }

  // Fallback jika berupa objek JSON biasa
  return await createNote({
    ...credentials,
    ...pendingData,
  });
};
