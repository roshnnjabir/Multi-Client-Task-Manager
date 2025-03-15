import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("access-token") || null,
  refreshToken: localStorage.getItem("refresh-token") || null,
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

      localStorage.setItem("access-token", token);
      localStorage.setItem("refresh-token", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout: (state) => {
      Object.assign(state, initialState);

      localStorage.removeItem("access-token");
      localStorage.removeItem("refresh-token");
      localStorage.removeItem("user");
    },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { setUser, logout, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;