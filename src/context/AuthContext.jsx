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
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // 🔹 Custom wrapper for setUser to automatically sync with localStorage
  const handleSetUser = (updatedUser) => {
    setUser(updatedUser);
    if (updatedUser) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem("user");
    }
  };

  // 🔹 Load user from backend using token on refresh
  const loadUser = async () => {
    try {
      const res = await api.get("/auth/me");
      if (res.data && res.data.user) {
        handleSetUser(res.data.user);
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
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
    handleSetUser(userData);
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
        setUser: handleSetUser,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
