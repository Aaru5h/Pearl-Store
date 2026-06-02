import 'reflect-metadata';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import { env } from './config/env';
import { requestId } from './interfaces/http/middleware/requestId';
import { requestLogger } from './interfaces/http/middleware/requestLogger';
import { errorHandler } from './interfaces/http/middleware/errorHandler';
import { ApiResponse } from './utils/ApiResponse';
import { authRoutes } from './interfaces/http/routes/authRoutes';
import { userRoutes } from './interfaces/http/routes/userRoutes';
import { productRoutes } from './interfaces/http/routes/productRoutes';
import { categoryRoutes } from './interfaces/http/routes/categoryRoutes';
import { searchRoutes } from './interfaces/http/routes/searchRoutes';

const createApp = () => {
  const app = express();

  // Trust proxy for rate limiting (especially if behind Nginx/ALB)
  app.set('trust proxy', 1);

  // Security Headers
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(hpp());

  // Request Body Parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Middleware pipeline
  app.use(requestId);
  app.use(requestLogger);

  // Routes
  app.use(`${env.API_PREFIX}/auth`, authRoutes);
  app.use(`${env.API_PREFIX}/users`, userRoutes);
  app.use(`${env.API_PREFIX}/products`, productRoutes);
  app.use(`${env.API_PREFIX}/categories`, categoryRoutes);
  app.use(`${env.API_PREFIX}/search`, searchRoutes);

  // Basic healthcheck route
  app.get('/health', (req, res) => {
    res.status(200).json(ApiResponse.success({ status: 'UP' }, 'System healthy'));
  });

  // Global error fallback
  app.use(errorHandler);

  return app;
};

export { createApp };
