'use client';

import { useState } from 'react';
import { PropertyTable } from '@/components/admin/PropertyTable';
import {
  useAllProperties,
  useApproveProperty,
  useAdminDeleteProperty,
  useToggleFeatured,
} from '@/hooks/useAdmin';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function AdminPropertiesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isApproved, setIsApproved] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useAllProperties({ page, search: search || undefined, isApproved: isApproved || undefined });
  const approveProperty = useApproveProperty();
  const deleteProperty = useAdminDeleteProperty();
  const toggleFeatured = useToggleFeatured();

  const properties = data?.data || [];

  const handleApprove = (id: string, approved: boolean) => {
    approveProperty.mutate(
      { id, isApproved: approved },
      {
        onSuccess: () =>
          toast.success(approved ? 'Property approved' : 'Property rejected'),
      }
    );
  };

  const handleToggleFeatured = (id: string) => {
    toggleFeatured.mutate(id, {
      onSuccess: () => toast.success('Featured status updated'),
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    deleteProperty.mutate(deleteId, {
      onSuccess: () => {
        toast.success('Property deleted');
        setDeleteId(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Properties</h1>
        <p className="text-muted-foreground">Review and moderate property listings</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            className="pl-10"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={isApproved}
          onValueChange={(value) => {
            setIsApproved(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="true">Approved</SelectItem>
            <SelectItem value="false">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="animate-pulse h-64 bg-muted rounded-lg" />
      ) : (
        <PropertyTable
          properties={properties}
          onApprove={handleApprove}
          onToggleFeatured={handleToggleFeatured}
          onDelete={(id) => setDeleteId(id)}
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

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This property will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
