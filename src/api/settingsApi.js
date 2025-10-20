import apiClient from "./apiClient";

export const getSettings = async () => apiClient.get("/settings");
export const updateSettings = async (data) => apiClient.put("/settings", data);
