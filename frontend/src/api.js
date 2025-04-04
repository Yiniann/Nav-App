import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});


api.interceptors.request.use((config) => {
  const protectedMethods = ["post", "put", "patch", "delete"];
  if (protectedMethods.includes(config.method)) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;