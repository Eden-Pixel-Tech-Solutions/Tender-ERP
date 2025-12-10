import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:4000/api", // your backend API URL
});

// Add token automatically
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
