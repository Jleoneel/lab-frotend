import api from '../lib/axios';

export const settingsService = {
  getLabInfo: async () => {
    try {
      const response = await api.get('/settings/lab-info');
      return response.data || response;
    } catch (error) {
      console.error('Error en settingsService.getLabInfo:', error);
      throw error;
    }
  },
  
  getIva: async () => {
    try {
      const response = await api.get('/settings/iva');
      return response.data || response;
    } catch (error) {
      console.error('Error en settingsService.getIva:', error);
      throw error;
    }
  },

  updateIva: async (iva) => {
    try {
      const response = await api.put('/settings/iva', { iva });
      return response.data || response;
    } catch (error) {
      console.error('Error en settingsService.updateIva:', error);
      throw error;
    }
  }
};