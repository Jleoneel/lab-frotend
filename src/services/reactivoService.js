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

export const CATEGORIAS = {
  SUJETOS_FISCALIZACION: 'Sujetos a Fiscalización',
  FUERZAS_ARMADAS: 'Reactivos Fuerzas Armadas',
  QUIMICA: 'Química',
  BIOLOGIA_MOLECULAR: 'Biología Molecular',
  MICROBIOLOGIA: 'Microbiología'
};

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
    try {
      const query = new URLSearchParams(params).toString();
      const response = await api.get(`/reactivos${query ? `?${query}` : ''}`);
      const data = response.data || response;
      return { data: Array.isArray(data) ? data.map(adaptReactivoFromBackend) : [] };
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/reactivos/${id}`);
      const data = response.data || response;
      return { data: adaptReactivoFromBackend(data) };
    } catch (error) {
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/reactivos', data);
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/reactivos/${id}`, data);
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },

  registrarMovimiento: async (data) => {
    try {
      const response = await api.post('/reactivos/movimientos', data);
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },

  getMovimientos: async (id) => {
    try {
      const response = await api.get(`/reactivos/${id}/movimientos`);
      return { data: response.data || response };
    } catch (error) {
      throw error;
    }
  }
};