'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inquiryService } from '@/services/inquiries';

export function useMyInquiries() {
  return useQuery({
    queryKey: ['inquiries', 'me'],
    queryFn: async () => {
      const response = await inquiryService.getMyInquiries();
      return response.data;
    },
  });
}

export function useLandlordInquiries() {
  return useQuery({
    queryKey: ['inquiries', 'landlord'],
    queryFn: async () => {
      const response = await inquiryService.getLandlordInquiries();
      return response.data;
    },
  });
}

export function usePropertyInquiries(propertyId: string) {
  return useQuery({
    queryKey: ['inquiries', 'property', propertyId],
    queryFn: async () => {
      const response = await inquiryService.getPropertyInquiries(propertyId);
      return response.data;
    },
    enabled: !!propertyId,
  });
}

export function useCreateInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inquiryService.createInquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
}

export function useUpdateInquiryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      inquiryService.updateInquiryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
}
