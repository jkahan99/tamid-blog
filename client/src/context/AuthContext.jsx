// context/AuthContext.jsx
// React Context lets us share "global" data (like who's logged in) across
// every component without passing it as props through every layer.
//
// Usage:
//   const { user, logout } = useAuth();   ← in any component
//
// We store a minimal user object decoded from the JWT token.

import { createContext, useContext, useState, useEffect } from "react";
import { getToken, removeToken, isLoggedIn } from "../api";

// Decode a JWT token to read the payload (user id, email, etc.)
// JWTs are just base64-encoded JSON — no library needed for decoding
function decodeToken(token) {
  try {
    // A JWT looks like: header.payload.signature
    // We only care about the payload (middle part)
    const payload = token.split(".")[1];
    // atob decodes base64, then we parse the JSON
    return JSON.parse(atob(payload));
  } catch {
    return null; // Token was malformed
  }
}

// Create the context object — think of it as a "channel" components can tune into
const AuthContext = createContext(null);

// AuthProvider wraps the whole app (in main.jsx) and makes auth data available everywhere
export function AuthProvider({ children }) {
  // user is either null (logged out) or an object with { id, email }
  const [user, setUser] = useState(null);

  // On first load, check if there's already a token saved (user was previously logged in)
  useEffect(() => {
    if (isLoggedIn()) {
      const token = getToken();
      const decoded = decodeToken(token);
      if (decoded) {
        // The JWT payload has "sub" (subject = user id) and "email"
        setUser({ id: decoded.sub, email: decoded.email });
      }
    }
  }, []);

  // Called after a successful login — update state so UI reacts immediately
  function handleLogin(token) {
    const decoded = decodeToken(token);
    if (decoded) {
      setUser({ id: decoded.sub, email: decoded.email });
    }
  }

  // Called when the user clicks "Log out" — clear everything
  function logout() {
    removeToken();
    setUser(null);
  }

  // The value object is what all child components can access via useAuth()
  return (
    <AuthContext.Provider value={{ user, handleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — just a cleaner way to use the context
// Instead of: const { user } = useContext(AuthContext)
// You write:   const { user } = useAuth()
export function useAuth() {
  return useContext(AuthContext);
}
