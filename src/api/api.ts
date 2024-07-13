import { errorMsg } from '@/lib/utils';
import axios from 'axios';

// Create an axios instance with predefined baseURL and headers
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Use an interceptor to add the Authorization header if a token exists
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (window.location.pathname !== '/login') {
    errorMsg('Token expired, please login again.');
    redirectToLogin(); // Implement this function based on your routing solution
  }
  return config;
});

// Response interceptor for handling errors globally
api.interceptors.response.use(response => {
  // Handle responses
  return response;
}, error => {
  if (error.response && error.response.status === 401) {
    // Handle 401 errors specifically
    errorMsg('Session expired. Redirecting to login.');
    redirectToLogin();
  } else {
    // Handle other errors
    errorMsg('An error occurred. Please try again later.');
  }
  return Promise.reject(error);
});

// Utility function to handle redirection to the login page
function redirectToLogin() {
  window.location.href = '/login';
}

export default api;