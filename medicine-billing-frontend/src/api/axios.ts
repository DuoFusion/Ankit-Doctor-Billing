// src/api/axios.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");


  if (
    token &&
    !config.url?.includes("/auth/login") &&
    !config.url?.includes("/auth/signup") &&
    !config.url?.includes("/auth/verify-otp")
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

