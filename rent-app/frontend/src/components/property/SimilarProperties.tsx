'use client';

import { PropertyCard } from './PropertyCard';
import { Property } from '@/types';

interface SimilarPropertiesProps {
  properties: Property[];
}

export function SimilarProperties({ properties }: SimilarPropertiesProps) {
  if (!properties.length) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </div>
    </div>
  );
}
