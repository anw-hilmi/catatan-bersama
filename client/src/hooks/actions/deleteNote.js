export const startDelete = (id, setActionConfig, setIsLoginOpen) => {
  setActionConfig({ type: "DELETE", payload: id, pendingData: null });
  setIsLoginOpen(true);
};

export const processDelete = async (credentials, actionConfig, deleteNote) => {
  return await deleteNote(actionConfig.payload, credentials);
};
