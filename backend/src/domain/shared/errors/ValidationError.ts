import { DomainError } from './DomainError';

export class ValidationError extends DomainError {
  public readonly statusCode = 400;
  public readonly errors?: any;

  constructor(message: string = 'Validation failed', errors?: any) {
    super(message);
    this.errors = errors;
  }
}
