import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

// 登录动作
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));  // 保存用户信息到 localStorage
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "登录失败");
    }
  }
);

// 注册动作
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", {
        username: userData.username,
        email: userData.email,
        password: userData.password,
      });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));  // 保存用户信息到 localStorage
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "注册失败"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!localStorage.getItem("token"),
    user: JSON.parse(localStorage.getItem("user")) || null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout(state) {
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // 清除用户信息
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 登录状态处理
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload.user;  // 保存用户信息
        localStorage.setItem("user", JSON.stringify(action.payload.user)); // 保存用户信息到 localStorage
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // 注册状态处理
      .addCase(register.pending, (state) => {
        state.status = "loading";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        // 注册成功后，直接保存用户信息
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(action.payload.user)); // 保存用户信息到 localStorage
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
