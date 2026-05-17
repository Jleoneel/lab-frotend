import api from '../lib/axios';

export const categoriaReactivoService = {
  getAll: () => api.get('/categorias-reactivo'),
  create: (nombre) => api.post('/categorias-reactivo', { nombre }),
  update: (id, data) => api.patch(`/categorias-reactivo/${id}`, data),
  delete: (id) => api.delete(`/categorias-reactivo/${id}`)
};