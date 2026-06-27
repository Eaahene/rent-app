import mongoose, { Schema } from 'mongoose';

export interface ISiteSettings {
  aboutTitle: string;
  aboutContent: string;
  aboutMission: string;
  aboutVision: string;
  contactPhone: string;
  contactEmail: string;
}

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    aboutTitle: {
      type: String,
      default: 'About RentApp',
    },
    aboutContent: {
      type: String,
      default: 'RentApp is Ghana\'s leading rental marketplace connecting tenants directly with landlords. We eliminate the need for middlemen, making the rental process simpler, faster, and more transparent.',
    },
    aboutMission: {
      type: String,
      default: 'Our mission is to simplify the rental process in Ghana by connecting tenants directly with landlords, eliminating unnecessary agent fees and making housing accessible to everyone.',
    },
    aboutVision: {
      type: String,
      default: 'To become Ghana\'s most trusted and comprehensive rental platform, where every tenant finds their perfect home and every landlord finds reliable tenants.',
    },
    contactPhone: {
      type: String,
      default: '0548744723',
    },
    contactEmail: {
      type: String,
      default: 'support@rentapp.com',
    },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', siteSettingsSchema);
