import axios from 'axios';

const API_URL = 'http://localhost:5000/api/modules';

// Get all modules
export const getAllModules = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get single module
export const getModuleById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Create new module
export const createModule = async (moduleData) => {
  const response = await axios.post(API_URL, moduleData);
  return response.data;
};

// Add lesson to module
export const addLesson = async (moduleId, lessonData) => {
  const response = await axios.post(`${API_URL}/${moduleId}/lessons`, lessonData);
  return response.data;
};

// Add project to module
export const addProject = async (moduleId, projectData) => {
  const response = await axios.post(`${API_URL}/${moduleId}/projects`, projectData);
  return response.data;
};

// Update module
export const updateModule = async (moduleId, moduleData) => {
  const response = await axios.put(`${API_URL}/${moduleId}`, moduleData);
  return response.data;
};

// Delete module
export const deleteModule = async (moduleId) => {
  const response = await axios.delete(`${API_URL}/${moduleId}`);
  return response.data;
};
