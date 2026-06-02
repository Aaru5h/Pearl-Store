import { IShippingCalculator } from './IShippingCalculator';
import { Money } from '../../domain/shared/value-objects/Money';
import { Address } from '../../domain/shared/value-objects/Address';
import { singleton } from 'tsyringe';

@singleton()
export class WeightBasedCalculator implements IShippingCalculator {
  public async calculate(address: Address, totalWeightGrams: number, subtotal: Money): Promise<Money> {
    const currency = subtotal.getCurrency();
    
    // Base rate: 40 INR for first 1kg (1000g)
    let charge = 4000;

    if (totalWeightGrams > 1000) {
      const extraWeight = totalWeightGrams - 1000;
      // 10 INR (1000 paise) extra for every 500g
      const unitsOf500g = Math.ceil(extraWeight / 500);
      charge += unitsOf500g * 1000;
    }

    return new Money(charge, currency);
  }
}
