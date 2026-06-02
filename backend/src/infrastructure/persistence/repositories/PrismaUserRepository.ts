import { injectable } from 'tsyringe';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User, UserRole } from '../../../domain/identity/User';
import { EmailAddress } from '../../../domain/shared/value-objects/EmailAddress';
import { PhoneNumber } from '../../../domain/shared/value-objects/PhoneNumber';
import { prisma } from '../prisma/PrismaClient';

@injectable()
export class PrismaUserRepository implements IUserRepository {
  public async findById(id: string): Promise<User | null> {
    const rawUser = await prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
    if (!rawUser) return null;
    return this.toDomain(rawUser);
  }

  public async findByEmail(email: EmailAddress | string): Promise<User | null> {
    const emailStr = email instanceof EmailAddress ? email.getValue() : email.toLowerCase();
    const rawUser = await prisma.user.findUnique({
      where: { email: emailStr, deletedAt: null },
    });
    if (!rawUser) return null;
    return this.toDomain(rawUser);
  }

  public async save(user: User): Promise<User> {
    const id = user.getId();
    const data = {
      email: user.getEmail().getValue(),
      emailVerified: user.isEmailVerified(),
      passwordHash: user.getPasswordHash(),
      name: user.getName(),
      phone: user.getPhone()?.getValue() || null,
      avatarUrl: user.getAvatarUrl(),
      role: user.getRole(),
      isActive: user.getIsActive(),
      lastLoginAt: user.getLastLoginAt(),
      failedLoginCount: user.getFailedLoginCount(),
      lockedUntil: user.getLockedUntil(),
      updatedAt: new Date(),
    };

    let savedRaw;
    if (id) {
      savedRaw = await prisma.user.update({
        where: { id },
        data,
      });
    } else {
      savedRaw = await prisma.user.create({
        data: {
          ...data,
          createdAt: user.getCreatedAt(),
        },
      });
    }

    return this.toDomain(savedRaw);
  }

  public async delete(id: string): Promise<boolean> {
    try {
      await prisma.user.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return true;
    } catch {
      return false;
    }
  }

  private toDomain(raw: any): User {
    return new User({
      id: raw.id,
      email: new EmailAddress(raw.email),
      emailVerified: raw.emailVerified,
      passwordHash: raw.passwordHash,
      name: raw.name,
      phone: raw.phone ? new PhoneNumber(raw.phone) : null,
      avatarUrl: raw.avatarUrl,
      role: raw.role as UserRole,
      isActive: raw.isActive,
      lastLoginAt: raw.lastLoginAt,
      failedLoginCount: raw.failedLoginCount,
      lockedUntil: raw.lockedUntil,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
