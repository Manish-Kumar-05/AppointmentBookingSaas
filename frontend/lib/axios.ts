import axios from "axios";
import { tokenService } from "./auth-token";

export const api = axios.create({
  baseURL: "http://localhost:4000/api/v1",
});

api.interceptors.request.use((config) => {
  const token = tokenService.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      tokenService.clearToken();
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  },
);
