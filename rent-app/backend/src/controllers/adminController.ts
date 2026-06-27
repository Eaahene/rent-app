import { Request, Response } from 'express';
import User from '../models/User';
import Property from '../models/Property';
import Inquiry from '../models/Inquiry';
import { ApiError, ApiResponse } from '../utils/apiResponse';
import { catchAsync } from '../utils/catchAsync';
import { UserRole } from '../interfaces';

export const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const [totalUsers, totalLandlords, totalTenants, totalProperties, approvedProperties, pendingProperties, totalInquiries] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: UserRole.LANDLORD }),
    User.countDocuments({ role: UserRole.TENANT }),
    Property.countDocuments(),
    Property.countDocuments({ isApproved: true }),
    Property.countDocuments({ isApproved: false }),
    Inquiry.countDocuments(),
  ]);

  const recentProperties = await Property.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('landlordId', 'name email');

  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name email role createdAt');

  ApiResponse.success(res, {
    stats: {
      totalUsers,
      totalLandlords,
      totalTenants,
      totalProperties,
      approvedProperties,
      pendingProperties,
      totalInquiries,
    },
    recentProperties,
    recentUsers,
  });
});

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, role, search } = req.query;

  const query: any = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    User.countDocuments(query),
  ]);

  ApiResponse.paginated(res, users, total, pageNum, limitNum);
});

export const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const user = await User.findByIdAndUpdate(id, { isActive }, { new: true });
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  ApiResponse.success(res, user, `User ${isActive ? 'activated' : 'suspended'} successfully`);
});

export const verifyLandlord = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isVerified = true } = req.body;

  const user = await User.findById(id);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  if (user.role !== UserRole.LANDLORD) {
    throw ApiError.badRequest('User is not a landlord');
  }

  user.isVerified = isVerified;
  await user.save();

  ApiResponse.success(res, user, `Landlord ${isVerified ? 'verified' : 'unverified'} successfully`);
});

export const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, status, search, isApproved } = req.query;

  const query: any = {};
  if (status) query.status = status;
  if (isApproved !== undefined) query.isApproved = isApproved === 'true';
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { city: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const [properties, total] = await Promise.all([
    Property.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('landlordId', 'name email phone'),
    Property.countDocuments(query),
  ]);

  ApiResponse.paginated(res, properties, total, pageNum, limitNum);
});

export const getPropertyById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const property = await Property.findById(id).populate('landlordId', 'name email phone isVerified');
  if (!property) {
    throw ApiError.notFound('Property not found');
  }

  ApiResponse.success(res, property);
});

export const approveProperty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isApproved } = req.body;

  const property = await Property.findByIdAndUpdate(
    id,
    { isApproved },
    { new: true }
  ).populate('landlordId', 'name email');

  if (!property) {
    throw ApiError.notFound('Property not found');
  }

  ApiResponse.success(res, property, `Property ${isApproved ? 'approved' : 'rejected'} successfully`);
});

export const deleteProperty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const property = await Property.findByIdAndDelete(id);
  if (!property) {
    throw ApiError.notFound('Property not found');
  }

  ApiResponse.success(res, null, 'Property deleted successfully');
});

export const toggleFeatured = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const property = await Property.findById(id);
  if (!property) {
    throw ApiError.notFound('Property not found');
  }

  property.isFeatured = !property.isFeatured;
  await property.save();

  ApiResponse.success(res, property, `Property ${property.isFeatured ? 'featured' : 'unfeatured'}`);
});
