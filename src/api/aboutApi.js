import apiClient from "./apiClient";

export const getAboutContent = async () => apiClient.get("/about");
export const updateAboutContent = async (data) => apiClient.put("/about", data);
