import { injectable } from 'tsyringe';
import { CheckoutValidationHandler } from './CheckoutValidationHandler';
import { CheckoutContext } from './CheckoutContext';
import { ValidationError } from '../../../../domain/shared/errors/ValidationError';
import { prisma } from '../../../../infrastructure/persistence/prisma/PrismaClient';

@injectable()
export class FraudCheckHandler extends CheckoutValidationHandler {
  protected async validate(context: CheckoutContext): Promise<void> {
    const total = context.cart.getTotal();

    // Enforce maximum single order transaction limit of 5,00,000 INR (50,000,000 paise)
    const maxLimit = 50000000;
    if (total.getAmount() > maxLimit) {
      throw new ValidationError(`Order total exceeds maximum transaction limit of 5,00,000 INR.`);
    }

    // Check user purchase velocity: Max 10 orders within 1 hour per user to prevent card testing/spam checkouts
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const orderCountLastHour = await prisma.order.count({
      where: {
        userId: context.userId,
        createdAt: { gte: oneHourAgo },
      },
    });

    if (orderCountLastHour >= 10) {
      throw new ValidationError('Suspicious purchase activity detected. Order request blocked.');
    }
  }
}
