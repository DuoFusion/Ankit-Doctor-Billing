import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  signupApi,
  loginApi,
  verifyOtpApi,
  logoutApi,
} from "../api/auth.api";
import { QUERY_KEYS } from "../Constants";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const signup = useMutation({
    mutationFn: signupApi,
  });

  const login = useMutation({
    mutationFn: loginApi,
  });

  const verifyOtp = useMutation({
    mutationFn: verifyOtpApi,
    onSuccess: (data: any) => {
      if (!data?.token) return;

      localStorage.setItem("token", data.token);

      // 🔁 refetch logged-in user
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ME });

      navigate("/");
    },
  });

  const logout = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      localStorage.removeItem("token");

      queryClient.removeQueries({ queryKey: QUERY_KEYS.ME });

      navigate("/login");
    },
  });

  return {
    signup: signup.mutateAsync,
    login: login.mutateAsync,
    verifyOtp: verifyOtp.mutateAsync,
    logout: logout.mutateAsync,

    loading:
      signup.isPending ||
      login.isPending ||
      verifyOtp.isPending ||
      logout.isPending,
  };
};
