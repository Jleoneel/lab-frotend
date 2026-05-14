import api from '../lib/axios';

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
    const response = await api.get('/quotes');
    const data = response.data || response;
    const quotes = Array.isArray(data) ? data : [];
    return { data: quotes.map(adaptQuoteFromBackend) };
  },

  getById: async (id) => {
    const response = await api.get(`/quotes/${id}`);
    const data = response.data || response;
    return { data: adaptQuoteFromBackend(data) };
  },

  create: async (data) => {
    return await api.post('/quotes', data);
  },

  convert: async (id, samplesData) => {
    return await api.post(`/quotes/${id}/convert`, { samples: samplesData });
  },

  updateStatus: async (id, status) => {
    return await api.patch(`/quotes/${id}/status`, { status });
  },

  update: (id, data) => api.put(`/quotes/${id}`, data),
};
