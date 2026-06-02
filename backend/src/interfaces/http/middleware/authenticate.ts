import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../../../domain/shared/errors/ForbiddenError';
import { verifyAccessToken } from '../../../utils/crypto';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ForbiddenError('Access token is missing');
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role as any,
    };
    next();
  } catch (error: any) {
    throw new ForbiddenError(error.name === 'TokenExpiredError' ? 'Access token has expired' : 'Invalid access token');
  }
};
