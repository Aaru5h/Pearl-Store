import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../infrastructure/persistence/interfaces/IUserRepository';
import { EmailAddress } from '../../../domain/shared/value-objects/EmailAddress';
import { generateRandomToken, hashToken } from '../../../utils/crypto';
import { prisma } from '../../../infrastructure/persistence/prisma/PrismaClient';
import { logger } from '../../../config/logger';

export interface ForgotPasswordDTO {
  email: string;
  ipAddress?: string;
}

@injectable()
export class ForgotPasswordHandler {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository
  ) {}

  public async execute(dto: ForgotPasswordDTO): Promise<{ message: string }> {
    // Avoid leaking information by returning a generic response in all cases
    const genericResponse = { message: 'If that email exists, a reset link has been sent' };

    try {
      const emailVO = new EmailAddress(dto.email);
      const user = await this.userRepository.findByEmail(emailVO);
      
      if (!user || !user.getIsActive()) {
        return genericResponse;
      }

      const userId = user.getId()!;

      // Generate Reset Token (15 minute TTL)
      const rawToken = generateRandomToken();
      const tokenHash = hashToken(rawToken);

      await prisma.passwordResetToken.create({
        data: {
          userId,
          tokenHash,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
          ipAddress: dto.ipAddress || null,
        },
      });

      // Enqueue password reset email job (will implement SendGrid worker in Phase 6)
      logger.info(`[Auth] Password reset token created for user ${userId}. Raw token: ${rawToken}`);

      return genericResponse;
    } catch (error) {
      // Return same response even if parsing fails or input is invalid
      logger.warn('[Auth] Forgot password process failure:', error);
      return genericResponse;
    }
  }
}
