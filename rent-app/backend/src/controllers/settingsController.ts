import { Request, Response } from 'express';
import SiteSettings from '../models/SiteSettings';
import { ApiError, ApiResponse } from '../utils/apiResponse';
import { catchAsync } from '../utils/catchAsync';

const getSettings = catchAsync(async (req: Request, res: Response) => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  ApiResponse.success(res, settings);
});

const updateSettings = catchAsync(async (req: Request, res: Response) => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create(req.body);
  } else {
    Object.assign(settings, req.body);
    await settings.save();
  }
  ApiResponse.success(res, settings, 'Settings updated successfully');
});

export { getSettings, updateSettings };
