import { DomainError } from './DomainError';

export class PaymentError extends DomainError {
  public readonly statusCode = 402; // Payment Required

  constructor(message: string = 'Payment processing failed') {
    super(message);
  }
}
