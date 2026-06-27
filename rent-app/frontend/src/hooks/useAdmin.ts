'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const response = await adminService.getDashboardStats();
      return response.data;
    },
  });
}

export function useAllUsers(params?: { page?: number; role?: string; search?: string }) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: async () => {
      const response = await adminService.getAllUsers(params);
      return response;
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminService.updateUserStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useVerifyLandlord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isVerified }: { id: string; isVerified: boolean }) =>
      adminService.verifyLandlord(id, isVerified),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
}

export function useAllProperties(params?: { page?: number; status?: string; search?: string; isApproved?: string }) {
  return useQuery({
    queryKey: ['admin', 'properties', params],
    queryFn: async () => {
      const response = await adminService.getAllProperties(params);
      return response;
    },
  });
}

export function useAdminProperty(id: string) {
  return useQuery({
    queryKey: ['admin', 'property', id],
    queryFn: async () => {
      const response = await adminService.getPropertyById(id);
      return response;
    },
    enabled: !!id,
  });
}

export function useApproveProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isApproved }: { id: string; isApproved: boolean }) =>
      adminService.approveProperty(id, isApproved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
    },
  });
}

export function useAdminDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
    },
  });
}

export function useToggleFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminService.toggleFeatured,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
    },
  });
}
