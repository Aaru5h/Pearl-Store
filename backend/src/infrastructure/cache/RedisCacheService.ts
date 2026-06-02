import { singleton } from 'tsyringe';
import { redis } from './RedisClient';
import { logger } from '../../config/logger';

@singleton()
export class RedisCacheService {
  public async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      logger.error(`[RedisCacheService] Failed to GET key "${key}":`, error);
      return null;
    }
  }

  public async set<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await redis.set(key, serialized, 'EX', ttlSeconds);
      } else {
        await redis.set(key, serialized);
      }
      return true;
    } catch (error) {
      logger.error(`[RedisCacheService] Failed to SET key "${key}":`, error);
      return false;
    }
  }

  public async del(key: string): Promise<boolean> {
    try {
      const result = await redis.del(key);
      return result > 0;
    } catch (error) {
      logger.error(`[RedisCacheService] Failed to DEL key "${key}":`, error);
      return false;
    }
  }

  public async delByPattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      logger.error(`[RedisCacheService] Failed to DEL pattern "${pattern}":`, error);
    }
  }

  public async flush(): Promise<void> {
    try {
      await redis.flushdb();
      logger.info('[RedisCacheService] Cache flushed completely');
    } catch (error) {
      logger.error('[RedisCacheService] Failed to flush cache:', error);
    }
  }
}
