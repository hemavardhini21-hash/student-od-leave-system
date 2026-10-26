import React, { createContext, useState, useEffect } from "react";
import authService from "../services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore session from localStorage and verify token via profile fetch
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          const res = await authService.getProfile();
          setUser(res.user);
          localStorage.setItem("user", JSON.stringify(res.user));
        } catch (err) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
