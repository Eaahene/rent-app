'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { PropertyGallery } from '@/components/property/PropertyGallery';
import { PropertyAmenities } from '@/components/property/PropertyAmenities';
import { PropertyMap } from '@/components/property/PropertyMap';
import { SimilarProperties } from '@/components/property/SimilarProperties';
import { AreaInfo } from '@/components/property/AreaInfo';
import { EmptyState } from '@/components/feedback/EmptyState';
import { useProperty, useSimilarProperties, useCheckFavorite, useFavorite } from '@/hooks/useProperties';
import { useCreateInquiry } from '@/hooks/useInquiries';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice, timeAgo, PROPERTY_TYPE_LABELS } from '@/lib/utils';
import { Heart, MapPin, Bed, Bath, Users, Phone, MessageSquare, Loader2, Check, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user, isAuthenticated } = useAuth();

  const { data: property, isLoading, error } = useProperty(id);
  const { data: similarData } = useSimilarProperties(id);
  const { data: favoriteData } = useCheckFavorite(id);
  const toggleFavorite = useFavorite();
  const createInquiry = useCreateInquiry();

  const [message, setMessage] = useState('');
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  const isFavorited = favoriteData?.isFavorited || false;
  const similar = similarData || [];

  const handleFavorite = () => {
    if (!isAuthenticated) {
      toast.error('Please login to save favorites');
      return;
    }
    toggleFavorite.mutate(id);
  };

  const handleInquiry = () => {
    if (!message.trim()) return;

    createInquiry.mutate(
      { propertyId: id, message },
      {
        onSuccess: () => {
          toast.success('Inquiry sent successfully!');
          setMessage('');
          setShowInquiryForm(false);
        },
        onError: () => {
          toast.error('Failed to send inquiry');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="aspect-video bg-muted rounded-lg" />
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title="Property not found"
          description="The property you're looking for doesn't exist or has been removed."
          actionLabel="Browse Properties"
          actionHref="/properties"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Gallery */}
      <PropertyGallery images={property.images} />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="capitalize">{property.propertyType}</Badge>
                  <Badge variant={property.status === 'available' ? 'default' : 'secondary'}>
                    {property.status}
                  </Badge>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">{property.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                  <MapPin className="h-4 w-4" />
                  <span>{property.address}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleFavorite}
                disabled={toggleFavorite.isPending}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isFavorited ? 'fill-red-500 text-red-500' : ''
                  }`}
                />
              </Button>
            </div>

            <div className="flex items-center gap-6 mt-4 text-sm">
              <span className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} Bedrooms`}
              </span>
              <span className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                {property.bathrooms} Bathrooms
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Max {property.maxTenants} Tenants
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {timeAgo(property.createdAt)}
              </span>
            </div>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">
                {property.description}
              </p>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <PropertyAmenities amenities={property.amenities} />
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <PropertyMap
                lat={property.location?.coordinates?.[1] || 0}
                lng={property.location?.coordinates?.[0] || 0}
                address={property.address}
              />
            </CardContent>
          </Card>

          {/* Area Info */}
          <AreaInfo
            city={property.city}
            area={property.area}
            region={property.region}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <Card className="sticky top-20">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(property.price)}
                  <span className="text-base font-normal text-muted-foreground">/mo</span>
                </p>
              </div>

              {/* Landlord Info */}
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg mb-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  {property.landlordId?.avatar ? (
                    <Image
                      src={property.landlordId.avatar}
                      alt={property.landlordId.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {property.landlordId?.name?.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-semibold">{property.landlordId?.name}</p>
                    {property.landlordId?.isVerified && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Landlord</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button className="w-full" size="lg" asChild>
                  <a href={`tel:${property.contactPhone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Landlord
                  </a>
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.error('Please login to send an inquiry');
                      return;
                    }
                    setShowInquiryForm(!showInquiryForm);
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Inquiry
                </Button>
              </div>

              {/* Inquiry Form */}
              {showInquiryForm && (
                <div className="mt-4 space-y-3">
                  <Textarea
                    placeholder="Write your message to the landlord..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                  <Button
                    className="w-full"
                    onClick={handleInquiry}
                    disabled={!message.trim() || createInquiry.isPending}
                  >
                    {createInquiry.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Similar Properties */}
      {similar.length > 0 && (
        <div className="mt-12">
          <SimilarProperties properties={similar} />
        </div>
      )}
    </div>
  );
}
