import bcrypt from 'bcrypt';
import { EmailAddress } from '../shared/value-objects/EmailAddress';
import { PhoneNumber } from '../shared/value-objects/PhoneNumber';
import { ValidationError } from '../shared/errors/ValidationError';
import { ForbiddenError } from '../shared/errors/ForbiddenError';

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'OWNER';

export interface UserProps {
  id?: string;
  email: EmailAddress;
  emailVerified?: boolean;
  passwordHash?: string | null;
  name: string;
  phone?: PhoneNumber | null;
  avatarUrl?: string | null;
  role?: UserRole;
  isActive?: boolean;
  lastLoginAt?: Date | null;
  failedLoginCount?: number;
  lockedUntil?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private readonly id?: string;
  private email: EmailAddress;
  private emailVerified: boolean;
  private passwordHash: string | null;
  private name: string;
  private phone: PhoneNumber | null;
  private avatarUrl: string | null;
  private role: UserRole;
  private isActive: boolean;
  private lastLoginAt: Date | null;
  private failedLoginCount: number;
  private lockedUntil: Date | null;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.emailVerified = props.emailVerified ?? false;
    this.passwordHash = props.passwordHash ?? null;
    this.name = props.name.trim();
    this.phone = props.phone ?? null;
    this.avatarUrl = props.avatarUrl ?? null;
    this.role = props.role ?? 'CUSTOMER';
    this.isActive = props.isActive ?? true;
    this.lastLoginAt = props.lastLoginAt ?? null;
    this.failedLoginCount = props.failedLoginCount ?? 0;
    this.lockedUntil = props.lockedUntil ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  // Domain Business Methods
  
  public getId(): string | undefined {
    return this.id;
  }

  public getEmail(): EmailAddress {
    return this.email;
  }

  public isEmailVerified(): boolean {
    return this.emailVerified;
  }

  public verifyEmail(): void {
    if (this.emailVerified) {
      throw new ValidationError('Email is already verified');
    }
    this.emailVerified = true;
    this.updatedAt = new Date();
  }

  public getName(): string {
    return this.name;
  }

  public getPhone(): PhoneNumber | null {
    return this.phone;
  }

  public getAvatarUrl(): string | null {
    return this.avatarUrl;
  }

  public getRole(): UserRole {
    return this.role;
  }

  public getPasswordHash(): string | null {
    return this.passwordHash;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getLastLoginAt(): Date | null {
    return this.lastLoginAt;
  }

  public getFailedLoginCount(): number {
    return this.failedLoginCount;
  }

  public getLockedUntil(): Date | null {
    return this.lockedUntil;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public isLocked(): boolean {
    if (!this.lockedUntil) return false;
    return this.lockedUntil > new Date();
  }

  public async checkPassword(password: string): Promise<boolean> {
    if (!this.passwordHash) return false;
    
    if (this.isLocked()) {
      throw new ForbiddenError('Account is temporarily locked. Please try again later.');
    }

    const matches = await bcrypt.compare(password, this.passwordHash);
    
    if (matches) {
      this.resetFailedLogins();
    } else {
      this.incrementFailedLogins();
    }
    
    return matches;
  }

  private incrementFailedLogins(): void {
    this.failedLoginCount += 1;
    if (this.failedLoginCount >= 5) {
      // Lock account for 30 minutes
      this.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    }
    this.updatedAt = new Date();
  }

  private resetFailedLogins(): void {
    this.failedLoginCount = 0;
    this.lockedUntil = null;
    this.lastLoginAt = new Date();
    this.updatedAt = new Date();
  }

  public updatePasswordHash(hash: string): void {
    this.passwordHash = hash;
    this.failedLoginCount = 0;
    this.lockedUntil = null;
    this.updatedAt = new Date();
  }

  public updateProfile(name?: string, phone?: PhoneNumber, avatarUrl?: string): void {
    if (name !== undefined) {
      if (name.trim().length === 0) {
        throw new ValidationError('Name cannot be empty');
      }
      this.name = name.trim();
    }
    if (phone !== undefined) {
      this.phone = phone;
    }
    if (avatarUrl !== undefined) {
      this.avatarUrl = avatarUrl;
    }
    this.updatedAt = new Date();
  }

  public updateEmail(newEmail: EmailAddress): void {
    this.email = newEmail;
    this.emailVerified = false; // Requires re-verification
    this.updatedAt = new Date();
  }

  public suspend(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  public reactivate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }
}
