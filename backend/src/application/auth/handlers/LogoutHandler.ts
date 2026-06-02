import { injectable } from 'tsyringe';
import { hashToken } from '../../../utils/crypto';
import { prisma } from '../../../infrastructure/persistence/prisma/PrismaClient';
import { NotFoundError } from '../../../domain/shared/errors/NotFoundError';

export interface LogoutDTO {
  refreshToken: string;
}

@injectable()
export class LogoutHandler {
  public async execute(dto: LogoutDTO): Promise<{ message: string }> {
    const tokenHash = hashToken(dto.refreshToken);

    const dbToken = await prisma.refreshToken.findFirst({
      where: { tokenHash },
    });

    if (!dbToken) {
      throw new NotFoundError('Session token not found');
    }

    // Mark current session as revoked
    await prisma.refreshToken.update({
      where: { id: dbToken.id },
      data: { revokedAt: new Date() },
    });

    return { message: 'Logged out successfully' };
  }
}
