// main.jsx
// This is the very first file that runs when the app loads.
// It mounts the React app into the <div id="root"> in index.html.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Find the root div in index.html and render our React app inside it
createRoot(document.getElementById("root")).render(
  // StrictMode helps catch bugs during development — has no effect in production
  <StrictMode>
    <App />
  </StrictMode>
);
