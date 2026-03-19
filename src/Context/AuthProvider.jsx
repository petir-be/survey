import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

axios.defaults.withCredentials = true;
const BACKEND_URL = import.meta.env.VITE_BACKEND;

const fetchUser = async () => {
  const res = await axios.get(`${BACKEND_URL}/api/User/me`);
  return res.data;
};

const loginUser = async ({ email, password }) => {
  const res = await axios.post(`${BACKEND_URL}/api/User/login`, { email, password });
  return res.data;
};

const loginGoogleUser = async (idToken) => {
  const res = await axios.post(`${BACKEND_URL}/api/User/login-google`, { idToken });
  return res.data;
};

const logoutUser = async () => {
  await axios.post(`${BACKEND_URL}/api/User/logout`);
};

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: fetchUser,
    retry: false, 
    refetchOnWindowFocus: false,
  });


  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (userData) => {

      queryClient.setQueryData(["authUser"], userData);
    },
  });

  const loginWithGoogleMutation = useMutation({
    mutationFn: loginGoogleUser,
    onSuccess: (userData) => {
      queryClient.setQueryData(["authUser"], userData);
    },
    onError: (error) => {
      console.error("Google login failed:", error);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {

      queryClient.setQueryData(["authUser"], null);

 
      queryClient.removeQueries({ queryKey: ["authUser"], exact: false });
    },
    onError: (error) => {
      console.error("Logout error:", error);

      queryClient.setQueryData(["authUser"], null);
    },
  });


  const value = {
    isAuthenticated: !!user,
 
    loading: isLoading || loginMutation.isPending || loginWithGoogleMutation.isPending || logoutMutation.isPending,
    user: user || null,

    login: (email, password) => loginMutation.mutateAsync({ email, password }),
    loginWithGoogle: (idToken) => loginWithGoogleMutation.mutateAsync(idToken),
    logout: () => logoutMutation.mutateAsync(),
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};