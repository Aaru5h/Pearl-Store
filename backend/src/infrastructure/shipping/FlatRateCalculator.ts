import { IShippingCalculator } from './IShippingCalculator';
import { Money } from '../../domain/shared/value-objects/Money';
import { Address } from '../../domain/shared/value-objects/Address';
import { singleton } from 'tsyringe';

@singleton()
export class FlatRateCalculator implements IShippingCalculator {
  // Statically returns flat rate of 50 INR (5000 paise)
  public async calculate(address: Address, totalWeightGrams: number, subtotal: Money): Promise<Money> {
    return new Money(5000, subtotal.getCurrency());
  }
}
