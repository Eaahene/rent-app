import api from './api';
import { SearchParams } from '@/types';

function buildQueryString(params: SearchParams): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

export const propertyService = {
  getProperties: async (params: SearchParams = {}) => {
    const queryString = buildQueryString(params);
    const response = await api.get(`/properties?${queryString}`);
    return response.data;
  },

  getProperty: async (id: string) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  getSimilarProperties: async (id: string) => {
    const response = await api.get(`/properties/${id}/similar`);
    return response.data;
  },

  getFeaturedProperties: async () => {
    const response = await api.get('/properties/featured');
    return response.data;
  },

  getRecentProperties: async () => {
    const response = await api.get('/properties/recent');
    return response.data;
  },

  createProperty: async (data: any) => {
    const response = await api.post('/properties', data);
    return response.data;
  },

  updateProperty: async (id: string, data: any) => {
    const response = await api.patch(`/properties/${id}`, data);
    return response.data;
  },

  deleteProperty: async (id: string) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },

  getMyProperties: async (params?: { page?: number; status?: string }) => {
    const queryString = params ? buildQueryString(params as any) : '';
    const response = await api.get(`/properties/landlord/me?${queryString}`);
    return response.data;
  },

  toggleFavorite: async (propertyId: string) => {
    const response = await api.post(`/properties/${propertyId}/favorite`);
    return response.data;
  },

  getMyFavorites: async (params?: { page?: number }) => {
    const queryString = params ? buildQueryString(params as any) : '';
    const response = await api.get(`/properties/user/favorites?${queryString}`);
    return response.data;
  },

  checkFavorite: async (propertyId: string) => {
    const response = await api.get(`/properties/${propertyId}/check-favorite`);
    return response.data;
  },
};
