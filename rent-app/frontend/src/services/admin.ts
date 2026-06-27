import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getAllUsers: async (params?: { page?: number; role?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.role) searchParams.append('role', params.role);
    if (params?.search) searchParams.append('search', params.search);
    const response = await api.get(`/admin/users?${searchParams.toString()}`);
    return response.data;
  },

  updateUserStatus: async (id: string, isActive: boolean) => {
    const response = await api.patch(`/admin/users/${id}/status`, { isActive });
    return response.data;
  },

  verifyLandlord: async (id: string, isVerified: boolean = true) => {
    const response = await api.patch(`/admin/landlords/${id}/verify`, { isVerified });
    return response.data;
  },

  getAllProperties: async (params?: { page?: number; status?: string; search?: string; isApproved?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.isApproved) searchParams.append('isApproved', params.isApproved);
    const response = await api.get(`/admin/properties?${searchParams.toString()}`);
    return response.data;
  },

  getPropertyById: async (id: string) => {
    const response = await api.get(`/admin/properties/${id}`);
    return response.data;
  },

  approveProperty: async (id: string, isApproved: boolean) => {
    const response = await api.patch(`/admin/properties/${id}/approve`, { isApproved });
    return response.data;
  },

  deleteProperty: async (id: string) => {
    const response = await api.delete(`/admin/properties/${id}`);
    return response.data;
  },

  toggleFeatured: async (id: string) => {
    const response = await api.patch(`/admin/properties/${id}/featured`);
    return response.data;
  },
};
