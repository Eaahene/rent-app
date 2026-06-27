'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SlidersHorizontal } from 'lucide-react';
import { PROPERTY_TYPE_LABELS, AMENITY_LABELS, REGIONS } from '@/lib/utils';

interface Filters {
  region: string;
  city: string;
  propertyType: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  sort: string;
  amenities: string[];
}

interface FilterContentProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  applyFilters: () => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

function FilterContent({ filters, setFilters, applyFilters, clearFilters, hasActiveFilters }: FilterContentProps) {
  const toggleAmenity = (amenity: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Region</label>
        <Select
          value={filters.region || undefined}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, region: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Regions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {REGIONS.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">City</label>
        <Input
          placeholder="Enter city"
          value={filters.city}
          onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Property Type</label>
        <Select
          value={filters.propertyType || undefined}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, propertyType: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Price Range</label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Bedrooms</label>
        <Select
          value={filters.bedrooms || undefined}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, bedrooms: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="0">Studio</SelectItem>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Sort By</label>
        <Select
          value={filters.sort || undefined}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, sort: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Newest" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="popular">Most Viewed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(AMENITY_LABELS).map(([value, label]) => (
            <Button
              key={value}
              variant={filters.amenities.includes(value) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleAmenity(value)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={applyFilters} className="flex-1">
          Apply Filters
        </Button>
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}

export function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    region: searchParams.get('region') || '',
    city: searchParams.get('city') || '',
    propertyType: searchParams.get('propertyType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    sort: searchParams.get('sort') || '',
    amenities: searchParams.get('amenities')?.split(',') || [],
  });

  const applyFilters = () => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'amenities') {
        if ((value as string[]).length > 0) {
          params.set(key, (value as string[]).join(','));
        }
      } else if (key === 'sort') {
        if (value && value !== 'newest') {
          params.set(key, value as string);
        }
      } else if (value && value !== 'all' && value !== 'any') {
        params.set(key, value as string);
      }
    });

    params.set('page', '1');
    router.push(`/properties?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      region: '',
      city: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      sort: '',
      amenities: [],
    });
    router.push('/properties');
  };

  const hasActiveFilters = Object.values(filters).some((v) =>
    Array.isArray(v) ? v.length > 0 : v !== ''
  );

  return (
    <>
      <div className="hidden lg:block">
        <FilterContent
          filters={filters}
          setFilters={setFilters}
          applyFilters={applyFilters}
          clearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 h-2 w-2 rounded-full bg-primary" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <FilterContent
                filters={filters}
                setFilters={setFilters}
                applyFilters={applyFilters}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
