import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../infrastructure/persistence/interfaces/IUserRepository';
import { UserProps, User } from '../../../domain/identity/User';
import { EmailAddress } from '../../../domain/shared/value-objects/EmailAddress';
import { PhoneNumber } from '../../../domain/shared/value-objects/PhoneNumber';
import { ConflictError } from '../../../domain/shared/errors/ConflictError';
import { hashPassword, generateRandomToken, hashToken } from '../../../utils/crypto';
import { prisma } from '../../../infrastructure/persistence/prisma/PrismaClient';
import { logger } from '../../../config/logger';

export interface RegisterUserDTO {
  email: string;
  password?: string;
  name: string;
  phone?: string;
}

@injectable()
export class RegisterUserHandler {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository
  ) {}

  public async execute(dto: RegisterUserDTO): Promise<{ id: string; email: string; name: string; role: string }> {
    const emailVO = new EmailAddress(dto.email);
    
    // Check email uniqueness
    const existing = await this.userRepository.findByEmail(emailVO);
    if (existing) {
      throw new ConflictError('Email address is already in use');
    }

    const phoneVO = dto.phone ? new PhoneNumber(dto.phone) : null;
    let passwordHash: string | null = null;
    if (dto.password) {
      passwordHash = await hashPassword(dto.password);
    }

    const user = new User({
      email: emailVO,
      passwordHash,
      name: dto.name,
      phone: phoneVO,
      role: 'CUSTOMER',
    });

    const savedUser = await this.userRepository.save(user);
    const userId = savedUser.getId()!;

    // Generate Verification Token
    const rawToken = generateRandomToken();
    const tokenHash = hashToken(rawToken);
    
    // Store Verification Token (Expires in 24 hours)
    await prisma.emailVerificationToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    // Enqueue verification email job (mocked for now, will implement full email worker in Phase 6)
    logger.info(`[Auth] Verification token created for user ${userId}. Raw token: ${rawToken}`);

    return {
      id: userId,
      email: savedUser.getEmail().getValue(),
      name: savedUser.getName(),
      role: savedUser.getRole(),
    };
  }
}
