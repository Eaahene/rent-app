'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar, MobileSidebar } from '@/components/layout/Sidebar';
import { UserRole } from '@/types';
import { useEffect } from 'react';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !hasRole([UserRole.ADMIN]))) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, hasRole, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !hasRole([UserRole.ADMIN])) {
    return null;
  }

  return (
    <div className="flex">
      <Sidebar role={UserRole.ADMIN} />
      <MobileSidebar role={UserRole.ADMIN} />
      <div className="flex-1 p-6 min-w-0">{children}</div>
    </div>
  );
}
