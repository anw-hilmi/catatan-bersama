export const startAdd = (setActionConfig, setIsEditorOpen) => {
  setActionConfig({ type: "ADD", payload: null, pendingData: null });
  setIsEditorOpen(true);
};

export const processAdd = async (credentials, actionConfig, createNote) => {
  return await createNote({
    ...credentials,
    title: actionConfig.pendingData.title,
    body: actionConfig.pendingData.content,
  });
};
