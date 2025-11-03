// api/itemApi.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Add item to unit
export const addItemToUnit = async (moduleId, unitId, itemData) => {
  const response = await axios.post(`${API_URL}/modules/${moduleId}/units/${unitId}/items`, itemData);
  return response.data;
};

// Update item
export const updateItem = async (moduleId, unitId, itemId, itemData) => {
  const response = await axios.put(`${API_URL}/modules/${moduleId}/units/${unitId}/items/${itemId}`, itemData);
  return response.data;
};

// Delete item
export const deleteItem = async (moduleId, unitId, itemId) => {
  const response = await axios.delete(`${API_URL}/modules/${moduleId}/units/${unitId}/items/${itemId}`);
  return response.data;
};