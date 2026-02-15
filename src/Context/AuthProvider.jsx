import React, { useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./authContext";

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    loading: true,
    user: null,
  });

  axios.defaults.withCredentials = true;

  useEffect(() => {
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
        console.log(error);
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

  async function loginWithGoogle(idToken) {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND}/api/User/login-google`,
        { idToken }
      );

      setAuthState({
        isAuthenticated: true,
        loading: false,
        user: res.data,
      });
    } catch (error) {
      console.error("Google login failed:", error);
    }
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
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!authState.loading && children}
    </AuthContext.Provider>
  );
};
