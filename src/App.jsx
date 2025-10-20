import React, { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { useSettingsStore } from "./store/useSettingsStore"; // Import the store

function App() {
  const fetchSettings = useSettingsStore((state) => state.fetchSettings);

  useEffect(() => {
    fetchSettings(); // Fetch settings once when the app loads
  }, [fetchSettings]);

  return <AppRouter />;
}

export default App;
