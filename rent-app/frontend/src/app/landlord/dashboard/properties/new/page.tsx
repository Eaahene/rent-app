'use client';

import { useRouter } from 'next/navigation';
import { useCreateProperty } from '@/hooks/useProperties';
import { PropertyForm } from '@/components/forms/PropertyForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

export default function NewPropertyPage() {
  const router = useRouter();
  const createProperty = useCreateProperty();

  const handleSubmit = async (data: any) => {
    createProperty.mutate(data, {
      onSuccess: () => {
        toast.success('Property created successfully!');
        router.push('/landlord/dashboard/properties');
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to create property');
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add New Property</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyForm onSubmit={handleSubmit} isLoading={createProperty.isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
