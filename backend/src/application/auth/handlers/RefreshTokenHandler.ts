import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../infrastructure/persistence/interfaces/IUserRepository';
import { ForbiddenError } from '../../../domain/shared/errors/ForbiddenError';
import { ValidationError } from '../../../domain/shared/errors/ValidationError';
import { hashToken, generateAccessToken, generateRefreshToken } from '../../../utils/crypto';
import { prisma } from '../../../infrastructure/persistence/prisma/PrismaClient';

export interface RefreshTokenDTO {
  refreshToken: string;
  deviceFingerprint?: string;
}

export interface RefreshTokenResult {
  accessToken: string;
  refreshToken: string; // Rotated refresh token
}

@injectable()
export class RefreshTokenHandler {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository
  ) {}

  public async execute(dto: RefreshTokenDTO): Promise<RefreshTokenResult> {
    const tokenHash = hashToken(dto.refreshToken);

    // Retrieve active token
    const dbToken = await prisma.refreshToken.findFirst({
      where: { tokenHash },
    });

    if (!dbToken) {
      throw new ForbiddenError('Invalid refresh token');
    }

    if (dbToken.revokedAt) {
      // Security breach warning: Someone is reusing a revoked token
      // Best security practice: Revoke all tokens for this user
      await prisma.refreshToken.updateMany({
        where: { userId: dbToken.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw new ForbiddenError('Refresh token has been revoked. All active sessions terminated for security.');
    }

    if (dbToken.expiresAt < new Date()) {
      throw new ForbiddenError('Refresh token has expired');
    }

    if (dbToken.deviceFingerprint && dto.deviceFingerprint && dbToken.deviceFingerprint !== dto.deviceFingerprint) {
      throw new ForbiddenError('Device fingerprint mismatch');
    }

    const user = await this.userRepository.findById(dbToken.userId);
    if (!user || !user.getIsActive()) {
      throw new ForbiddenError('User is suspended or does not exist');
    }

    const userId = user.getId()!;

    // Rotate refresh token: Revoke current
    await prisma.refreshToken.update({
      where: { id: dbToken.id },
      data: { revokedAt: new Date() },
    });

    // Create new refresh token
    const newRawRefreshToken = generateRefreshToken();
    const newTokenHash = hashToken(newRawRefreshToken);

    await prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: newTokenHash,
        deviceFingerprint: dto.deviceFingerprint || dbToken.deviceFingerprint || null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Generate new access token
    const accessToken = generateAccessToken(userId, user.getEmail().getValue(), user.getRole());

    return {
      accessToken,
      refreshToken: newRawRefreshToken,
    };
  }
}
