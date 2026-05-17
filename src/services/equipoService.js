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
  fotoUrl: e.fotoUrl || null,
});

export const equipoService = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/equipos${query ? `?${query}` : ''}`);
    const data = response.data || response;
    return { data: Array.isArray(data) ? data.map(adaptEquipoFromBackend) : [] };
  },

  create: async (data, foto) => {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v) form.append(k, v); });
    if (foto) form.append('foto', foto);
    const response = await api.post('/equipos', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data || response;
  },

  update: async (id, data, foto) => {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== undefined) form.append(k, v); });
    if (foto) form.append('foto', foto);
    const response = await api.put(`/equipos/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data || response;
  },
};
