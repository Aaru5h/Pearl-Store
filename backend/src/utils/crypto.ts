import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createHash, randomBytes } from 'crypto';
import { env } from '../config/env';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: string;
  jti: string;
}

export const generateAccessToken = (userId: string, email: string, role: string): string => {
  const payload: AccessTokenPayload = {
    sub: userId,
    email,
    role,
    jti: randomBytes(16).toString('hex'),
  };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRY });
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
};

export const generateRefreshToken = (): string => {
  return randomBytes(64).toString('hex');
};

export const hashToken = (token: string): string => {
  return createHash('sha256').update(token).digest('hex');
};

export const generateRandomToken = (): string => {
  return randomBytes(32).toString('hex');
};
