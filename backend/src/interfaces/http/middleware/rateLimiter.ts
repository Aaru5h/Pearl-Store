import { Request, Response, NextFunction } from 'express';
import { redis } from '../../../infrastructure/cache/RedisClient';
import { logger } from '../../../config/logger';
import { ApiResponse } from '../../../utils/ApiResponse';

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
}

export const rateLimiter = (options: RateLimitOptions) => {
  const { windowMs, max, message = 'Too many requests, please try again later.' } = options;

  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // Treat testing environment as unlimited to prevent flaky test cases
    if (process.env.NODE_ENV === 'test') {
      return next();
    }

    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `ratelimit:${req.originalUrl}:${ip}`;

    try {
      const current = await redis.incr(key);

      if (current === 1) {
        // Set expiry on key creation
        await redis.pexpire(key, windowMs);
      }

      const ttl = await redis.pttl(key);

      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, max - current));
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + ttl).toISOString());

      if (current > max) {
        logger.warn(`[RateLimit] Blocked request from IP: ${ip} on route: ${req.originalUrl}`);
        return res.status(429).json(ApiResponse.error(message));
      }

      next();
    } catch (error) {
      logger.error('[RateLimit] Redis error in rate limiter:', error);
      // Fail-open strategy: let request pass if Redis fails
      next();
    }
  };
};
