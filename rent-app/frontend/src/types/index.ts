export enum UserRole {
  TENANT = 'tenant',
  LANDLORD = 'landlord',
  ADMIN = 'admin',
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export enum PropertyType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  STUDIO = 'studio',
  ROOM = 'room',
  DUPLEX = 'duplex',
  PENTHOUSE = 'penthouse',
  TOWNHOUSE = 'townhouse',
  COMMERCIAL = 'commercial',
}

export enum PropertyStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  PENDING = 'pending',
}

export interface Image {
  url: string;
  publicId: string;
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  region: string;
  city: string;
  area: string;
  address: string;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  maxTenants: number;
  amenities: string[];
  images: Image[];
  status: PropertyStatus;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  contactPhone: string;
  landlordId: User;
  isApproved: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: string;
}

export interface Inquiry {
  _id: string;
  propertyId: Property;
  tenantId: User;
  message: string;
  reply?: string;
  repliedAt?: string;
  status: 'pending' | 'read' | 'replied';
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}

export interface SearchParams {
  region?: string;
  city?: string;
  area?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string;
  status?: string;
  sort?: string;
  page?: number;
  limit?: number;
}
