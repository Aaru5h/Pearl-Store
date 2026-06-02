import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../../../domain/shared/errors/ForbiddenError';
import { container } from '../../../container';
import { IUserRepository } from '../../../infrastructure/persistence/interfaces/IUserRepository';

export const requireEmailVerified = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    return next(new ForbiddenError('Authentication required'));
  }

  try {
    const userRepository = container.resolve<IUserRepository>('IUserRepository');
    const user = await userRepository.findById(req.user.id);

    if (!user) {
      return next(new ForbiddenError('User not found'));
    }

    if (!user.isEmailVerified()) {
      return next(new ForbiddenError('Email verification required'));
    }

    next();
  } catch (error) {
    next(error);
  }
};
