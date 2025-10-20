import { create } from "zustand";
import { getSettings } from "../api/settingsApi";

export const useSettingsStore = create((set) => ({
  settings: null,
  fetchSettings: async () => {
    try {
      const response = await getSettings();
      set({ settings: response.data });
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  },
}));
