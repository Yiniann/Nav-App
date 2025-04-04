import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { showToast } from "./stores/toastSlice";
import { register } from "./stores/authSlice";

const Register = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const dispatch = useDispatch();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (userData.password !== userData.confirmPassword) {
      dispatch(showToast("Passwords do not match"));
      return;
    }

    try {
      await dispatch(register({
        username: userData.username,
        email: userData.email,
        password: userData.password
      })).unwrap();
      
      dispatch(showToast("Registration successful! Please login."));
      // 可以在这里重定向到登录页
    } catch (error) {
      dispatch(showToast(error.message || "Registration failed"));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Username</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
            value={userData.username}
            onChange={(e) => setUserData({...userData, username: e.target.value})}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-lg"
            value={userData.email}
            onChange={(e) => setUserData({...userData, email: e.target.value})}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-lg"
            value={userData.password}
            onChange={(e) => setUserData({...userData, password: e.target.value})}
            required
            minLength="6"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Confirm Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-lg"
            value={userData.confirmPassword}
            onChange={(e) => setUserData({...userData, confirmPassword: e.target.value})}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mb-4"
        >
          Register
        </button>
        <div className="text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;