import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// This import brings in all your global styles and Tailwind CSS directives
import "./index.css";

// This is the standard way to initialize a React 18 application
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
