import { errorMsg } from '@/lib/utils';
import axios from 'axios';
const pathName = window.location.pathname;
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL as string,
  headers: {
    'Content-Type': 'application/json'
  },
});

api.interceptors.request.use((config) => {
  

  const token = localStorage.getItem("token");
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  } else {
    pathName !== "/login" && errorMsg("Token expired, please login again.");
    delete config.headers.Authorization;
  }
  return config;
})

export default api;