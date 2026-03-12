// services/serviceService.js
import api from '../lib/axios';

// Adaptador para las respuestas del backend
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
    _count: backendService._count || { quoteItems: 0, sampleLinks: 0 } // 👈
  };
};

export const serviceService = {
  // Obtener todos los servicios (usa el endpoint que SÍ existe)
  getAll: async (searchTerm = '') => {
    try {
      // Tu backend usa ?q= para búsqueda
      const url = searchTerm ? `/services?q=${encodeURIComponent(searchTerm)}` : '/services';
      const response = await api.get(url);
          
      // La respuesta puede ser response.data o response directamente
      const data = response.data || response;
      const services = Array.isArray(data) ? data : [];
      
      return { data: services.map(adaptServiceFromBackend) };
    } catch (error) {
      console.error('Error en serviceService.getAll:', error);
      throw error;
    }
  },
  
  // Obtener servicios activos (filtramos en el frontend ya que no hay endpoint)
  getActive: async () => {
    try {
      // Usamos getAll y filtramos isActive
      const response = await serviceService.getAll();
      const activeServices = response.data.filter(service => service.isActive === true);
            
      return { data: activeServices };
    } catch (error) {
      console.error('Error en serviceService.getActive:', error);
      // Si getAll falla, devolvemos array vacío
      return { data: [] };
    }
  },
  
  // Obtener un servicio por ID (asumo que existe el endpoint)
  getById: async (id) => {
    try {
      const response = await api.get(`/services/${id}`);
      const data = response.data || response;
      return { data: adaptServiceFromBackend(data) };
    } catch (error) {
      console.error('Error en serviceService.getById:', error);
      throw error;
    }
  },
  
  // Crear nuevo servicio
  create: async (data) => {
    try {
      // El backend espera priceExternal y priceStudent como strings
      const cleanData = {
        code: data.code,
        name: data.name,
        priceExternal: data.priceExternal.toString(),
        priceStudent: data.priceStudent.toString(),
        description: data.description || undefined,
        isActive: data.isActive ?? true
      };
            
      const response = await api.post('/services', cleanData);
      return response;
    } catch (error) {
      console.error('Error en serviceService.create:', error);
      throw error;
    }
  },
  
  // Actualizar servicio
  update: async (id, data) => {
    try {
      const cleanData = { ...data };
      
      // Convertir precios a string si existen
      if (cleanData.priceExternal != null) {
        cleanData.priceExternal = cleanData.priceExternal.toString();
      }
      if (cleanData.priceStudent != null) {
        cleanData.priceStudent = cleanData.priceStudent.toString();
      }
          
      const response = await api.put(`/services/${id}`, cleanData);
      return response;
    } catch (error) {
      console.error('Error en serviceService.update:', error);
      throw error;
    }
  },
  
  // Eliminar servicio (si existe el endpoint)
  delete: async (id) => {
    try {
      const response = await api.delete(`/services/${id}`);
      return response;
    } catch (error) {
      console.error('Error en serviceService.delete:', error);
      throw error;
    }
  },
  
  // Buscar servicios (usa el parámetro q)
  search: async (query) => {
    return serviceService.getAll(query);
  }
};