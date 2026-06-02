import { DomainError } from './DomainError';

export class ConflictError extends DomainError {
  public readonly statusCode = 409;

  constructor(message: string = 'Conflict occurred') {
    super(message);
  }
}
