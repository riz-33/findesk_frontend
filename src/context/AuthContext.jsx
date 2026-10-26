import { createContext, useEffect, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  login: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }) => {
  // Lazily load user from localStorage immediately on mount
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // 🔹 Load user from backend using token
  const loadUser = async () => {
    try {
      const res = await api.get("/auth/me");
      if (res.data && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
      // ONLY logout if token is invalid/unauthorized (401), not on network errors
      if (error.response && error.response.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Login Handler
  const login = (data) => {
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    const userData = data.user || data;
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // 🔹 Logout Handler
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // 🔹 On App Start / Refresh
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
