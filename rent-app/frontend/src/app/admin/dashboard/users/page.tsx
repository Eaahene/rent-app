'use client';

import { useState } from 'react';
import { UserTable } from '@/components/admin/UserTable';
import { useAllUsers, useUpdateUserStatus, useVerifyLandlord } from '@/hooks/useAdmin';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [role, setRole] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useAllUsers({ page, role, search: search || undefined });
  const updateUserStatus = useUpdateUserStatus();
  const verifyLandlord = useVerifyLandlord();

  const users = data?.data || [];

  const handleVerify = (id: string, isVerified: boolean) => {
    verifyLandlord.mutate({ id, isVerified }, {
      onSuccess: () => toast.success(isVerified ? 'Landlord verified' : 'Landlord unverified'),
      onError: () => toast.error('Failed to update verification'),
    });
  };

  const handleToggleStatus = (id: string, isActive: boolean) => {
    updateUserStatus.mutate(
      { id, isActive },
      {
        onSuccess: () =>
          toast.success(isActive ? 'User activated' : 'User suspended'),
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <p className="text-muted-foreground">View and manage all users</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={role}
          onValueChange={(value) => {
            setRole(value === 'all' ? '' : value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="tenant">Tenants</SelectItem>
            <SelectItem value="landlord">Landlords</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="animate-pulse h-64 bg-muted rounded-lg" />
      ) : (
        <UserTable
          users={users}
          onVerify={handleVerify}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: data.pagination.totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
