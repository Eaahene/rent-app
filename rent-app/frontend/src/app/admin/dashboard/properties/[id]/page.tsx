'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAdminProperty, useApproveProperty } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, X, MapPin, BedDouble, Bath, Users, Phone, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminPropertyReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading } = useAdminProperty(id);
  const approveProperty = useApproveProperty();

  const property = data?.data;

  const handleApprove = (approved: boolean) => {
    approveProperty.mutate(
      { id, isApproved: approved },
      {
        onSuccess: () => {
          toast.success(approved ? 'Property approved' : 'Property rejected');
          router.push('/admin/dashboard/properties');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded w-1/4 animate-pulse" />
        <div className="h-64 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Property not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Review Property</h1>
          <p className="text-muted-foreground">Review listing details before approving</p>
        </div>
        {!property.isApproved && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleApprove(false)}
              className="text-destructive border-destructive hover:bg-destructive/10"
            >
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button onClick={() => handleApprove(true)}>
              <Check className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </div>
        )}
        {property.isApproved && (
          <Button
            variant="outline"
            onClick={() => handleApprove(false)}
            className="text-destructive border-destructive hover:bg-destructive/10"
          >
            <X className="h-4 w-4 mr-2" />
            Reject
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-0">
              {property.images?.length > 0 && (
                <div className="relative aspect-video">
                  <Image
                    src={property.images[0].url}
                    alt={property.title}
                    fill
                    className="object-cover rounded-t-lg"
                    unoptimized
                  />
                  {property.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      +{property.images.length - 1} more photos
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {property.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {property.images.slice(1, 5).map((img: any, i: number) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                  <Image src={img.url} alt="" fill className="object-cover" unoptimized />
                </div>
              ))}
            </div>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{property.title}</CardTitle>
                  <p className="text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    {property.address}, {property.area}, {property.city}, {property.region}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{formatPrice(property.price)}/mo</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <BedDouble className="h-4 w-4 text-muted-foreground" />
                  <span>{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4 text-muted-foreground" />
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Max {property.maxTenants} Tenants</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">{property.description}</p>
              </div>

              {property.amenities?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity: string) => (
                      <Badge key={amenity} variant="secondary">{amenity}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Landlord Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{(property.landlordId as any)?.name}</p>
                <p className="text-sm text-muted-foreground">{(property.landlordId as any)?.email}</p>
              </div>
              {property.contactPhone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{property.contactPhone}</span>
                </div>
              )}
              <Badge variant={(property.landlordId as any)?.isVerified ? 'default' : 'secondary'}>
                {(property.landlordId as any)?.isVerified ? 'Verified Landlord' : 'Unverified Landlord'}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Listing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="capitalize">{property.propertyType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={property.status === 'available' ? 'default' : 'secondary'}>
                  {property.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Approval</span>
                <Badge variant={property.isApproved ? 'default' : 'destructive'}>
                  {property.isApproved ? 'Approved' : 'Pending'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Featured</span>
                <span className="flex items-center gap-1">
                  {property.isFeatured ? (
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  ) : (
                    '-'
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Views</span>
                <span>{property.views || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Listed</span>
                <span>{new Date(property.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
