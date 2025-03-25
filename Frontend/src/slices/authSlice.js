import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8000/api";

const initialState = {
  token: localStorage.getItem("access-token") || null,
  refreshToken: null,
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isAuthenticated: !!localStorage.getItem("access-token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token, refreshToken } = action.payload;

      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem("access-token");
      localStorage.removeItem("user");
      fetch(API_URL+"/token/remove/", {
          method: "POST",
          credentials: "include",
      }).then(() => {
        toast.success("Logged Out", {
          pauseOnHover: false,
          autoClose: 3000,
        });
      });
    },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { setUser, logout, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;