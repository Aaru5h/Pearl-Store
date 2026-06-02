import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ForbiddenError } from '../../../domain/shared/errors/ForbiddenError';
import { UserRole } from '../../../domain/identity/User';

export const requireRole = (...roles: UserRole[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ForbiddenError('Authentication required');
    }
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError('Insufficient permissions');
    }
    next();
  };
};
