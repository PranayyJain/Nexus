// =============================================================
// ETHARA NEXUS - Axios API Client
// Centralized HTTP client with JWT auth interceptor
// =============================================================
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api", // Use env var in prod, fallback to proxy in dev
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach JWT from localStorage ──
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("en_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 globally ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear session and redirect to login
      localStorage.removeItem("en_token");
      localStorage.removeItem("en_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
