import { Request, Response } from 'express';
import { container } from '../../../container';
import { IUserRepository } from '../../../infrastructure/persistence/interfaces/IUserRepository';
import { EmailAddress } from '../../../domain/shared/value-objects/EmailAddress';
import { PhoneNumber } from '../../../domain/shared/value-objects/PhoneNumber';
import { NotFoundError } from '../../../domain/shared/errors/NotFoundError';
import { ValidationError } from '../../../domain/shared/errors/ValidationError';
import { ForbiddenError } from '../../../domain/shared/errors/ForbiddenError';
import { ConflictError } from '../../../domain/shared/errors/ConflictError';
import { hashPassword, generateRandomToken, hashToken } from '../../../utils/crypto';
import { ApiResponse } from '../../../utils/ApiResponse';
import { prisma } from '../../../infrastructure/persistence/prisma/PrismaClient';
import { logger } from '../../../config/logger';

export class UserController {
  private getUserRepository(): IUserRepository {
    return container.resolve<IUserRepository>('IUserRepository');
  }

  public getMe = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      include: {
        addresses: {
          where: { deletedAt: null },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.status(200).json(ApiResponse.success({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      role: user.role,
      emailVerified: user.emailVerified,
      addresses: user.addresses,
      createdAt: user.createdAt,
    }, 'User profile retrieved successfully'));
  };

  public updateMe = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const repo = this.getUserRepository();
    
    const user = await repo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const { name, phone, avatarUrl } = req.body;
    
    const phoneVO = phone ? new PhoneNumber(phone) : undefined;
    user.updateProfile(name, phoneVO, avatarUrl);

    await repo.save(user);

    res.status(200).json(ApiResponse.success({
      id: user.getId(),
      email: user.getEmail().getValue(),
      name: user.getName(),
      phone: user.getPhone()?.getValue() || null,
      avatarUrl: user.getAvatarUrl(),
    }, 'Profile updated successfully'));
  };

  public updateEmail = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const { newEmail, password } = req.body;
    const repo = this.getUserRepository();

    const user = await repo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify Password
    const passwordMatches = await user.checkPassword(password);
    if (!passwordMatches) {
      throw new ForbiddenError('Invalid credentials');
    }

    const newEmailVO = new EmailAddress(newEmail);
    
    // Check if new email is taken
    const existing = await repo.findByEmail(newEmailVO);
    if (existing) {
      throw new ConflictError('Email is already taken');
    }

    // Create Email Verification Token linked to the new email
    const rawToken = generateRandomToken();
    const tokenHash = hashToken(rawToken);

    await prisma.emailVerificationToken.create({
      data: {
        userId,
        tokenHash,
        newEmail: newEmailVO.getValue(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    logger.info(`[User] Verification email change token created for user ${userId}. New Email: ${newEmail}. Raw token: ${rawToken}`);

    res.status(200).json(ApiResponse.success(null, 'Verification email sent to your new email address. Please click the link to confirm.'));
  };

  public updatePassword = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;
    const repo = this.getUserRepository();

    const user = await repo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify Password
    const passwordMatches = await user.checkPassword(currentPassword);
    if (!passwordMatches) {
      throw new ForbiddenError('Invalid current password');
    }

    const newPasswordHash = await hashPassword(newPassword);
    user.updatePasswordHash(newPasswordHash);
    await repo.save(user);

    // Revoke all other refresh tokens except the current (forces login elsewhere)
    await prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });

    res.status(200).json(ApiResponse.success(null, 'Password updated successfully. Other active sessions revoked.'));
  };

  public deleteMe = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const { password } = req.body;
    const repo = this.getUserRepository();

    const user = await repo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify Password
    const passwordMatches = await user.checkPassword(password);
    if (!passwordMatches) {
      throw new ForbiddenError('Invalid credentials');
    }

    // Soft delete
    user.suspend();
    await repo.save(user);
    await repo.delete(userId);

    // Revoke all refresh tokens
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    res.status(200).json(ApiResponse.success(null, 'Account deleted successfully'));
  };

  // Addresses Book
  
  public getAddresses = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;

    const addresses = await prisma.address.findMany({
      where: { userId, deletedAt: null },
    });

    res.status(200).json(ApiResponse.success(addresses, 'Addresses retrieved successfully'));
  };

  public createAddress = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const addressData = req.body;

    // Handle isDefault logic
    if (addressData.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        label: addressData.label || null,
        recipientName: addressData.recipientName,
        recipientPhone: addressData.recipientPhone,
        line1: addressData.line1,
        line2: addressData.line2 || null,
        city: addressData.city,
        state: addressData.state,
        zip: addressData.zip,
        country: addressData.country || 'IN',
        isDefault: addressData.isDefault || false,
        lat: addressData.lat || null,
        lng: addressData.lng || null,
      },
    });

    res.status(201).json(ApiResponse.success(address, 'Address created successfully'));
  };

  public updateAddress = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const addressId = req.params.id;
    const addressData = req.body;

    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId, deletedAt: null },
    });

    if (!existingAddress || existingAddress.userId !== userId) {
      throw new NotFoundError('Address not found');
    }

    // Handle isDefault logic
    if (addressData.isDefault && !existingAddress.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        label: addressData.label !== undefined ? addressData.label : existingAddress.label,
        recipientName: addressData.recipientName || existingAddress.recipientName,
        recipientPhone: addressData.recipientPhone || existingAddress.recipientPhone,
        line1: addressData.line1 || existingAddress.line1,
        line2: addressData.line2 !== undefined ? addressData.line2 : existingAddress.line2,
        city: addressData.city || existingAddress.city,
        state: addressData.state || existingAddress.state,
        zip: addressData.zip || existingAddress.zip,
        country: addressData.country || existingAddress.country,
        isDefault: addressData.isDefault !== undefined ? addressData.isDefault : existingAddress.isDefault,
        lat: addressData.lat !== undefined ? addressData.lat : existingAddress.lat,
        lng: addressData.lng !== undefined ? addressData.lng : existingAddress.lng,
      },
    });

    res.status(200).json(ApiResponse.success(updatedAddress, 'Address updated successfully'));
  };

  public deleteAddress = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const addressId = req.params.id;

    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId, deletedAt: null },
    });

    if (!existingAddress || existingAddress.userId !== userId) {
      throw new NotFoundError('Address not found');
    }

    await prisma.address.update({
      where: { id: addressId },
      data: { deletedAt: new Date() },
    });

    res.status(200).json(ApiResponse.success(null, 'Address deleted successfully'));
  };

  public setDefaultAddress = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const addressId = req.params.id;

    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId, deletedAt: null },
    });

    if (!existingAddress || existingAddress.userId !== userId) {
      throw new NotFoundError('Address not found');
    }

    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });

    res.status(200).json(ApiResponse.success(null, 'Address set as default successfully'));
  };
}
