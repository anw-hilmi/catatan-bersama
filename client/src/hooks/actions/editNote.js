export const startEdit = (item, setActionConfig, setIsEditorOpen) => {
  setActionConfig({ type: "EDIT", payload: item, pendingData: null });
  setIsEditorOpen(true);
};

export const processEdit = async (credentials, actionConfig, updateNote) => {
  return await updateNote(actionConfig.payload.id, {
    ...credentials,
    title: actionConfig.pendingData.title,
    body: actionConfig.pendingData.content,
  });
};
