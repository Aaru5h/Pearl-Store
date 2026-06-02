import { ValidationError } from '../errors/ValidationError';

export interface AddressProps {
  label?: string;
  recipientName: string;
  recipientPhone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  lat?: number;
  lng?: number;
}

export class Address {
  private readonly label?: string;
  private readonly recipientName: string;
  private readonly recipientPhone: string;
  private readonly line1: string;
  private readonly line2?: string;
  private readonly city: string;
  private readonly state: string;
  private readonly zip: string;
  private readonly country: string;
  private readonly lat?: number;
  private readonly lng?: number;

  constructor(props: AddressProps) {
    this.validate(props);
    this.label = props.label;
    this.recipientName = props.recipientName.trim();
    this.recipientPhone = props.recipientPhone.trim();
    this.line1 = props.line1.trim();
    this.line2 = props.line2?.trim();
    this.city = props.city.trim();
    this.state = props.state.trim();
    this.zip = props.zip.trim();
    this.country = props.country.trim().toUpperCase();
    this.lat = props.lat;
    this.lng = props.lng;
  }

  private validate(props: AddressProps): void {
    if (!props.recipientName || props.recipientName.trim().length === 0) {
      throw new ValidationError('Recipient name is required');
    }
    if (!props.recipientPhone || props.recipientPhone.trim().length === 0) {
      throw new ValidationError('Recipient phone is required');
    }
    if (!props.line1 || props.line1.trim().length === 0) {
      throw new ValidationError('Address line 1 is required');
    }
    if (!props.city || props.city.trim().length === 0) {
      throw new ValidationError('City is required');
    }
    if (!props.state || props.state.trim().length === 0) {
      throw new ValidationError('State is required');
    }
    if (!props.zip || props.zip.trim().length === 0) {
      throw new ValidationError('Zip/Postal code is required');
    }
    if (!props.country || props.country.trim().length === 0) {
      throw new ValidationError('Country is required');
    }
  }

  public getProps(): AddressProps {
    return {
      label: this.label,
      recipientName: this.recipientName,
      recipientPhone: this.recipientPhone,
      line1: this.line1,
      line2: this.line2,
      city: this.city,
      state: this.state,
      zip: this.zip,
      country: this.country,
      lat: this.lat,
      lng: this.lng,
    };
  }

  public toString(): string {
    return `${this.recipientName}, ${this.line1}${this.line2 ? `, ${this.line2}` : ''}, ${this.city}, ${this.state} - ${this.zip}, ${this.country}`;
  }

  public equals(other: Address): boolean {
    const p1 = this.getProps();
    const p2 = other.getProps();
    return (
      p1.recipientName === p2.recipientName &&
      p1.recipientPhone === p2.recipientPhone &&
      p1.line1 === p2.line1 &&
      p1.line2 === p2.line2 &&
      p1.city === p2.city &&
      p1.state === p2.state &&
      p1.zip === p2.zip &&
      p1.country === p2.country
    );
  }
}
