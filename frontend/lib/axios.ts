// import axios from "axios";
// import { tokenService } from "./auth-token";

// export const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
// });

// api.interceptors.request.use((config) => {
//   const token = tokenService.getToken();

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// api.interceptors.response.use(
//   (res) => res,
//   (error) => {
//     // Just clear token
//     if (error.response?.status === 401) {
//       tokenService.clearToken();
//     }

//     return Promise.reject(error);
//   },
// );

import axios from "axios";
import { tokenService } from "./auth-token";

console.log("BACKEND URL:", process.env.NEXT_PUBLIC_BACKEND_API_URL);

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
});

api.interceptors.request.use((config) => {
  const token = tokenService.getToken();

  console.log("REQUEST URL:", `${config.baseURL}${config.url}`);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error("AXIOS ERROR:", error);

    if (error.response?.status === 401) {
      tokenService.clearToken();
    }

    return Promise.reject(error);
  },
);
