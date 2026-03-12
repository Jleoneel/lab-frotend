// services/clientService.js
import api from '../lib/axios';

const adaptClientFromBackend = (backendClient) => {
  return {
    id: backendClient.id,
    name: backendClient.name,
    address: backendClient.address || '',
    city: backendClient.city || '',
    phone: backendClient.phone || '',
    email: backendClient.email || '',
    createdAt: backendClient.createdAt,
    updatedAt: backendClient.updatedAt
  };
};

export const clientService = {
  // Obtener todos los clientes (usa ?q= para búsqueda)
  getAll: async (searchTerm = '') => {
    try {
      const url = searchTerm ? `/clients?q=${encodeURIComponent(searchTerm)}` : '/clients';
      const response = await api.get(url);
      
      console.log('Clientes raw:', response);
      
      const data = response.data || response;
      const clients = Array.isArray(data) ? data : [];
      
      return { data: clients.map(adaptClientFromBackend) };
    } catch (error) {
      console.error('Error en clientService.getAll:', error);
      throw error;
    }
  },
  
  // Obtener un cliente por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/clients/${id}`);
      const data = response.data || response;
      return { data: adaptClientFromBackend(data) };
    } catch (error) {
      console.error('Error en clientService.getById:', error);
      throw error;
    }
  },
  
  // Crear nuevo cliente
  create: async (data) => {
    try {
      const cleanData = {
        name: data.name,
        address: data.address || undefined,
        city: data.city || undefined,
        phone: data.phone || undefined,
        email: data.email || undefined
      };
      
      const response = await api.post('/clients', cleanData);
      return response;
    } catch (error) {
      console.error('Error en clientService.create:', error);
      throw error;
    }
  },
  
  // Actualizar cliente
  update: async (id, data) => {
    try {
      const cleanData = {
        name: data.name,
        address: data.address || undefined,
        city: data.city || undefined,
        phone: data.phone || undefined,
        email: data.email || undefined
      };
      
      const response = await api.put(`/clients/${id}`, cleanData);
      return response;
    } catch (error) {
      console.error('Error en clientService.update:', error);
      throw error;
    }
  },
  
  // Eliminar cliente
  delete: async (id) => {
    try {
      const response = await api.delete(`/clients/${id}`);
      return response;
    } catch (error) {
      console.error('Error en clientService.delete:', error);
      throw error;
    }
  },
  
  // Buscar clientes
  search: async (query) => {
    return clientService.getAll(query);
  }
};