// services/quoteService.js - VERSIÓN CORREGIDA
import api from '../lib/axios';

// Adaptador para las respuestas del backend
const adaptQuoteFromBackend = (backendQuote) => {
  return {
    id: backendQuote.id,
    quoteNumber: backendQuote.quoteNumber,
    clientId: backendQuote.clientId,
    client: backendQuote.client?.name || 'Cliente',
    priceList: backendQuote.priceList,
    ivaPercent: parseFloat(backendQuote.ivaPercent),
    subtotal: parseFloat(backendQuote.subtotal),
    ivaAmount: parseFloat(backendQuote.ivaAmount),
    total: parseFloat(backendQuote.total),
    validUntil: backendQuote.validUntil,
    status: backendQuote.status || 'DRAFT',
    createdAt: backendQuote.createdAt,
    items: (backendQuote.items || []).map(item => ({
      id: item.id,
      serviceId: item.serviceId,
      serviceName: item.service?.name || 'Servicio',
      serviceCode: item.service?.code,
      quantity: item.quantity,
      unitPriceApplied: parseFloat(item.unitPriceApplied),
      lineSubtotal: parseFloat(item.lineSubtotal)
    }))
  };
};

export const quoteService = {
  getAll: async () => {
    try {
      const response = await api.get('/quotes');
      const data = response.data || response;
      const quotes = Array.isArray(data) ? data : [];
      return { data: quotes.map(adaptQuoteFromBackend) };
    } catch (error) {
      console.error('Error en quoteService.getAll:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/quotes/${id}`);
      const data = response.data || response;
      return { data: adaptQuoteFromBackend(data) };
    } catch (error) {
      console.error('Error en quoteService.getById:', error);
      throw error;
    }
  },
  
  create: async (data) => {
    try {
      console.log('Enviando cotización:', JSON.stringify(data, null, 2));
      const response = await api.post('/quotes', data);
      console.log('Respuesta del backend:', response);
      return response;
    } catch (error) {
      console.error('Error en quoteService.create:', error);
      throw error;
    }
  },
  
// services/quoteService.js
convert: async (id, samplesData) => {
  try {
    // Envolver samplesData en un objeto con propiedad 'samples'
    const response = await api.post(`/quotes/${id}/convert`, { samples: samplesData });
    return response;
  } catch (error) {
    console.error('Error en quoteService.convert:', error);
    throw error;
  }
},
  
  //NUEVO MÉTODO - DENTRO del objeto
  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`/quotes/${id}/status`, { status });
      return response;
    } catch (error) {
      console.error('Error en quoteService.updateStatus:', error);
      throw error;
    }
  }
};