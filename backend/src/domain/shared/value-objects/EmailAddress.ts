import { ValidationError } from '../errors/ValidationError';

export class EmailAddress {
  private readonly value: string;

  private static readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(value: string) {
    if (!value) {
      throw new ValidationError('Email address cannot be empty');
    }
    const cleanValue = value.trim().toLowerCase();
    if (!EmailAddress.EMAIL_REGEX.test(cleanValue)) {
      throw new ValidationError(`Invalid email format: ${value}`);
    }
    this.value = cleanValue;
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: EmailAddress): boolean {
    return this.value === other.getValue();
  }
}
