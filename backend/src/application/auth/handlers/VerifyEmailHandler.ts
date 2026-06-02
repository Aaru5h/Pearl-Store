import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../infrastructure/persistence/interfaces/IUserRepository';
import { ValidationError } from '../../../domain/shared/errors/ValidationError';
import { NotFoundError } from '../../../domain/shared/errors/NotFoundError';
import { EmailAddress } from '../../../domain/shared/value-objects/EmailAddress';
import { hashToken } from '../../../utils/crypto';
import { prisma } from '../../../infrastructure/persistence/prisma/PrismaClient';

export interface VerifyEmailDTO {
  token: string;
}

@injectable()
export class VerifyEmailHandler {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository
  ) {}

  public async execute(dto: VerifyEmailDTO): Promise<{ message: string }> {
    const tokenHash = hashToken(dto.token);

    // Find the verification token in the DB
    const dbToken = await prisma.emailVerificationToken.findFirst({
      where: { tokenHash },
    });

    if (!dbToken) {
      throw new NotFoundError('Invalid email verification token');
    }

    if (dbToken.usedAt) {
      throw new ValidationError('Email verification token has already been used');
    }

    if (dbToken.expiresAt < new Date()) {
      throw new ValidationError('Email verification token has expired');
    }

    const user = await this.userRepository.findById(dbToken.userId);
    if (!user) {
      throw new NotFoundError('User associated with token not found');
    }

    // If this token was for an email change request, update the email first
    if (dbToken.newEmail) {
      user.updateEmail(new EmailAddress(dbToken.newEmail));
    }

    // Verify email on the user domain entity
    user.verifyEmail();

    // Save updated user
    await this.userRepository.save(user);

    // Mark token as used
    await prisma.emailVerificationToken.update({
      where: { id: dbToken.id },
      data: { usedAt: new Date() },
    });

    return { message: 'Email verified successfully' };
  }
}
