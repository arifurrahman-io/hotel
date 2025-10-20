import apiClient from "./apiClient";

export const getHero = async () => apiClient.get("/hero");
export const updateHero = async (data) => apiClient.put("/hero", data);
