import api from '../lib/axios';

const buildParams = (desde, hasta) => {
  const params = new URLSearchParams();
  if (desde) params.append('desde', desde);
  if (hasta) params.append('hasta', hasta);
  return params.toString();
};

export const reportService = {
  getProduccion: async (desde, hasta) => {
    const response = await api.get(`/reports/produccion?${buildParams(desde, hasta)}`);
    return response.data || response;
  },
  getAnalistas: async (desde, hasta) => {
    const response = await api.get(`/reports/analistas?${buildParams(desde, hasta)}`);
    return response.data || response;
  },
  getServicios: async (desde, hasta) => {
    const response = await api.get(`/reports/servicios?${buildParams(desde, hasta)}`);
    return response.data || response;
  },
  getInventario: async (desde, hasta) => {
    const response = await api.get(`/reports/inventario?${buildParams(desde, hasta)}`);
    return response.data || response;
  }
};