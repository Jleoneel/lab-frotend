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
  }
};