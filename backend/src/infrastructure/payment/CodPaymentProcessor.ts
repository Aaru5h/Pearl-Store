import { injectable } from 'tsyringe';
import { IPaymentProcessor, PaymentIntentResult, PaymentResult } from './IPaymentProcessor';
import { Money } from '../../domain/shared/value-objects/Money';
import { logger } from '../../config/logger';
import { randomBytes } from 'crypto';

@injectable()
export class CodPaymentProcessor implements IPaymentProcessor {
  public async createPaymentIntent(amount: Money, metadata?: Record<string, any>): Promise<PaymentIntentResult> {
    const mockId = `cod_${randomBytes(12).toString('hex')}`;
    logger.info(`[CodPaymentProcessor] Created COD payment intent for amount ${amount.getFormattedAmount()} ${amount.getCurrency()}`);
    return {
      clientSecret: 'cod_secret_not_required',
      paymentIntentId: mockId,
    };
  }

  public async refund(paymentIntentId: string, amount?: Money): Promise<PaymentResult> {
    logger.info(`[CodPaymentProcessor] Refunding COD payment intent ${paymentIntentId}`);
    return {
      success: true,
      transactionId: `cod_refund_${randomBytes(8).toString('hex')}`,
      metadata: { note: 'Cash refund to customer required' },
    };
  }
}
