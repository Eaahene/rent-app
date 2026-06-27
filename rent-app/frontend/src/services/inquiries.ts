import api from './api';

export const inquiryService = {
  createInquiry: async (data: { propertyId: string; message: string }) => {
    const response = await api.post('/inquiries', data);
    return response.data;
  },

  getMyInquiries: async () => {
    const response = await api.get('/inquiries/me');
    return response.data;
  },

  getLandlordInquiries: async () => {
    const response = await api.get('/inquiries/landlord');
    return response.data;
  },

  getPropertyInquiries: async (propertyId: string) => {
    const response = await api.get(`/inquiries/property/${propertyId}`);
    return response.data;
  },

  updateInquiryStatus: async (id: string, status: string) => {
    const response = await api.patch(`/inquiries/${id}/status`, { status });
    return response.data;
  },

  replyToInquiry: async (id: string, reply: string) => {
    const response = await api.post(`/inquiries/${id}/reply`, { reply });
    return response.data;
  },
};
