// services/serviceService.js
import api from '../lib/axios';

const adaptServiceFromBackend = (backendService) => {
  return {
    id: backendService.id,
    code: backendService.code,
    name: backendService.name,
    priceExternal: parseFloat(backendService.priceExternal) || 0,
    priceStudent: parseFloat(backendService.priceStudent) || 0,
    description: backendService.description || '',
    isActive: backendService.isActive ?? true,
    createdAt: backendService.createdAt,
    updatedAt: backendService.updatedAt,
    _count: backendService._count || { quoteItems: 0, sampleLinks: 0 }
  };
};

export const serviceService = {
  getAll: async (searchTerm = '') => {
    const url = searchTerm ? `/services?q=${encodeURIComponent(searchTerm)}` : '/services';
    const response = await api.get(url);
    const data = response.data || response;
    const services = Array.isArray(data) ? data : [];
    return { data: services.map(adaptServiceFromBackend) };
  },

  getActive: async () => {
    try {
      const response = await serviceService.getAll();
      const activeServices = response.data.filter(service => service.isActive === true);
      return { data: activeServices };
    } catch (error) {
      // Si getAll falla, devolvemos array vacío
      return { data: [] };
    }
  },

  getById: async (id) => {
    const response = await api.get(`/services/${id}`);
    const data = response.data || response;
    return { data: adaptServiceFromBackend(data) };
  },

  create: async (data) => {
    const cleanData = {
      code: data.code,
      name: data.name,
      priceExternal: data.priceExternal.toString(),
      priceStudent: data.priceStudent.toString(),
      description: data.description || undefined,
      isActive: data.isActive ?? true
    };

    return await api.post('/services', cleanData);
  },

  update: async (id, data) => {
    const cleanData = { ...data };

    if (cleanData.priceExternal != null) {
      cleanData.priceExternal = cleanData.priceExternal.toString();
    }
    if (cleanData.priceStudent != null) {
      cleanData.priceStudent = cleanData.priceStudent.toString();
    }

    return await api.put(`/services/${id}`, cleanData);
  },

  delete: async (id) => {
    return await api.delete(`/services/${id}`);
  },

  search: async (query) => {
    return serviceService.getAll(query);
  }
};
