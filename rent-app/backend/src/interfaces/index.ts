import { Document } from 'mongoose';

export enum UserRole {
  TENANT = 'tenant',
  LANDLORD = 'landlord',
  ADMIN = 'admin',
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  avatar: string;
  isVerified: boolean;
  isActive: boolean;
  refreshToken: string;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;
  emailVerificationToken: string | undefined;
  emailVerificationExpires: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IImage {
  url: string;
  publicId: string;
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

export interface IGeoLocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface IProperty extends Document {
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
  images: IImage[];
  status: PropertyStatus;
  location: IGeoLocation;
  contactPhone: string;
  landlordId: string;
  isApproved: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInquiry extends Document {
  propertyId: string;
  tenantId: string;
  message: string;
  status: 'pending' | 'read' | 'replied';
  createdAt: Date;
}

export interface IFavorite extends Document {
  userId: string;
  propertyId: string;
  createdAt: Date;
}

export interface INotification extends Document {
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  relatedEntity: string;
  entityType: string;
  createdAt: Date;
}

export interface SearchFilters {
  region?: string;
  city?: string;
  area?: string;
  propertyType?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  status?: PropertyStatus;
  furnished?: boolean;
  lng?: number;
  lat?: number;
  radius?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
