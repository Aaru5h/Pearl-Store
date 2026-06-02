import { UserRole } from '../domain/identity/User';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
      requestId?: string;
    }
  }
}
