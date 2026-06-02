import morgan from 'morgan';
import { Request } from 'express';
import { logger } from '../../../config/logger';

// Standard HTTP log format containing method, url, status, content length, response-time, and RequestID
const format = ':method :url :status :res[content-length] - :response-time ms [ReqId: :request-id]';

morgan.token('request-id', (req: Request) => {
  return (req.headers['x-request-id'] as string) || '-';
});

export const requestLogger = morgan(format, {
  stream: {
    write: (message: string) => {
      logger.http(message.trim());
    },
  },
});
