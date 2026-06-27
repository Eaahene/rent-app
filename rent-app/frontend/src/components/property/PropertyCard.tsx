'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Bed, Bath, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Property, PropertyStatus } from '@/types';
import { formatPrice, timeAgo, cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useFavorite } from '@/hooks/useProperties';
import { useState } from 'react';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { isAuthenticated } = useAuth();
  const toggleFavorite = useFavorite();
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    setIsFavorited(!isFavorited);
    toggleFavorite.mutate(property._id);
  };

  const statusColors = {
    [PropertyStatus.AVAILABLE]: 'bg-green-500',
    [PropertyStatus.OCCUPIED]: 'bg-red-500',
    [PropertyStatus.PENDING]: 'bg-yellow-500',
  };

  return (
    <Link href={`/properties/${property._id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={property.images[0]?.url || '/placeholder.jpg'}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 left-2 flex gap-2">
            <Badge className={cn('text-white', statusColors[property.status])}>
              {property.status}
            </Badge>
            {property.isFeatured && (
              <Badge className="bg-primary text-primary-foreground">Featured</Badge>
            )}
          </div>
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              onClick={handleFavoriteClick}
            >
              <Heart
                className={cn(
                  'h-4 w-4',
                  isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'
                )}
              />
            </Button>
          )}
        </div>

        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-primary">
              {formatPrice(property.price)}
              <span className="text-sm font-normal text-muted-foreground">/mo</span>
            </p>
            {property.landlordId?.isVerified && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Check className="h-3 w-3" /> Verified
              </Badge>
            )}
          </div>

          <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">
              {property.area}, {property.city}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} Bed`}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              {property.bathrooms} Bath
            </span>
            <span className="ml-auto text-xs">{timeAgo(property.createdAt)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
