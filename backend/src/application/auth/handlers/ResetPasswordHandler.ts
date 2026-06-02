import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../infrastructure/persistence/interfaces/IUserRepository';
import { ValidationError } from '../../../domain/shared/errors/ValidationError';
import { NotFoundError } from '../../../domain/shared/errors/NotFoundError';
import { hashToken, hashPassword } from '../../../utils/crypto';
import { prisma } from '../../../infrastructure/persistence/prisma/PrismaClient';

export interface ResetPasswordDTO {
  token: string;
  newPassword?: string;
}

@injectable()
export class ResetPasswordHandler {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository
  ) {}

  public async execute(dto: ResetPasswordDTO): Promise<{ message: string }> {
    if (!dto.newPassword) {
      throw new ValidationError('New password is required');
    }

    const tokenHash = hashToken(dto.token);

    // Find the reset token in the database
    const dbToken = await prisma.passwordResetToken.findFirst({
      where: { tokenHash },
    });

    if (!dbToken) {
      throw new NotFoundError('Invalid password reset token');
    }

    if (dbToken.usedAt) {
      throw new ValidationError('Password reset token has already been used');
    }

    if (dbToken.expiresAt < new Date()) {
      throw new ValidationError('Password reset token has expired');
    }

    const user = await this.userRepository.findById(dbToken.userId);
    if (!user) {
      throw new NotFoundError('User associated with token not found');
    }

    // Hash the new password and update user aggregate
    const newPasswordHash = await hashPassword(dto.newPassword);
    user.updatePasswordHash(newPasswordHash);

    // Save updated user (resets failed logins and locks too)
    await this.userRepository.save(user);

    // Mark token as used
    await prisma.passwordResetToken.update({
      where: { id: dbToken.id },
      data: { usedAt: new Date() },
    });

    // Revoke all active sessions / refresh tokens for the user
    await prisma.refreshToken.updateMany({
      where: { userId: dbToken.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return { message: 'Password reset successfully' };
  }
}
