import { Request, Response } from 'express';
import crypto from 'crypto';
import User from '../models/User';
import { generateTokens, setTokenCookies, clearTokenCookies } from '../utils/tokens';
import { ApiError, ApiResponse } from '../utils/apiResponse';
import { sendEmail, generateVerificationEmail, generateResetPasswordEmail } from '../utils/email';
import { catchAsync } from '../utils/catchAsync';
import { UserRole } from '../interfaces';

export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict('Email already registered');
  }

  const user = await User.create({ name, email, password, phone, role: role || UserRole.TENANT });

  const tokens = generateTokens(user._id as string, user.role);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  setTokenCookies(res, tokens.refreshToken);

  // Send verification email (non-blocking)
  try {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    await sendEmail({
      to: user.email,
      subject: 'Verify your email - RentApp',
      html: generateVerificationEmail(verificationToken, baseUrl),
    });
  } catch (e) {
    console.error('Failed to send verification email:', e);
  }

  ApiResponse.created(res, {
    user,
    accessToken: tokens.accessToken,
  }, 'Registration successful');
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw ApiError.badRequest('Invalid email or password');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('Account is suspended');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw ApiError.badRequest('Invalid email or password');
  }

  const tokens = generateTokens(user._id as string, user.role);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  setTokenCookies(res, tokens.refreshToken);

  ApiResponse.success(res, {
    user,
    accessToken: tokens.accessToken,
  }, 'Login successful');
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  }
  clearTokenCookies(res);
  ApiResponse.success(res, null, 'Logged out successfully');
});

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw ApiError.unauthorized('Refresh token required');
  }

  const jwt = await import('jsonwebtoken');
  const decoded = jwt.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as {
    userId: string;
    role: string;
  };

  const user = await User.findById(decoded.userId).select('+refreshToken');
  if (!user || user.refreshToken !== refreshToken) {
    throw ApiError.unauthorized('Invalid refresh token');
  }

  const tokens = generateTokens(user._id as string, user.role);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  setTokenCookies(res, tokens.refreshToken);

  ApiResponse.success(res, { accessToken: tokens.accessToken }, 'Token refreshed');
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, { user: req.user }, 'User profile');
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if email exists
    return ApiResponse.success(res, null, 'If the email exists, a reset link has been sent');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  try {
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    await sendEmail({
      to: user.email,
      subject: 'Reset your password - RentApp',
      html: generateResetPasswordEmail(resetToken, baseUrl),
    });
  } catch (e) {
    console.error('Failed to send reset email:', e);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    throw ApiError.internal('Failed to send reset email');
  }

  ApiResponse.success(res, null, 'If the email exists, a reset link has been sent');
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token, password } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw ApiError.badRequest('Invalid or expired reset token');
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = null as any;
  await user.save();

  clearTokenCookies(res);

  ApiResponse.success(res, null, 'Password reset successful. Please login.');
});

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    throw ApiError.badRequest('Verification token required');
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw ApiError.badRequest('Invalid or expired verification token');
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  ApiResponse.success(res, null, 'Email verified successfully');
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const { name, phone, avatar } = req.body;

  const user = await User.findById(req.user!._id);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (avatar) user.avatar = avatar;

  await user.save();

  ApiResponse.success(res, { user }, 'Profile updated successfully');
});

export const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user!._id).select('+password');
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  user.password = newPassword;
  user.refreshToken = null as any;
  await user.save();

  clearTokenCookies(res);

  ApiResponse.success(res, null, 'Password changed successfully. Please login again.');
});
