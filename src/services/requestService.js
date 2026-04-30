// services/requestService.js
import api from '../lib/axios';

// Adaptador para una solicitud (request)
const adaptRequestFromBackend = (backendRequest) => {
  return {
    id: backendRequest.id,
    requestNumber: backendRequest.requestNumber,
    clientId: backendRequest.clientId,
    client: typeof backendRequest.client === 'string' 
      ? backendRequest.client 
      : backendRequest.client?.name || 'Cliente',
    quoteId: backendRequest.quoteId,
    quoteNumber: backendRequest.quote?.quoteNumber || 'N/A',
    status: backendRequest.status,
    createdAt: backendRequest.createdAt,
    updatedAt: backendRequest.updatedAt,
    samples: backendRequest.samples || [],
  };
};

// Adaptador opcional para una muestra (sample)
const adaptSampleFromBackend = (backendSample) => {
  return {
    id: backendSample.id,
    sampleCode: backendSample.sampleCode,
    sampleName: backendSample.sampleName,
    description: backendSample.description,
    status: backendSample.status,
    receivedAt: backendSample.receivedAt,
    // Agrega aquí otros campos que necesites
  };
};

export const requestService = {
  // Obtener todas las solicitudes
  getAll: async () => {
    try {
      const response = await api.get('/requests');
      const data = response.data || response;
      const requests = Array.isArray(data) ? data : [];
      return { data: requests.map(adaptRequestFromBackend) };
    } catch (error) {
      throw error;
    }
  },

  // Obtener una solicitud por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/requests/${id}`);
      const data = response.data || response;
      return { data: adaptRequestFromBackend(data) };
    } catch (error) {
      throw error;
    }
  },

  // Obtener las muestras de una solicitud
  getSamples: async (requestId) => {
    try {
      const response = await api.get(`/requests/${requestId}/samples`);
      const data = response.data || response;
      const samples = Array.isArray(data) ? data : [];
      return { data: samples.map(adaptSampleFromBackend) };
    } catch (error) {
      throw error;
    }
  },

  // Aquí puedes agregar otros métodos (create, update, etc.) si los necesitas
};