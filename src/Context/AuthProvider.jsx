import React, { useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./authContext";

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    loading: true,
    user: null,
  });

  // Configure axios to send cookies
  axios.defaults.withCredentials = true;

  useEffect(() => {
    // Check if user is authenticated by calling a protected endpoint
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND}/api/User/me`
        );
        setAuthState({
          isAuthenticated: true,
          loading: false,
          user: res.data,
        });
      } catch (error) {
        setAuthState({
          isAuthenticated: false,
          loading: false,
          user: null,
        });
      }
    };

    checkAuth();
  }, []);

  async function login(email, password) {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND}/api/User/login`,
      { email, password }
    );

    setAuthState({
      isAuthenticated: true,
      loading: false,
      user: res.data,
    });
  }

  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND}/api/User/logout`);
    } catch (error) {
      console.error("Logout error:", error);
    }

    setAuthState({
      isAuthenticated: false,
      loading: false,
      user: null,
    });
  };

  const value = {
    ...authState,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!authState.loading && children}
    </AuthContext.Provider>
  );
};
