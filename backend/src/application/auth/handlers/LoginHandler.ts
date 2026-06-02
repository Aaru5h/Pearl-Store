import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../infrastructure/persistence/interfaces/IUserRepository';
import { EmailAddress } from '../../../domain/shared/value-objects/EmailAddress';
import { ForbiddenError } from '../../../domain/shared/errors/ForbiddenError';
import { ValidationError } from '../../../domain/shared/errors/ValidationError';
import { generateAccessToken, generateRefreshToken, hashToken } from '../../../utils/crypto';
import { prisma } from '../../../infrastructure/persistence/prisma/PrismaClient';

export interface LoginDTO {
  email: string;
  password?: string;
  deviceFingerprint?: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatarUrl: string | null;
  };
}

@injectable()
export class LoginHandler {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository
  ) {}

  public async execute(dto: LoginDTO): Promise<LoginResult> {
    const emailVO = new EmailAddress(dto.email);

    const user = await this.userRepository.findByEmail(emailVO);
    if (!user) {
      throw new ForbiddenError('Invalid credentials');
    }

    if (!user.getIsActive()) {
      throw new ForbiddenError('Account is suspended');
    }

    if (user.isLocked()) {
      throw new ForbiddenError(`Account is temporarily locked. Please try again after ${user.getLockedUntil()?.toISOString()}`);
    }

    // Verify Password if provided (support passwordless logins later or enforce passwords here)
    if (!dto.password) {
      throw new ValidationError('Password is required');
    }

    const passwordMatches = await user.checkPassword(dto.password);
    
    // Save updated failedLoginCount/lockedUntil state
    await this.userRepository.save(user);

    if (!passwordMatches) {
      throw new ForbiddenError('Invalid credentials');
    }

    if (!user.isEmailVerified()) {
      throw new ForbiddenError('Email not verified. Please verify your email before logging in.');
    }

    const userId = user.getId()!;

    // Complete login transaction
    await prisma.user.update({
      where: { id: userId },
      data: {
        loginCount: { increment: 1 },
        lastLoginAt: new Date(),
      },
    });

    // Generate tokens
    const accessToken = generateAccessToken(userId, user.getEmail().getValue(), user.getRole());
    const rawRefreshToken = generateRefreshToken();
    const tokenHash = hashToken(rawRefreshToken);

    // Save refresh token in database (Expires in 7 days)
    await prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        deviceFingerprint: dto.deviceFingerprint || null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      user: {
        id: userId,
        email: user.getEmail().getValue(),
        name: user.getName(),
        role: user.getRole(),
        avatarUrl: user.getAvatarUrl(),
      },
    };
  }
}
