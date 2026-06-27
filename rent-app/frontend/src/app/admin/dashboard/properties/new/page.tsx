'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyForm } from '@/components/forms/PropertyForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreatePropertyForLandlord, useAllLandlords } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCreatePropertyPage() {
  const router = useRouter();
  const { data: landlordsData, isLoading: loadingLandlords } = useAllLandlords();
  const createProperty = useCreatePropertyForLandlord();
  const [selectedLandlord, setSelectedLandlord] = useState('');

  const landlords = landlordsData?.data || [];

  const handleSubmit = async (data: any) => {
    if (!selectedLandlord) {
      toast.error('Please select a landlord');
      return;
    }

    createProperty.mutate(
      { ...data, landlordId: selectedLandlord },
      {
        onSuccess: () => {
          toast.success('Property created successfully');
          router.push('/admin/dashboard/properties');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to create property');
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create Property for Landlord</h1>
          <p className="text-muted-foreground">Add a listing on behalf of a landlord</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Landlord</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose which landlord this property belongs to
          </p>
        </CardHeader>
        <CardContent>
          {loadingLandlords ? (
            <div className="h-10 bg-muted rounded animate-pulse" />
          ) : (
            <Select value={selectedLandlord} onValueChange={setSelectedLandlord}>
              <SelectTrigger>
                <SelectValue placeholder="Select a landlord" />
              </SelectTrigger>
              <SelectContent>
                {landlords.map((landlord: any) => (
                  <SelectItem key={landlord._id} value={landlord._id}>
                    {landlord.name} ({landlord.email})
                    {landlord.isVerified && ' ✓'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {selectedLandlord && (
        <PropertyForm
          onSubmit={handleSubmit}
          isLoading={createProperty.isPending}
        />
      )}

      {!selectedLandlord && !loadingLandlords && landlords.length > 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Select a landlord above to start creating a property listing</p>
        </div>
      )}
    </div>
  );
}
