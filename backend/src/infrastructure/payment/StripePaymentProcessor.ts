import { injectable } from 'tsyringe';
import { IPaymentProcessor, PaymentIntentResult, PaymentResult } from './IPaymentProcessor';
import { Money } from '../../domain/shared/value-objects/Money';
import { env } from '../../config/env';
import { logger } from '../../config/logger';
import Stripe from 'stripe';

@injectable()
export class StripePaymentProcessor implements IPaymentProcessor {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16' as any, // Standard stable Stripe API version
    });
  }

  public async createPaymentIntent(amount: Money, metadata?: Record<string, any>): Promise<PaymentIntentResult> {
    try {
      const intent = await this.stripe.paymentIntents.create({
        amount: amount.getAmount(), // paise/cents
        currency: amount.getCurrency().toLowerCase(),
        metadata,
        payment_method_types: ['card'],
      });

      return {
        clientSecret: intent.client_secret!,
        paymentIntentId: intent.id,
      };
    } catch (error: any) {
      logger.error('[StripePaymentProcessor] Failed to create payment intent:', error);
      throw new Error(`Stripe error: ${error.message}`);
    }
  }

  public async refund(paymentIntentId: string, amount?: Money): Promise<PaymentResult> {
    try {
      const refundParams: Stripe.RefundCreateParams = {
        payment_intent: paymentIntentId,
      };
      if (amount) {
        refundParams.amount = amount.getAmount();
      }

      const refund = await this.stripe.refunds.create(refundParams);

      return {
        success: refund.status === 'succeeded',
        transactionId: refund.id,
        metadata: { refundStatus: refund.status },
      };
    } catch (error: any) {
      logger.error('[StripePaymentProcessor] Failed to issue refund:', error);
      return {
        success: false,
        errorMessage: error.message,
      };
    }
  }
}
