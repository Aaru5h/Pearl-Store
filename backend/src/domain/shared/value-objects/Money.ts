import { ValidationError } from '../errors/ValidationError';

export class Money {
  private readonly amount: number; // Stored in cents/paise (integer)
  private readonly currency: string;

  constructor(amount: number, currency: string = 'INR') {
    if (!Number.isInteger(amount)) {
      throw new ValidationError('Money amount must be an integer (in cents/paise)');
    }
    this.amount = amount;
    this.currency = currency.toUpperCase();
  }

  public getAmount(): number {
    return this.amount;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public getFormattedAmount(): number {
    return this.amount / 100;
  }

  private validateSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new ValidationError(`Currency mismatch: ${this.currency} vs ${other.currency}`);
    }
  }

  public add(other: Money): Money {
    this.validateSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  public subtract(other: Money): Money {
    this.validateSameCurrency(other);
    if (this.amount - other.amount < 0) {
      throw new ValidationError('Money amount cannot be negative');
    }
    return new Money(this.amount - other.amount, this.currency);
  }

  public multiply(factor: number): Money {
    if (factor < 0) {
      throw new ValidationError('Multiplication factor cannot be negative');
    }
    return new Money(Math.round(this.amount * factor), this.currency);
  }

  public equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  public greaterThan(other: Money): boolean {
    this.validateSameCurrency(other);
    return this.amount > other.amount;
  }

  public greaterThanOrEqual(other: Money): boolean {
    this.validateSameCurrency(other);
    return this.amount >= other.amount;
  }

  public lessThan(other: Money): boolean {
    this.validateSameCurrency(other);
    return this.amount < other.amount;
  }

  public lessThanOrEqual(other: Money): boolean {
    this.validateSameCurrency(other);
    return this.amount <= other.amount;
  }

  public isZero(): boolean {
    return this.amount === 0;
  }

  public static zero(currency: string = 'INR'): Money {
    return new Money(0, currency);
  }
}
