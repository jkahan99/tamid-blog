// components/Navbar.jsx
// The top navigation bar. Shows different links depending on whether
// the user is logged in or not.

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Log out and redirect to the home page
  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      {/* Logo / brand name — always links to home */}
      <Link to="/" className="navbar-brand">
        TAMID Blog
      </Link>

      {/* Right side of the navbar */}
      <div className="navbar-links">
        <Link to="/">Home</Link>

        {/* Show these links only if the user is logged in */}
        {user ? (
          <>
            <Link to="/my-posts">My Posts</Link>
            <button onClick={handleLogout} className="btn-logout">
              Log Out
            </button>
          </>
        ) : (
          // Show login/register links if not logged in
          <>
            <Link to="/login">Log In</Link>
            <Link to="/register" className="btn-register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
