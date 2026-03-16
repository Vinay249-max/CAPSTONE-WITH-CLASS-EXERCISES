import api from './api';

export const getUsers = () => api.get('/users');
export const updateUserRole = (userId, roleName) => api.put(`/users/${userId}/role`, { roleName });
export const deleteUser = (userId) => api.delete(`/users/${userId}`);
