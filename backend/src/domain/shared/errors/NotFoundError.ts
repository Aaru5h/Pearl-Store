import { DomainError } from './DomainError';

export class NotFoundError extends DomainError {
  public readonly statusCode = 404;

  constructor(message: string = 'Resource not found') {
    super(message);
  }
}
