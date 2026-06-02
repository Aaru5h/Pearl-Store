import { IShippingCalculator } from './IShippingCalculator';
import { Money } from '../../domain/shared/value-objects/Money';
import { Address } from '../../domain/shared/value-objects/Address';
import { inject, singleton } from 'tsyringe';

@singleton()
export class FreeAboveThresholdCalculator implements IShippingCalculator {
  private readonly thresholdAmount = 50000; // 500.00 INR (50000 paise)

  constructor(
    @inject('BaseShippingCalculator') private baseCalculator: IShippingCalculator
  ) {}

  public async calculate(address: Address, totalWeightGrams: number, subtotal: Money): Promise<Money> {
    if (subtotal.getAmount() >= this.thresholdAmount) {
      return Money.zero(subtotal.getCurrency()); // Free shipping
    }
    return this.baseCalculator.calculate(address, totalWeightGrams, subtotal);
  }
}
