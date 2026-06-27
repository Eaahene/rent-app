'use client';

import { Check } from 'lucide-react';
import { AMENITY_LABELS } from '@/lib/utils';

interface PropertyAmenitiesProps {
  amenities: string[];
}

export function PropertyAmenities({ amenities }: PropertyAmenitiesProps) {
  if (!amenities.length) {
    return (
      <p className="text-sm text-muted-foreground">No amenities listed</p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {amenities.map((amenity) => (
        <div key={amenity} className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-sm">{AMENITY_LABELS[amenity] || amenity}</span>
        </div>
      ))}
    </div>
  );
}
