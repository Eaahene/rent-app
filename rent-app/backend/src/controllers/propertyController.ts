import { Request, Response } from 'express';
import Property from '../models/Property';
import Favorite from '../models/Favorite';
import { ApiError, ApiResponse } from '../utils/apiResponse';
import { catchAsync } from '../utils/catchAsync';
import { SearchFilters, PropertyStatus } from '../interfaces';

export const getProperties = catchAsync(async (req: Request, res: Response) => {
  const {
    region, city, area, propertyType, minPrice, maxPrice,
    bedrooms, bathrooms, amenities, status, sort,
    page = 1, limit = 12, furnished,
  } = req.query;

  const query: any = { isApproved: true };

  if (region) query.region = { $regex: region, $options: 'i' };
  if (city) query.city = { $regex: city, $options: 'i' };
  if (area) query.area = { $regex: area, $options: 'i' };
  if (propertyType) query.propertyType = propertyType;
  if (status) query.status = status;

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
  if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };

  if (amenities) {
    const amenityList = (amenities as string).split(',');
    query.amenities = { $all: amenityList };
  }

  // Geo query
  const lng = Number(req.query.lng);
  const lat = Number(req.query.lat);
  const radius = Number(req.query.radius) || 10000;

  if (lng && lat) {
    query.location = {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: radius,
      },
    };
  }

  // Sort
  let sortOption: any = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  else if (sort === 'price_desc') sortOption = { price: -1 };
  else if (sort === 'newest') sortOption = { createdAt: -1 };
  else if (sort === 'oldest') sortOption = { createdAt: 1 };
  else if (sort === 'popular') sortOption = { views: -1 };

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const [properties, total] = await Promise.all([
    Property.find(query).sort(sortOption).skip(skip).limit(limitNum).populate('landlordId', 'name avatar isVerified phone'),
    Property.countDocuments(query),
  ]);

  ApiResponse.paginated(res, properties, total, pageNum, limitNum);
});

export const getPropertyById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const property = await Property.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate('landlordId', 'name avatar isVerified phone email');

  if (!property) {
    throw ApiError.notFound('Property not found');
  }

  ApiResponse.success(res, property);
});

export const getSimilarProperties = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const property = await Property.findById(id);
  if (!property) {
    throw ApiError.notFound('Property not found');
  }

  const similar = await Property.find({
    _id: { $ne: id },
    isApproved: true,
    status: PropertyStatus.AVAILABLE,
    $or: [
      { city: property.city, propertyType: property.propertyType },
      { propertyType: property.propertyType, price: { $gte: property.price * 0.7, $lte: property.price * 1.3 } },
    ],
  })
    .limit(6)
    .populate('landlordId', 'name avatar isVerified');

  ApiResponse.success(res, similar);
});

export const createProperty = catchAsync(async (req: Request, res: Response) => {
  const propertyData = {
    ...req.body,
    landlordId: req.user!._id,
    isApproved: req.user!.role === 'admin', // Auto-approve if admin
  };

  const property = await Property.create(propertyData);
  await property.populate('landlordId', 'name avatar isVerified phone');

  ApiResponse.created(res, property, 'Property created successfully');
});

export const updateProperty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const property = await Property.findById(id);
  if (!property) {
    throw ApiError.notFound('Property not found');
  }

  // Only landlord owner or admin can update
  if (property.landlordId.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    throw ApiError.forbidden('You can only edit your own properties');
  }

  const updated = await Property.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    .populate('landlordId', 'name avatar isVerified phone');

  ApiResponse.success(res, updated, 'Property updated successfully');
});

export const deleteProperty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const property = await Property.findById(id);
  if (!property) {
    throw ApiError.notFound('Property not found');
  }

  if (property.landlordId.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    throw ApiError.forbidden('You can only delete your own properties');
  }

  await Property.findByIdAndDelete(id);
  await Favorite.deleteMany({ propertyId: id });

  ApiResponse.success(res, null, 'Property deleted successfully');
});

export const getMyProperties = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 12, status } = req.query;

  const query: any = { landlordId: req.user!._id };
  if (status) query.status = status;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const [properties, total] = await Promise.all([
    Property.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Property.countDocuments(query),
  ]);

  ApiResponse.paginated(res, properties, total, pageNum, limitNum);
});

export const toggleFavorite = catchAsync(async (req: Request, res: Response) => {
  const { propertyId } = req.params;
  const userId = req.user!._id;

  const property = await Property.findById(propertyId);
  if (!property) {
    throw ApiError.notFound('Property not found');
  }

  const existing = await Favorite.findOne({ userId, propertyId });

  if (existing) {
    await Favorite.findByIdAndDelete(existing._id);
    ApiResponse.success(res, { isFavorited: false }, 'Removed from favorites');
  } else {
    await Favorite.create({ userId, propertyId });
    ApiResponse.success(res, { isFavorited: true }, 'Added to favorites');
  }
});

export const getMyFavorites = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 12 } = req.query;
  const userId = req.user!._id;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const [favorites, total] = await Promise.all([
    Favorite.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limitNum)
      .populate({ path: 'propertyId', populate: { path: 'landlordId', select: 'name avatar isVerified' } }),
    Favorite.countDocuments({ userId }),
  ]);

  const properties = favorites.map(f => f.propertyId);

  ApiResponse.paginated(res, properties, total, pageNum, limitNum);
});

export const checkFavorite = catchAsync(async (req: Request, res: Response) => {
  const { propertyId } = req.params;
  const userId = req.user!._id;

  const existing = await Favorite.findOne({ userId, propertyId });
  ApiResponse.success(res, { isFavorited: !!existing });
});

export const getFeaturedProperties = catchAsync(async (req: Request, res: Response) => {
  const properties = await Property.find({
    isApproved: true,
    status: PropertyStatus.AVAILABLE,
    isFeatured: true,
  })
    .limit(8)
    .populate('landlordId', 'name avatar isVerified')
    .sort({ createdAt: -1 });

  ApiResponse.success(res, properties);
});

export const getRecentProperties = catchAsync(async (req: Request, res: Response) => {
  const properties = await Property.find({
    isApproved: true,
    status: PropertyStatus.AVAILABLE,
  })
    .limit(8)
    .populate('landlordId', 'name avatar isVerified')
    .sort({ createdAt: -1 });

  ApiResponse.success(res, properties);
});
