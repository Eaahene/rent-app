import api from './api';

export interface SiteSettings {
  _id?: string;
  aboutTitle: string;
  aboutContent: string;
  aboutMission: string;
  aboutVision: string;
  contactPhone: string;
  contactEmail: string;
}

export const settingsService = {
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  updateSettings: async (data: Partial<SiteSettings>) => {
    const response = await api.put('/settings', data);
    return response.data;
  },
};
