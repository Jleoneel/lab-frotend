// services/authService.js
import api from '../lib/axios';

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  
  logout: () => api.post('/auth/logout'),
  
  getCurrentUser: () => api.get('/auth/me'),
  
  changePassword: (data) => api.post('/auth/change-password', data)
};