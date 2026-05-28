// App.jsx
// The root component. Sets up React Router so clicking links changes the page
// without a full browser reload. Also wraps everything in the AuthProvider
// so every component can access login state.

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyPosts from "./pages/MyPosts";
import "./App.css";

export default function App() {
  return (
    // BrowserRouter enables client-side routing (URL changes without page reload)
    <BrowserRouter>
      {/* AuthProvider makes login state available to all components below */}
      <AuthProvider>
        {/* Navbar always shows at the top of every page */}
        <Navbar />

        {/* Main content area — only one Route renders at a time */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-posts" element={<MyPosts />} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}
