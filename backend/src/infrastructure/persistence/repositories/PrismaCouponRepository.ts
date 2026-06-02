import { injectable } from 'tsyringe';
import { ICouponRepository } from '../interfaces/ICouponRepository';
import { Coupon, CouponType, CouponApplicability } from '../../../domain/commerce/Coupon';
import { prisma } from '../prisma/PrismaClient';

@injectable()
export class PrismaCouponRepository implements ICouponRepository {
  public async findById(id: string): Promise<Coupon | null> {
    const raw = await prisma.coupon.findUnique({
      where: { id },
    });
    if (!raw) return null;
    return this.toDomain(raw);
  }

  public async findByCode(code: string): Promise<Coupon | null> {
    const raw = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });
    if (!raw) return null;
    return this.toDomain(raw);
  }

  public async save(coupon: Coupon): Promise<Coupon> {
    const id = coupon.getId();
    const data = {
      code: coupon.getCode(),
      description: coupon.getDescription(),
      type: coupon.getType() as any,
      value: coupon.getValue(),
      minOrderAmount: coupon.getMinOrderAmount(),
      maxDiscountCap: coupon.getMaxDiscountCap(),
      maxUsesTotal: coupon.getMaxUsesTotal(),
      maxUsesPerUser: coupon.getMaxUsesPerUser(),
      usesCount: coupon.getUsesCount(),
      applicableTo: coupon.getApplicableTo() as any,
      applicableIds: coupon.getApplicableIds(),
      validFrom: coupon.getValidFrom(),
      validUntil: coupon.getValidUntil(),
      isActive: coupon.getIsActive(),
      createdBy: coupon.getCreatedBy(),
      updatedAt: new Date(),
    };

    let savedRaw;
    if (id) {
      savedRaw = await prisma.coupon.update({
        where: { id },
        data,
      });
    } else {
      savedRaw = await prisma.coupon.create({
        data: {
          ...data,
          createdAt: coupon.getCreatedAt(),
        },
      });
    }

    return this.toDomain(savedRaw);
  }

  public async delete(id: string): Promise<boolean> {
    try {
      await prisma.coupon.update({
        where: { id },
        data: { isActive: false }, // Soft deactivation for checkout histories
      });
      return true;
    } catch {
      return false;
    }
  }

  private toDomain(raw: any): Coupon {
    return new Coupon({
      id: raw.id,
      code: raw.code,
      description: raw.description,
      type: raw.type as CouponType,
      value: raw.value,
      minOrderAmount: raw.minOrderAmount,
      maxDiscountCap: raw.maxDiscountCap,
      maxUsesTotal: raw.maxUsesTotal,
      maxUsesPerUser: raw.maxUsesPerUser,
      usesCount: raw.usesCount,
      applicableTo: raw.applicableTo as CouponApplicability,
      applicableIds: raw.applicableIds,
      validFrom: raw.validFrom,
      validUntil: raw.validUntil,
      isActive: raw.isActive,
      createdBy: raw.createdBy,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
