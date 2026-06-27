import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import { UserRole } from '../interfaces';

dotenv.config();

const updateAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    const admin = await User.findOne({ email: 'admin@rentapp.com' }).select('+password');
    
    if (!admin) {
      console.log('Admin user not found');
      process.exit(1);
    }

    admin.password = 'Admin@12345';
    await admin.save();

    console.log('Admin password updated successfully!');
    console.log('Email: admin@rentapp.com');
    console.log('New Password: Admin@12345');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateAdminPassword();
