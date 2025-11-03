import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth interceptor
const authAPI = axios.create({
  baseURL: API_URL
});

// Add auth token to requests automatically
authAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const loginUser = async (credentials) => {
  const response = await authAPI.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await authAPI.post('/auth/register', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await authAPI.get('/auth/me');
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await authAPI.put('/auth/profile', profileData);
  return response.data;
};

export default authAPI;