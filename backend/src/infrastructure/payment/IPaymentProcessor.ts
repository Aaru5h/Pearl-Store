import { Money } from '../../domain/shared/value-objects/Money';

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface PaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
}

export interface IPaymentProcessor {
  createPaymentIntent(amount: Money, metadata?: Record<string, any>): Promise<PaymentIntentResult>;
  refund(paymentIntentId: string, amount?: Money): Promise<PaymentResult>;
}
