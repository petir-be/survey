import React, { useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./authContext";

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    loading: true,
    user: null,
  });

<<<<<<< HEAD
<<<<<<< HEAD
  axios.defaults.withCredentials = true;

  useEffect(() => {
=======
  // Configure axios to send cookies
  axios.defaults.withCredentials = true;

  useEffect(() => {
    // Check if user is authenticated by calling a protected endpoint
>>>>>>> 4404ba5 (auth login jwttoken)
=======
  axios.defaults.withCredentials = true;

  useEffect(() => {
>>>>>>> 6b9a9b1 (Add Google authentication and registration features)
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
<<<<<<< HEAD
        console.log(error);
=======
>>>>>>> 4404ba5 (auth login jwttoken)
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

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 6b9a9b1 (Add Google authentication and registration features)
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

<<<<<<< HEAD
=======
>>>>>>> 4404ba5 (auth login jwttoken)
=======
>>>>>>> 6b9a9b1 (Add Google authentication and registration features)
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
<<<<<<< HEAD
<<<<<<< HEAD
    loginWithGoogle,
=======
>>>>>>> 4404ba5 (auth login jwttoken)
=======
    loginWithGoogle,
>>>>>>> 6b9a9b1 (Add Google authentication and registration features)
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!authState.loading && children}
    </AuthContext.Provider>
  );
};
