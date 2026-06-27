'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '@/services/properties';
import { SearchParams } from '@/types';

export function useProperties(params: SearchParams = {}) {
  return useQuery({
    queryKey: ['properties', params],
    queryFn: async () => {
      const response = await propertyService.getProperties(params);
      return response;
    },
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['properties', id],
    queryFn: async () => {
      const response = await propertyService.getProperty(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useSimilarProperties(id: string) {
  return useQuery({
    queryKey: ['properties', id, 'similar'],
    queryFn: async () => {
      const response = await propertyService.getSimilarProperties(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useFeaturedProperties() {
  return useQuery({
    queryKey: ['properties', 'featured'],
    queryFn: async () => {
      const response = await propertyService.getFeaturedProperties();
      return response.data;
    },
  });
}

export function useRecentProperties() {
  return useQuery({
    queryKey: ['properties', 'recent'],
    queryFn: async () => {
      const response = await propertyService.getRecentProperties();
      return response.data;
    },
  });
}

export function useMyProperties(params?: { page?: number; status?: string }) {
  return useQuery({
    queryKey: ['properties', 'my', params],
    queryFn: async () => {
      const response = await propertyService.getMyProperties(params);
      return response;
    },
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: propertyService.createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      propertyService.updateProperty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: propertyService.deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: propertyService.toggleFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useFavorites(params?: { page?: number }) {
  return useQuery({
    queryKey: ['favorites', params],
    queryFn: async () => {
      const response = await propertyService.getMyFavorites(params);
      return response;
    },
  });
}

export function useCheckFavorite(propertyId: string) {
  return useQuery({
    queryKey: ['favorites', 'check', propertyId],
    queryFn: async () => {
      const response = await propertyService.checkFavorite(propertyId);
      return response.data;
    },
    enabled: !!propertyId,
  });
}
