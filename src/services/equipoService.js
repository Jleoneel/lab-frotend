import api from '../lib/axios';

export const ESTADOS_EQUIPO = {
  ACTIVO: 'Activo',
  EN_MANTENIMIENTO: 'En Mantenimiento',
  FUERA_DE_SERVICIO: 'Fuera de Servicio',
  DADO_DE_BAJA: 'Dado de Baja'
};

export const ESTADOS_COLORS = {
  ACTIVO: { bg: '#E8F5E9', color: '#009933' },
  EN_MANTENIMIENTO: { bg: '#FFF9E8', color: '#FFCC33' },
  FUERA_DE_SERVICIO: { bg: '#FEF2F2', color: '#DC2626' },
  DADO_DE_BAJA: { bg: '#F5F5F5', color: '#666666' }
};

const adaptEquipoFromBackend = (e) => ({
  id: e.id,
  nombre: e.nombre,
  modelo: e.modelo || '',
  marca: e.marca || '',
  serie: e.serie || '',
  codigoInventario: e.codigoInventario,
  ubicacion: e.ubicacion || '',
  fechaAdquisicion: e.fechaAdquisicion,
  fechaMantenimiento: e.fechaMantenimiento,
  fechaCalibracion: e.fechaCalibracion,
  estado: e.estado,
  createdAt: e.createdAt,
});

export const equipoService = {
  getAll: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await api.get(`/equipos${query ? `?${query}` : ''}`);
      const data = response.data || response;
      return { data: Array.isArray(data) ? data.map(adaptEquipoFromBackend) : [] };
    } catch (error) {
      console.error('Error en equipoService.getAll:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/equipos', data);
      return response.data || response;
    } catch (error) {
      console.error('Error en equipoService.create:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/equipos/${id}`, data);
      return response.data || response;
    } catch (error) {
      console.error('Error en equipoService.update:', error);
      throw error;
    }
  }
};