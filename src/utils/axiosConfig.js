import axios from "axios";
import { url } from "../../constants";
const Axios = axios.create({
  baseURL: url,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// REQUEST INTERCEPTOR
Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR
Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error?.response?.status === 401) {
    //   localStorage.removeItem("token");
    //   window.location.href = "/";
    // }
    return Promise.reject(error);
  },
);

export default Axios;
