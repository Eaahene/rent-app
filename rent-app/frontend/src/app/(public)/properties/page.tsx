'use client';

import { Suspense } from 'react';
import { PropertyCard } from '@/components/property/PropertyCard';
import { PropertyFilters } from '@/components/property/PropertyFilters';
import { PropertyListSkeleton } from '@/components/property/PropertySkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { useProperties } from '@/hooks/useProperties';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function PropertiesContent() {
  const searchParams = useSearchParams();

  const params = {
    region: searchParams.get('region') || undefined,
    city: searchParams.get('city') || undefined,
    propertyType: searchParams.get('propertyType') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
    sort: searchParams.get('sort') || undefined,
    amenities: searchParams.get('amenities') || undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: 12,
  };

  const { data, isLoading, error } = useProperties(params);

  const properties = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Filters Sidebar */}
      <div className="lg:w-72 flex-shrink-0">
        <div className="sticky top-20">
          <h2 className="font-semibold mb-4">Filters</h2>
          <PropertyFilters />
        </div>
      </div>

      {/* Properties Grid */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {pagination ? `${pagination.total} properties found` : 'Loading...'}
          </p>
        </div>

        {isLoading ? (
          <PropertyListSkeleton />
        ) : error ? (
          <EmptyState
            title="Error loading properties"
            description="Something went wrong. Please try again."
            actionLabel="Try Again"
            actionHref="/properties"
          />
        ) : properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map((property: any) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={pagination.page <= 1}
                  asChild={pagination.page > 1}
                >
                  {pagination.page > 1 ? (
                    <Link href={`/properties?${new URLSearchParams({
                      ...Object.fromEntries(searchParams),
                      page: String(pagination.page - 1),
                    }).toString()}`}>
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                  ) : (
                    <span><ChevronLeft className="h-4 w-4" /></span>
                  )}
                </Button>

                {Array.from({ length: Math.min(pagination.totalPages, 5) }).map((_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={page === pagination.page ? 'default' : 'outline'}
                      size="icon"
                      asChild
                    >
                      <Link href={`/properties?${new URLSearchParams({
                        ...Object.fromEntries(searchParams),
                        page: String(page),
                      }).toString()}`}>
                        {page}
                      </Link>
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="icon"
                  disabled={pagination.page >= pagination.totalPages}
                  asChild={pagination.page < pagination.totalPages}
                >
                  {pagination.page < pagination.totalPages ? (
                    <Link href={`/properties?${new URLSearchParams({
                      ...Object.fromEntries(searchParams),
                      page: String(pagination.page + 1),
                    }).toString()}`}>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <span><ChevronRight className="h-4 w-4" /></span>
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="No properties found"
            description="Try adjusting your filters or search terms."
            actionLabel="Clear Filters"
            actionHref="/properties"
          />
        )}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Browse Properties</h1>
        <p className="text-muted-foreground mt-1">
          Find your perfect rental home
        </p>
      </div>

      <Suspense fallback={<PropertyListSkeleton />}>
        <PropertiesContent />
      </Suspense>
    </div>
  );
}
