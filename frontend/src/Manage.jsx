import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "./stores/toastSlice";
import { login, logout } from "./stores/authSlice";
import { Link } from "react-router-dom";

const Manage = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(login(credentials)).unwrap();
      dispatch(showToast("Login successful!"));
      // 登录成功后，存储用户信息到 localStorage（如果需要）
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
    } catch (error) {
      dispatch(showToast(error.message || "Login failed"));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(showToast("Logged out successfully"));
    // 登出时清除 localStorage 中的 token 和用户信息
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              value={credentials.username}
              onChange={(e) =>
                setCredentials((prev) => ({ ...prev, username: e.target.value }))
              }
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg"
              value={credentials.password}
              onChange={(e) =>
                setCredentials((prev) => ({ ...prev, password: e.target.value }))
              }
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-4">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <p className="text-green-600 mb-4">You have admin privileges</p>
      {/* 这里可以添加管理功能 */}
    </div>
  );
};

export default Manage;
