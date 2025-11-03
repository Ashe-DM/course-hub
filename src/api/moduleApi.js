// api/moduleApi.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth interceptor
const moduleAPI = axios.create({
  baseURL: `${API_URL}/modules`
});

// Add auth token to requests automatically
moduleAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetch all modules
export const getAllModules = async () => {
  const response = await moduleAPI.get('/');
  return response.data;
};

// Fetch a single module by ID
export const getModuleById = async (id) => {
  const response = await moduleAPI.get(`/${id}`);
  return response.data;
};

// Create a new module
export const createModule = async (moduleData) => {
  const response = await moduleAPI.post('/', moduleData);
  return response.data;
};

// Add a new unit/week to a module
export const addWeek = async (moduleId, unitData) => {
  const response = await moduleAPI.post(`/${moduleId}/units`, unitData);
  return response.data;
};

// Alias for backward compatibility
export const addUnit = addWeek;

// Add a new item to a unit/week
export const addItem = async (moduleId, unitId, itemData) => {
  const response = await moduleAPI.post(`/${moduleId}/units/${unitId}/items`, itemData);
  return response.data;
};

// Update a module
export const updateModule = async (moduleId, moduleData) => {
  const response = await moduleAPI.put(`/${moduleId}`, moduleData);
  return response.data;
};

// Delete a module
export const deleteModule = async (moduleId) => {
  const response = await moduleAPI.delete(`/${moduleId}`);
  return response.data;
};

// Update a unit
export const updateWeek = async (moduleId, unitId, unitData) => {
  const response = await moduleAPI.put(`/${moduleId}/units/${unitId}`, unitData);
  return response.data;
};

// Delete a unit
export const deleteWeek = async (moduleId, unitId) => {
  const response = await moduleAPI.delete(`/${moduleId}/units/${unitId}`);
  return response.data;
};

// Update an item
export const updateItem = async (moduleId, unitId, itemId, itemData) => {
  const response = await moduleAPI.put(`/${moduleId}/units/${unitId}/items/${itemId}`, itemData);
  return response.data;
};

// Delete an item
export const deleteItem = async (moduleId, unitId, itemId) => {
  const response = await moduleAPI.delete(`/${moduleId}/units/${unitId}/items/${itemId}`);
  return response.data;
};

// ========== PROGRESS TRACKING ==========

// Create progress API instance with auth interceptor
const progressAPI = axios.create({
  baseURL: `${API_URL}/progress`
});

// Add auth token to progress requests automatically
progressAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get user progress for a module
export const getUserProgress = async (moduleId) => {
  try {
    const response = await progressAPI.get(`/${moduleId}`);
    return response.data;
  } catch (error) {
    console.log('Progress tracking error:', error.message);
    return { completedItems: [] };
  }
};

// Get all user's progress
export const getAllUserProgress = async () => {
  try {
    const response = await progressAPI.get('/');
    return response.data;
  } catch (error) {
    console.log('Progress tracking error:', error.message);
    return [];
  }
};

// Mark an item as complete
export const markItemComplete = async (moduleId, unitId, itemId) => {
  try {
    const response = await progressAPI.post(`/${moduleId}/complete`, {
      unitId,
      itemId
    });
    return response.data;
  } catch (error) {
    console.log('Mark complete error:', error.message);
    return null;
  }
};

// Get user's enrolled modules
export const getEnrolledModules = async () => {
  try {
    const response = await progressAPI.get('/enrolled');
    return response.data;
  } catch (error) {
    console.log('Get enrolled modules error:', error.message);
    return [];
  }
};

// Enroll user in a module
export const enrollUser = async (moduleId) => {
  try {
    const response = await progressAPI.post(`/${moduleId}/enroll`);
    return response.data;
  } catch (error) {
    console.log('Enroll error:', error.message);
    return null;
  }
};

export default moduleAPI;