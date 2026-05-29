import { createSlice } from "@reduxjs/toolkit";

const savedUser = localStorage.getItem("ayurgenx_user");

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  isAuthenticated: savedUser ? true : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("ayurgenx_user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("ayurgenx_user");
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      state.isAuthenticated = true;
      localStorage.setItem("ayurgenx_user", JSON.stringify(state.user));
    },
  },
});

export const { login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;