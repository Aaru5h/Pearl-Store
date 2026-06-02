import { DomainError } from './DomainError';

export class ForbiddenError extends DomainError {
  public readonly statusCode = 403;

  constructor(message: string = 'Forbidden action') {
    super(message);
  }
}
