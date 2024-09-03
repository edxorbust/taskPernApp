import axios from "axios";
import Cookies from "js-cookie";

const baseURL = import.meta.env.VITE_BACKEND || "http://localhost:3000/api";

const instance = axios.create({
  baseURL,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    console.log("token", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
