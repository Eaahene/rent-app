import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Property from '../models/Property';
import { UserRole, PropertyType, PropertyStatus } from '../interfaces';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});

    // Create admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@rentapp.com',
      password: 'admin123',
      phone: '+1234567890',
      role: UserRole.ADMIN,
      isVerified: true,
      isActive: true,
    });

    // Create landlords
    const landlords = await User.create([
      {
        name: 'Sarah Johnson',
        email: 'sarah@landlord.com',
        password: 'landlord123',
        phone: '+1234567891',
        role: UserRole.LANDLORD,
        isVerified: true,
        isActive: true,
      },
      {
        name: 'Michael Chen',
        email: 'michael@landlord.com',
        password: 'landlord123',
        phone: '+1234567892',
        role: UserRole.LANDLORD,
        isVerified: true,
        isActive: true,
      },
      {
        name: 'Emily Williams',
        email: 'emily@landlord.com',
        password: 'landlord123',
        phone: '+1234567893',
        role: UserRole.LANDLORD,
        isVerified: false,
        isActive: true,
      },
    ]);

    // Create tenants
    const tenants = await User.create([
      {
        name: 'John Doe',
        email: 'john@tenant.com',
        password: 'tenant123',
        phone: '+1234567894',
        role: UserRole.TENANT,
        isVerified: true,
        isActive: true,
      },
      {
        name: 'Jane Smith',
        email: 'jane@tenant.com',
        password: 'tenant123',
        phone: '+1234567895',
        role: UserRole.TENANT,
        isVerified: true,
        isActive: true,
      },
    ]);

    // Create properties
    const properties = await Property.create([
      {
        title: 'Modern 2-Bedroom Apartment in Downtown',
        description: 'Beautiful modern apartment with stunning city views. Features an open floor plan, hardwood floors, and stainless steel appliances. Walking distance to shops and restaurants.',
        price: 1500,
        region: 'Greater Accra',
        city: 'Accra',
        area: 'Osu',
        address: '123 Oxford Street, Osu, Accra',
        propertyType: PropertyType.APARTMENT,
        bedrooms: 2,
        bathrooms: 2,
        maxTenants: 3,
        amenities: ['wifi', 'ac', 'parking', 'security', 'kitchen'],
        images: [
          { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', publicId: 'prop1_1' },
          { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', publicId: 'prop1_2' },
        ],
        status: PropertyStatus.AVAILABLE,
        location: { type: 'Point', coordinates: [-0.1870, 5.5600] },
        contactPhone: '+1234567891',
        landlordId: landlords[0]._id,
        isApproved: true,
        isFeatured: true,
        views: 245,
      },
      {
        title: 'Cozy Studio Apartment Near University',
        description: 'Perfect for students or young professionals. Fully furnished studio with modern amenities. Close to university campus and public transport.',
        price: 800,
        region: 'Ashanti',
        city: 'Kumasi',
        area: 'Adum',
        address: '45 Adum Road, Kumasi',
        propertyType: PropertyType.STUDIO,
        bedrooms: 0,
        bathrooms: 1,
        maxTenants: 1,
        amenities: ['water', 'electricity', 'wifi', 'furnished'],
        images: [
          { url: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800', publicId: 'prop2_1' },
          { url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', publicId: 'prop2_2' },
        ],
        status: PropertyStatus.AVAILABLE,
        location: { type: 'Point', coordinates: [-1.6244, 6.6885] },
        contactPhone: '+1234567892',
        landlordId: landlords[1]._id,
        isApproved: true,
        isFeatured: true,
        views: 182,
      },
      {
        title: 'Spacious 3-Bedroom Family House',
        description: 'Large family home with backyard. Perfect for families with children. Features include a modern kitchen, spacious living room, and garden.',
        price: 2500,
        region: 'Greater Accra',
        city: 'Accra',
        area: 'East Legon',
        address: '78 Airport Road, East Legon, Accra',
        propertyType: PropertyType.HOUSE,
        bedrooms: 3,
        bathrooms: 3,
        maxTenants: 5,
        amenities: ['water', 'electricity', 'wifi', 'ac', 'parking', 'security', 'kitchen', 'balcony'],
        images: [
          { url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', publicId: 'prop3_1' },
          { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', publicId: 'prop3_2' },
        ],
        status: PropertyStatus.AVAILABLE,
        location: { type: 'Point', coordinates: [-0.1500, 5.6400] },
        contactPhone: '+1234567891',
        landlordId: landlords[0]._id,
        isApproved: true,
        isFeatured: true,
        views: 320,
      },
      {
        title: 'Luxurious Penthouse with City View',
        description: 'Premium penthouse with panoramic city views. Features high-end finishes, private terrace, and concierge service.',
        price: 4000,
        region: 'Greater Accra',
        city: 'Accra',
        area: 'Airport Residential',
        address: '10 Airport City, Accra',
        propertyType: PropertyType.PENTHOUSE,
        bedrooms: 3,
        bathrooms: 3,
        maxTenants: 4,
        amenities: ['wifi', 'ac', 'parking', 'security', 'kitchen', 'balcony', 'gym', 'pool'],
        images: [
          { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', publicId: 'prop4_1' },
          { url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7a57c3?w=800', publicId: 'prop4_2' },
        ],
        status: PropertyStatus.AVAILABLE,
        location: { type: 'Point', coordinates: [-0.1700, 5.6050] },
        contactPhone: '+1234567892',
        landlordId: landlords[1]._id,
        isApproved: true,
        isFeatured: true,
        views: 512,
      },
      {
        title: 'Affordable Room in Shared Apartment',
        description: 'Private room in a shared 3-bedroom apartment. Common areas include living room, kitchen, and bathroom. Great for young professionals.',
        price: 400,
        region: 'Greater Accra',
        city: 'Accra',
        area: 'Tema',
        address: '25 Community 7, Tema',
        propertyType: PropertyType.ROOM,
        bedrooms: 1,
        bathrooms: 1,
        maxTenants: 1,
        amenities: ['water', 'electricity', 'wifi'],
        images: [
          { url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800', publicId: 'prop5_1' },
        ],
        status: PropertyStatus.AVAILABLE,
        location: { type: 'Point', coordinates: [-0.0100, 5.6700] },
        contactPhone: '+1234567893',
        landlordId: landlords[2]._id,
        isApproved: true,
        isFeatured: false,
        views: 89,
      },
      {
        title: 'Modern Duplex in Gated Community',
        description: 'Contemporary duplex in a secure gated community. Features include private garden, servant quarters, and double parking.',
        price: 3000,
        region: 'Western',
        city: 'Takoradi',
        area: 'Sekondi-Takoradi',
        address: '55 Market Road, Takoradi',
        propertyType: PropertyType.DUPLEX,
        bedrooms: 4,
        bathrooms: 3,
        maxTenants: 6,
        amenities: ['water', 'electricity', 'wifi', 'ac', 'parking', 'security', 'kitchen', 'balcony'],
        images: [
          { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', publicId: 'prop6_1' },
          { url: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800', publicId: 'prop6_2' },
        ],
        status: PropertyStatus.AVAILABLE,
        location: { type: 'Point', coordinates: [-1.7600, 4.8900] },
        contactPhone: '+1234567891',
        landlordId: landlords[0]._id,
        isApproved: true,
        isFeatured: true,
        views: 267,
      },
      {
        title: 'Elegant Townhouse with Garden',
        description: 'Beautiful townhouse with private garden and modern finishes throughout. Located in a quiet residential area.',
        price: 2000,
        region: 'Central',
        city: 'Cape Coast',
        area: 'Osu Castle',
        address: '12 Castle Road, Cape Coast',
        propertyType: PropertyType.TOWNHOUSE,
        bedrooms: 3,
        bathrooms: 2,
        maxTenants: 4,
        amenities: ['water', 'electricity', 'wifi', 'parking', 'security', 'kitchen'],
        images: [
          { url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800', publicId: 'prop7_1' },
        ],
        status: PropertyStatus.AVAILABLE,
        location: { type: 'Point', coordinates: [-1.2466, 5.1050] },
        contactPhone: '+1234567892',
        landlordId: landlords[1]._id,
        isApproved: true,
        isFeatured: false,
        views: 145,
      },
      {
        title: 'Commercial Office Space in Business District',
        description: 'Prime commercial space in the heart of the business district. Suitable for offices, clinics, or retail.',
        price: 5000,
        region: 'Greater Accra',
        city: 'Accra',
        area: 'Ring Road',
        address: '90 Ring Road Central, Accra',
        propertyType: PropertyType.COMMERCIAL,
        bedrooms: 0,
        bathrooms: 4,
        maxTenants: 20,
        amenities: ['electricity', 'wifi', 'parking', 'security', 'kitchen'],
        images: [
          { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', publicId: 'prop8_1' },
        ],
        status: PropertyStatus.AVAILABLE,
        location: { type: 'Point', coordinates: [-0.1900, 5.5700] },
        contactPhone: '+1234567891',
        landlordId: landlords[0]._id,
        isApproved: true,
        isFeatured: true,
        views: 378,
      },
    ]);

    console.log('Seed data created successfully!');
    console.log(`Admin: admin@rentapp.com / admin123`);
    console.log(`Landlords: sarah@landlord.com, michael@landlord.com, emily@landlord.com / landlord123`);
    console.log(`Tenants: john@tenant.com, jane@tenant.com / tenant123`);
    console.log(`Properties: ${properties.length} created`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
