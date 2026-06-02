import { ValidationError } from '../errors/ValidationError';

export class PhoneNumber {
  private readonly value: string;

  // Supports general E.164 formatted phone numbers (e.g. +919876543210 or +12345678901)
  private static readonly PHONE_REGEX = /^\+[1-9]\d{1,14}$/;

  constructor(value: string) {
    if (!value) {
      throw new ValidationError('Phone number cannot be empty');
    }
    const cleanValue = value.trim().replace(/\s+/g, '');
    if (!PhoneNumber.PHONE_REGEX.test(cleanValue)) {
      throw new ValidationError(`Invalid phone format: ${value}. Must be in E.164 format (e.g., +919876543210)`);
    }
    this.value = cleanValue;
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: PhoneNumber): boolean {
    return this.value === other.getValue();
  }
}
