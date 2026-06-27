import { Request, Response } from 'express';
import Inquiry from '../models/Inquiry';
import Property from '../models/Property';
import Notification from '../models/Notification';
import { ApiError, ApiResponse } from '../utils/apiResponse';
import { catchAsync } from '../utils/catchAsync';

export const createInquiry = catchAsync(async (req: Request, res: Response) => {
  const { propertyId, message } = req.body;
  const tenantId = req.user!._id;

  const property = await Property.findById(propertyId);
  if (!property) {
    throw ApiError.notFound('Property not found');
  }

  if (property.landlordId.toString() === tenantId.toString()) {
    throw ApiError.badRequest('You cannot inquire about your own property');
  }

  const inquiry = await Inquiry.create({ propertyId, tenantId, message });

  // Notify landlord
  await Notification.create({
    userId: property.landlordId,
    title: 'New Inquiry',
    message: `You have a new inquiry about "${property.title}"`,
    type: 'inquiry',
    relatedEntity: inquiry._id,
    entityType: 'Inquiry',
  });

  ApiResponse.created(res, inquiry, 'Inquiry sent successfully');
});

export const getPropertyInquiries = catchAsync(async (req: Request, res: Response) => {
  const { propertyId } = req.params;

  const property = await Property.findById(propertyId);
  if (!property) {
    throw ApiError.notFound('Property not found');
  }

  if (property.landlordId.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    throw ApiError.forbidden('Not authorized');
  }

  const inquiries = await Inquiry.find({ propertyId })
    .populate('tenantId', 'name email phone avatar')
    .sort({ createdAt: -1 });

  ApiResponse.success(res, inquiries);
});

export const getMyInquiries = catchAsync(async (req: Request, res: Response) => {
  const inquiries = await Inquiry.find({ tenantId: req.user!._id })
    .populate({
      path: 'propertyId',
      select: 'title images price city area',
    })
    .sort({ createdAt: -1 });

  ApiResponse.success(res, inquiries);
});

export const getLandlordInquiries = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id;

  const properties = await Property.find({ landlordId: userId }).select('_id');
  const propertyIds = properties.map((p) => p._id);

  const inquiries = await Inquiry.find({ propertyId: { $in: propertyIds } })
    .populate('tenantId', 'name email phone avatar')
    .populate('propertyId', 'title images price city area')
    .sort({ createdAt: -1 });

  ApiResponse.success(res, inquiries);
});

export const updateInquiryStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const inquiry = await Inquiry.findById(id).populate('propertyId');
  if (!inquiry) {
    throw ApiError.notFound('Inquiry not found');
  }

  const property = (inquiry.propertyId as any);
  if (property.landlordId.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    throw ApiError.forbidden('Not authorized');
  }

  inquiry.status = status;
  await inquiry.save();

  ApiResponse.success(res, inquiry, 'Inquiry status updated');
});
