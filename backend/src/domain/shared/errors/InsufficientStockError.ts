import { DomainError } from './DomainError';

export class InsufficientStockError extends DomainError {
  public readonly statusCode = 400;
  public readonly productId: string;
  public readonly requested: number;
  public readonly available: number;

  constructor(productId: string, requested: number, available: number, message?: string) {
    super(message || `Insufficient stock for product ${productId}. Requested: ${requested}, Available: ${available}`);
    this.productId = productId;
    this.requested = requested;
    this.available = available;
  }
}
