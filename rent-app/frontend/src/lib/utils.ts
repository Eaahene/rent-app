import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function timeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) return formatDate(date);
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return 'Just now';
}

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartment: 'Apartment',
  house: 'House',
  studio: 'Studio',
  room: 'Room',
  duplex: 'Duplex',
  penthouse: 'Penthouse',
  townhouse: 'Townhouse',
  commercial: 'Commercial',
};

export const AMENITY_LABELS: Record<string, string> = {
  water: 'Water',
  electricity: 'Electricity',
  wifi: 'Wi-Fi',
  ac: 'Air Conditioning',
  parking: 'Parking',
  security: 'Security',
  kitchen: 'Kitchen',
  balcony: 'Balcony',
  furnished: 'Furnished',
  gym: 'Gym',
  pool: 'Swimming Pool',
  generator: 'Generator',
};

export const REGIONS = [
  'Greater Accra',
  'Ashanti',
  'Western',
  'Central',
  'Eastern',
  'Northern',
  'Volta',
  'Upper East',
  'Upper West',
  'Bono',
  'Ahafo',
  'Bono East',
  'Oti',
  'Western North',
  'Savannah',
  'North East',
];
