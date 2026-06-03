import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // send cookies (refresh token)
});

// Attach access token on every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Access token from memory (authStore)
  if (typeof window !== "undefined") {
    const { getState } = require("@/store/authStore");
    const token = getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach guest session for cart operations
    const guestSession = localStorage.getItem("pearl_guest_session");
    if (!token && guestSession && config.headers) {
      config.headers["x-guest-session"] = guestSession;
    }
  }
  return config;
});

// Handle 401 — attempt token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post("/auth/refresh");
        const { accessToken } = response.data.data;

        if (typeof window !== "undefined") {
          const { getState } = require("@/store/authStore");
          getState().setAccessToken(accessToken);
        }

        processQueue(null, accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        if (typeof window !== "undefined") {
          const { getState } = require("@/store/authStore");
          getState().clearAuth();
          // Only redirect if not already on auth page
          if (!window.location.pathname.startsWith("/auth")) {
            window.location.href = "/auth/login";
          }
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
