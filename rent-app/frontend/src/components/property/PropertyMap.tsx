'use client';

import { MapPin } from 'lucide-react';

interface PropertyMapProps {
  lat: number;
  lng: number;
  address: string;
}

export function PropertyMap({ lat, lng, address }: PropertyMapProps) {
  // Placeholder - In production, use Leaflet or Google Maps
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="aspect-video bg-muted flex flex-col items-center justify-center gap-2">
        <MapPin className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{address}</p>
        <a
          href={`https://www.google.com/maps?q=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          Open in Google Maps
        </a>
      </div>
    </div>
  );
}
