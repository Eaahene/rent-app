import jwt from 'jsonwebtoken';
import { Response } from 'express';

function parseExpiry(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const num = Number(value);
  if (!isNaN(num)) return num;
  const match = value.match(/^(\d+)([mhd])$/);
  if (!match) return fallback;
  const n = parseInt(match[1]);
  switch (match[2]) {
    case 'm': return n * 60;
    case 'h': return n * 3600;
    case 'd': return n * 86400;
    default: return fallback;
  }
}

export const generateTokens = (userId: string, role: string) => {
  const accessExpiry = parseExpiry(process.env.JWT_ACCESS_EXPIRY, 900);
  const refreshExpiry = parseExpiry(process.env.JWT_REFRESH_EXPIRY, 604800);

  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: accessExpiry }
  );

  const refreshToken = jwt.sign(
    { userId, role },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: refreshExpiry }
  );

  return { accessToken, refreshToken };
};

export const setTokenCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const baseOptions = {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? ('none' as const) : ('lax' as const),
    path: '/',
  };

  // Access token as regular cookie (readable by frontend for Authorization header)
  res.cookie('accessToken', accessToken, {
    ...baseOptions,
    httpOnly: false,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Refresh token as httpOnly cookie (not accessible by frontend JS)
  res.cookie('refreshToken', refreshToken, {
    ...baseOptions,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearTokenCookies = (res: Response) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const baseOptions = {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? ('none' as const) : ('lax' as const),
    path: '/',
  };

  res.cookie('accessToken', '', { ...baseOptions, expires: new Date(0) });
  res.cookie('refreshToken', '', { ...baseOptions, httpOnly: true, expires: new Date(0) });
};
