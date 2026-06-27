'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { StatsCards } from '@/components/landlord/StatsCards';
import { PropertyTable } from '@/components/landlord/PropertyTable';
import { InquiryTable } from '@/components/landlord/InquiryTable';
import { useMyProperties, useDeleteProperty } from '@/hooks/useProperties';
import { useLandlordInquiries, useUpdateInquiryStatus } from '@/hooks/useInquiries';
import { useAuth } from '@/hooks/useAuth';
import { Plus } from 'lucide-react';
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
import { useState } from 'react';

export default function LandlordDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: propertiesData, isLoading: propertiesLoading } = useMyProperties();
  const { data: inquiries } = useLandlordInquiries();
  const deleteProperty = useDeleteProperty();
  const updateInquiryStatus = useUpdateInquiryStatus();

  const properties = propertiesData?.data || [];
  const recentInquiries = inquiries?.slice(0, 5) || [];

  const handleDelete = async () => {
    if (!deleteId) return;
    deleteProperty.mutate(deleteId, {
      onSuccess: () => {
        toast.success('Property deleted successfully');
        setDeleteId(null);
      },
      onError: () => {
        toast.error('Failed to delete property');
      },
    });
  };

  const handleInquiryStatus = (id: string, status: string) => {
    updateInquiryStatus.mutate(
      { id, status },
      { onSuccess: () => toast.success('Inquiry status updated') }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Landlord Dashboard</h1>
          <p className="text-muted-foreground">Manage your properties and inquiries</p>
        </div>
        <Button asChild>
          <Link href="/landlord/dashboard/properties/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Link>
        </Button>
      </div>

      <StatsCards properties={properties} inquiries={inquiries?.length || 0} />

      {recentInquiries.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Inquiries</h2>
          <InquiryTable inquiries={recentInquiries} onStatusChange={handleInquiryStatus} />
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">My Properties</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/landlord/dashboard/properties">View All</Link>
          </Button>
        </div>

        {propertiesLoading ? (
          <div className="animate-pulse h-48 bg-muted rounded-lg" />
        ) : properties.length > 0 ? (
          <PropertyTable
            properties={properties.slice(0, 5)}
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
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this property.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
