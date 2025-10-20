import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the store
export const useAuthStore = create(
  persist(
    (set) => ({
      // --- STATE ---
      // The user object, e.g., { name, email, role }. Null if not logged in.
      user: null,
      // The JWT token for API authentication. Null if not logged in.
      token: null,

      // --- ACTIONS ---
      /**
       * Sets the user and token in the state upon successful login.
       * This data will be automatically persisted to localStorage.
       * @param {{ user: object, token: string }} data - The user data and token from the API.
       */
      login: (data) => {
        set({
          user: data, // Assuming the API returns the full user object
          token: data.token,
        });
      },

      /**
       * Clears the user and token from the state and localStorage upon logout.
       */
      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      // Configuration for the persist middleware
      name: "auth-storage", // Unique name for the localStorage item
      // We only want to persist the user and token fields
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

// --- SELECTORS ---
// Selectors can be defined outside the store for convenience and performance
export const useIsAuthenticated = () => useAuthStore((state) => !!state.token);
export const useUserRole = () => useAuthStore((state) => state.user?.role);
