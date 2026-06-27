'use client';

import { useFavorites } from '@/hooks/useProperties';
import { PropertyCard } from '@/components/property/PropertyCard';
import { PropertyListSkeleton } from '@/components/property/PropertySkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { data, isLoading } = useFavorites({ page: 1 });
  const favorites = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Favorites</h1>
        <p className="text-muted-foreground">Properties you&apos;ve saved</p>
      </div>

      {isLoading ? (
        <PropertyListSkeleton />
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((property: any) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No favorites yet"
          description="Start browsing properties and save the ones you like."
          actionLabel="Browse Properties"
          actionHref="/properties"
          icon={<Heart className="h-8 w-8 text-muted-foreground" />}
        />
      )}
    </div>
  );
}
