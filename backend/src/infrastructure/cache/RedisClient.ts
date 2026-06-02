import Redis from 'ioredis';
import { env } from '../../config/env';
import { logger } from '../../config/logger';

const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null, // Essential setting for BullMQ integration
  lazyConnect: true, // Don't block startup, let it connect asynchronously
});

redis.on('connect', () => {
  logger.info('Connected to Redis successfully');
});

redis.on('error', (err) => {
  logger.error('Redis connection error:', err);
});

export { redis };
export default redis;
