import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../../domain/shared/errors/DomainError';
import { logger } from '../../../config/logger';
import { ApiResponse } from '../../../utils/ApiResponse';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const requestId = req.headers['x-request-id'] || 'no-request-id';

  if (err instanceof DomainError) {
    logger.warn(`[DomainError] [Req: ${requestId}] ${err.message}`, {
      statusCode: err.statusCode,
      stack: err.stack,
    });
    return res.status(err.statusCode).json(
      ApiResponse.error(err.message, (err as any).errors || undefined)
    );
  }

  // Handle standard ZodError
  if (err.name === 'ZodError') {
    logger.warn(`[ZodError] [Req: ${requestId}] Validation failed`, { err });
    return res.status(400).json(
      ApiResponse.error('Validation failed', (err as any).errors || err.message)
    );
  }

  // Handle Prisma Database Errors (e.g. Unique Constraint, foreign keys)
  if (err.name?.startsWith('Prisma')) {
    logger.error(`[DatabaseError] [Req: ${requestId}] ${err.message}`, {
      stack: err.stack,
    });
    // Don't leak raw database errors in production
    return res.status(400).json(
      ApiResponse.error('Database transaction error occurred.')
    );
  }

  // Fallback for unhandled/internal server errors
  logger.error(`[UnhandledError] [Req: ${requestId}] ${err.message}`, {
    stack: err.stack,
  });

  return res.status(500).json(
    ApiResponse.error('An unexpected error occurred. Please try again later.')
  );
};
