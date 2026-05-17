import api from '../lib/axios';

const adaptReactivoFromBackend = (r) => ({
  id: r.id,
  codigo: r.codigo,
  nombre: r.nombre,
  categoria: r.categoria,
  unidad: r.unidad,
  stockActual: parseFloat(r.stockActual) || 0,
  stockMinimo: parseFloat(r.stockMinimo) || 0,
  isActive: r.isActive,
  createdAt: r.createdAt,
  _count: r._count || { movimientos: 0 }
});

export const UNIDADES = {
  LITROS: 'L',
  KILOGRAMOS: 'KG'
};

export const RAZONES = {
  INICIO: 'Inicio',
  ANALISIS: 'Análisis',
  PREPARACION_SOLUCION: 'Preparación de solución',
  LIMPIEZA: 'Limpieza',
  VENCIMIENTO: 'Vencimiento',
  OTRO: 'Otro'
};

export const reactivoService = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/reactivos${query ? `?${query}` : ''}`);
    const data = response.data || response;
    return { data: Array.isArray(data) ? data.map(adaptReactivoFromBackend) : [] };
  },

  getById: async (id) => {
    const response = await api.get(`/reactivos/${id}`);
    const data = response.data || response;
    return { data: adaptReactivoFromBackend(data) };
  },

  create: async (data) => {
    const response = await api.post('/reactivos', data);
    return response.data || response;
  },

  update: async (id, data) => {
    const response = await api.put(`/reactivos/${id}`, data);
    return response.data || response;
  },

  registrarMovimiento: async (data) => {
    const response = await api.post('/reactivos/movimientos', data);
    return response.data || response;
  },

  getMovimientos: async (id) => {
    const response = await api.get(`/reactivos/${id}/movimientos`);
    return { data: response.data || response };
  }
};
