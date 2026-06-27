'use client';

import Link from 'next/link';
import { useMyProperties, useDeleteProperty } from '@/hooks/useProperties';
import { PropertyTable } from '@/components/landlord/PropertyTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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

export default function LandlordPropertiesPage() {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading } = useMyProperties();
  const deleteProperty = useDeleteProperty();

  const properties = data?.data || [];

  const handleDelete = async () => {
    if (!deleteId) return;
    deleteProperty.mutate(deleteId, {
      onSuccess: () => {
        toast.success('Property deleted successfully');
        setDeleteId(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Properties</h1>
          <p className="text-muted-foreground">Manage your property listings</p>
        </div>
        <Button asChild>
          <Link href="/landlord/dashboard/properties/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="animate-pulse h-64 bg-muted rounded-lg" />
      ) : properties.length > 0 ? (
        <PropertyTable
          properties={properties}
          onEdit={(id) => router.push(`/landlord/dashboard/properties/${id}/edit`)}
          onDelete={(id) => setDeleteId(id)}
        />
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-muted-foreground mb-4">No properties yet</p>
          <Button asChild>
            <Link href="/landlord/dashboard/properties/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Property
            </Link>
          </Button>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
