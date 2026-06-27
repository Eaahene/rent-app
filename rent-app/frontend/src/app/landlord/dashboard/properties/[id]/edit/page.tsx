'use client';

import { useRouter, useParams } from 'next/navigation';
import { useProperty, useUpdateProperty } from '@/hooks/useProperties';
import { PropertyForm } from '@/components/forms/PropertyForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/feedback/EmptyState';
import toast from 'react-hot-toast';

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: property, isLoading } = useProperty(id);
  const updateProperty = useUpdateProperty();

  const handleSubmit = async (data: any) => {
    updateProperty.mutate(
      { id, data },
      {
        onSuccess: () => {
          toast.success('Property updated successfully!');
          router.push('/landlord/dashboard/properties');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to update property');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-96 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <EmptyState
        title="Property not found"
        description="The property you're trying to edit doesn't exist."
        actionLabel="Back to Properties"
        actionHref="/landlord/dashboard/properties"
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Property</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyForm
            initialData={property}
            onSubmit={handleSubmit}
            isLoading={updateProperty.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
