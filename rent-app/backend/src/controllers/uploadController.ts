import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import { ApiError, ApiResponse } from '../utils/apiResponse';
import { catchAsync } from '../utils/catchAsync';

export const uploadImages = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    throw ApiError.badRequest('No images uploaded. Please select image files.');
  }

  const images = files.map((file) => ({
    url: file.path,
    publicId: file.filename,
  }));

  ApiResponse.created(res, images, `${images.length} image(s) uploaded successfully`);
});

export const deleteImage = catchAsync(async (req: Request, res: Response) => {
  const { publicId } = req.params;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (e) {
    // Image may already be deleted
  }

  ApiResponse.success(res, null, 'Image deleted successfully');
});

export const uploadAvatar = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) {
    throw ApiError.badRequest('No image uploaded');
  }

  ApiResponse.success(res, {
    url: file.path,
    publicId: file.filename,
  }, 'Avatar uploaded successfully');
});
