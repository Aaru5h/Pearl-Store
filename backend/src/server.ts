import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './infrastructure/persistence/prisma/PrismaClient';
import { redis } from './infrastructure/cache/RedisClient';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down server gracefully...`);
  
  // Give current active connections time to finish up to 10 seconds
  const forceShutdownTimeout = setTimeout(() => {
    logger.error('Graceful shutdown timed out, forcing exit.');
    process.exit(1);
  }, 10000);

  server.close(async () => {
    logger.info('HTTP server closed');
    try {
      await prisma.$disconnect();
      logger.info('Database connection pool disconnected');
      
      await redis.disconnect();
      logger.info('Redis client disconnected');
      
      clearTimeout(forceShutdownTimeout);
      logger.info('Shutdown complete.');
      process.exit(0);
    } catch (error) {
      logger.error('Error occurred during database or cache disconnect:', error);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
