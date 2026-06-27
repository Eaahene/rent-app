import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser, UserRole } from '../interfaces';
import User from '../models/User';
import { ApiError } from '../utils/apiResponse';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.accessToken;

    if (!token) {
      throw ApiError.unauthorized('Access token required');
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as { userId: string; role: string };

    const user = await User.findById(decoded.userId).select('-password -refreshToken');
    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Account is suspended');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(ApiError.unauthorized('Token expired'));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(ApiError.unauthorized('Invalid token'));
    }
    next(error);
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }

    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have permission to perform this action'));
    }

    next();
  };
};
