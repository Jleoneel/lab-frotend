// services/requestService.js
import api from '../lib/axios';

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

const adaptSampleFromBackend = (backendSample) => {
  return {
    id: backendSample.id,
    sampleCode: backendSample.sampleCode,
    sampleName: backendSample.sampleName,
    description: backendSample.description,
    status: backendSample.status,
    receivedAt: backendSample.receivedAt,
  };
};

export const requestService = {
  getAll: async () => {
    const response = await api.get('/requests');
    const data = response.data || response;
    const requests = Array.isArray(data) ? data : [];
    return { data: requests.map(adaptRequestFromBackend) };
  },

  getById: async (id) => {
    const response = await api.get(`/requests/${id}`);
    const data = response.data || response;
    return { data: adaptRequestFromBackend(data) };
  },

  getSamples: async (requestId) => {
    const response = await api.get(`/requests/${requestId}/samples`);
    const data = response.data || response;
    const samples = Array.isArray(data) ? data : [];
    return { data: samples.map(adaptSampleFromBackend) };
  },
};
