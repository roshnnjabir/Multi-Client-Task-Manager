import axios from "axios";
import store from "../store";
import { setUser, logout } from "../slices/authSlice";

const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh-token");
        if (!refreshToken) throw new Error("No refresh token found");

        // Refresh access token
        const refreshResponse = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = refreshResponse.data.access;
        localStorage.setItem("access-token", newAccessToken);

        // Update Redux store with new token
        store.dispatch(setUser({ token: newAccessToken, user: store.getState().auth.user, isAuthenticated: true }));

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;