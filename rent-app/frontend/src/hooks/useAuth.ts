'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth';
import { useAuthStore } from '@/store/auth';
import { setAccessToken } from '@/services/api';
import { UserRole } from '@/types';

export function useAuth() {
  const { user, setUser, setLoading, logout: storeLogout } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await authService.getMe();
      return response.data.user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    } else if (error) {
      setUser(null);
    }
  }, [data, error, setUser]);

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAccessToken(data.data.accessToken);
      setUser(data.data.user);
      const redirect = getRedirectPath(data.data.user.role);
      router.push(redirect);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setAccessToken(data.data.accessToken);
      setUser(data.data.user);
      router.push('/');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      setAccessToken(null);
      await authService.logout();
    },
    onSettled: () => {
      setAccessToken(null);
      storeLogout();
      queryClient.clear();
      router.push('/');
    },
  });

  const hasRole = (roles: UserRole[]) => {
    return user ? roles.includes(user.role) : false;
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    hasRole,
  };
}

function getRedirectPath(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return '/admin/dashboard';
    case UserRole.LANDLORD:
      return '/landlord/dashboard';
    default:
      return '/';
  }
}
