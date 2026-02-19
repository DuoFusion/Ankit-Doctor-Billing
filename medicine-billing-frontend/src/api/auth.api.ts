// ===================== auth.api.ts =====================
import { api } from "../api/axios";
import type {
  SignupPayload,
  LoginPayload,
  VerifyOtpPayload,
  SignupResponse,
  LoginResponse,
  VerifyOtpResponse,
} from "../types";
import { AUTH_API } from "../Constants";


export const signupApi = async (data: SignupPayload) => {
  const res = await api.post<SignupResponse>(AUTH_API.SIGNUP, data);
  return res.data;
};

export const loginApi = async (data: LoginPayload) => {
  const res = await api.post<LoginResponse>(AUTH_API.LOGIN, data);
  return res.data;
};

export const verifyOtpApi = async (data: VerifyOtpPayload) => {
  const res = await api.post<VerifyOtpResponse>(
    AUTH_API.VERIFY_OTP,
    data
  );
  return res.data;
};

export const logoutApi = async () => {
  const res = await api.post(AUTH_API.LOGOUT);
  return res.data;
};

