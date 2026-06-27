import { z } from 'zod';
import { UserRole, PropertyType, PropertyStatus } from '../interfaces';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6).max(50),
    phone: z.string().min(8).max(20),
    role: z.nativeEnum(UserRole).optional().default(UserRole.TENANT),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1),
    password: z.string().min(6).max(50),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    phone: z.string().min(8).max(20).optional(),
    avatar: z.string().url().optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6).max(50),
  }),
});

export const createPropertySchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(2000),
    price: z.number().positive(),
    region: z.string().min(1),
    city: z.string().min(1),
    area: z.string().min(1),
    address: z.string().min(1),
    propertyType: z.nativeEnum(PropertyType),
    bedrooms: z.number().int().min(0),
    bathrooms: z.number().int().min(0),
    maxTenants: z.number().int().min(1).optional().default(1),
    amenities: z.array(z.string()).optional().default([]),
    images: z.array(z.object({ url: z.string().url(), publicId: z.string() })).optional().default([]),
    status: z.nativeEnum(PropertyStatus).optional().default(PropertyStatus.AVAILABLE),
    location: z.object({
      type: z.literal('Point').optional().default('Point'),
      coordinates: z.tuple([z.number(), z.number()]).optional().default([0, 0]),
    }).optional(),
    contactPhone: z.string().min(8).max(20),
    isFeatured: z.boolean().optional().default(false),
  }),
});

export const updatePropertySchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100).optional(),
    description: z.string().min(10).max(2000).optional(),
    price: z.number().positive().optional(),
    region: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    area: z.string().min(1).optional(),
    address: z.string().min(1).optional(),
    propertyType: z.nativeEnum(PropertyType).optional(),
    bedrooms: z.number().int().min(0).optional(),
    bathrooms: z.number().int().min(0).optional(),
    maxTenants: z.number().int().min(1).optional(),
    amenities: z.array(z.string()).optional(),
    images: z.array(z.object({ url: z.string().url(), publicId: z.string() })).optional(),
    status: z.nativeEnum(PropertyStatus).optional(),
    location: z.object({
      type: z.literal('Point').optional(),
      coordinates: z.tuple([z.number(), z.number()]).optional(),
    }).optional(),
    contactPhone: z.string().min(8).max(20).optional(),
    isFeatured: z.boolean().optional(),
  }),
});

export const createInquirySchema = z.object({
  body: z.object({
    propertyId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid property ID'),
    message: z.string().min(1).max(1000),
  }),
});

export const propertySearchSchema = z.object({
  query: z.object({
    region: z.string().optional(),
    city: z.string().optional(),
    area: z.string().optional(),
    propertyType: z.nativeEnum(PropertyType).optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    bedrooms: z.coerce.number().optional(),
    bathrooms: z.coerce.number().optional(),
    status: z.nativeEnum(PropertyStatus).optional(),
    furnished: z.coerce.boolean().optional(),
    amenities: z.string().optional(),
    lng: z.coerce.number().optional(),
    lat: z.coerce.number().optional(),
    radius: z.coerce.number().optional(),
    sort: z.string().optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(50).optional().default(12),
  }),
});

export const replyInquirySchema = z.object({
  body: z.object({
    reply: z.string().min(1).max(2000),
  }),
});
