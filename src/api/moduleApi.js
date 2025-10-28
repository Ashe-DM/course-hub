import axios from 'axios';

const API_URL = 'http://localhost:5000/api/modules';

export const getAllModules = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getModuleById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createModule = async (moduleData) => {
  const response = await axios.post(API_URL, moduleData);
  return response.data;
};

export const addUnit = async (moduleId, unitData) => {
  const response = await axios.post(`${API_URL}/${moduleId}/units`, unitData);
  return response.data;
};

export const addItem = async (moduleId, unitId, itemData) => {
  const response = await axios.post(`${API_URL}/${moduleId}/units/${unitId}/items`, itemData);
  return response.data;
};

export const updateModule = async (moduleId, moduleData) => {
  const response = await axios.put(`${API_URL}/${moduleId}`, moduleData);
  return response.data;
};

export const deleteModule = async (moduleId) => {
  const response = await axios.delete(`${API_URL}/${moduleId}`);
  return response.data;
};