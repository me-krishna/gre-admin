import { createClient } from "@supabase/supabase-js";
const project = 'adtrdhnydgosxqkbufng'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkdHJkaG55ZGdvc3hxa2J1Zm5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA3NjQ2NTYsImV4cCI6MjAyNjM0MDY1Nn0.WSAzvB_wEP5Mk3-FArL6QK3SNIzxBrqmztf1b-eBHaU'
export const supabase = createClient(`https://${project}.supabase.co`, key);

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    'Content-Type': 'application/json'
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  } else {
    delete config.headers['Authorization'];
  }
  return config;
})

export default api;