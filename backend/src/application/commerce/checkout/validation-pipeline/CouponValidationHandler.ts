import { injectable } from 'tsyringe';
import { CheckoutValidationHandler } from './CheckoutValidationHandler';
import { CheckoutContext } from './CheckoutContext';
import { ValidationError } from '../../../../domain/shared/errors/ValidationError';
import { prisma } from '../../../../infrastructure/persistence/prisma/PrismaClient';

@injectable()
export class CouponValidationHandler extends CheckoutValidationHandler {
  protected async validate(context: CheckoutContext): Promise<void> {
    const { coupon, cart, userId } = context;

    if (!coupon) return; // No coupon applied, proceed

    const subtotal = cart.getSubtotal();

    // Check validity constraints in Coupon model (date, active, min order limit)
    if (!coupon.isApplicable(subtotal)) {
      throw new ValidationError(`Coupon code ${coupon.getCode()} is not valid or does not meet the minimum requirements.`);
    }

    // Check per-user limit against database coupon usages
    const usageCount = await prisma.couponUsage.count({
      where: {
        couponId: coupon.getId(),
        userId,
      },
    });

    if (usageCount >= coupon.getMaxUsesPerUser()) {
      throw new ValidationError(`You have already reached the maximum usage limit of ${coupon.getMaxUsesPerUser()} times for coupon ${coupon.getCode()}.`);
    }
  }
}
