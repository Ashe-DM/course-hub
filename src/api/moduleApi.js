import axios from 'axios';

// Use environment variable for backend base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api/modules`
    : 'http://localhost:5000/api/modules'
});
// Fetch all modules
export const getAllModules = async () => {
  const response = await API.get('/');
  return response.data;
};

// Fetch a single module by ID
export const getModuleById = async (id) => {
  const response = await API.get(`/${id}`);
  return response.data;
};

// Create a new module
export const createModule = async (moduleData) => {
  const response = await API.post('/', moduleData);
  return response.data;
};

// Add a new unit to a module
export const addUnit = async (moduleId, unitData) => {
  const response = await API.post(`/${moduleId}/units`, unitData);
  return response.data;
};

// Add a new item to a unit
export const addItem = async (moduleId, unitId, itemData) => {
  const response = await API.post(`/${moduleId}/units/${unitId}/items`, itemData);
  return response.data;
};

// Update a module
export const updateModule = async (moduleId, moduleData) => {
  const response = await API.put(`/${moduleId}`, moduleData);
  return response.data;
};

// Delete a module
export const deleteModule = async (moduleId) => {
  const response = await API.delete(`/${moduleId}`);
  return response.data;
};
