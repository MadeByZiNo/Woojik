import axios, { AxiosError } from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (error.response && error.response.data) {
      const { message } = error.response.data;
      return Promise.reject(new Error(message || "서버 오류가 발생했습니다."));
    }
    return Promise.reject(error);
  }
);

export default api;