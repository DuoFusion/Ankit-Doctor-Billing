// src/api/axios.ts
import axios from "axios";
import { AUTH_API } from "../Constants";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");


  if (
    token &&
    !config.url?.includes(AUTH_API.LOGIN) &&
    !config.url?.includes(AUTH_API.SIGNUP) &&
    !config.url?.includes(AUTH_API.VERIFY_OTP)
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

