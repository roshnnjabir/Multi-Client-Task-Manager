import axios from "axios";
import store from "../store";
import { setUser, logout } from "../slices/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
      console.log("Retriying Original Request")
      
      

      try {
        const refreshToken = localStorage.getItem("refresh-token");
        console.log("RefreshToken Found :", refreshToken)
        if (!refreshToken) throw new Error("No refresh token found");

        const refreshResponse = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = refreshResponse.data.access;
        localStorage.setItem("access-token", newAccessToken);
        console.log("New Access Token: ", newAccessToken)

        store.dispatch(setUser({ token: newAccessToken, user: store.getState().auth.user, isAuthenticated: true }));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        store.dispatch(logout());
        toast.error("Session expired. Please log in again.");
        console.error("Login failed:", error);
        localStorage.setItem("access-token", newAccessToken);
        const navigate = useNavigate();
        navigate('/login');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;