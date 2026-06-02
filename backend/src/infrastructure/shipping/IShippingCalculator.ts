import { Money } from '../../domain/shared/value-objects/Money';
import { Address } from '../../domain/shared/value-objects/Address';

export interface IShippingCalculator {
  calculate(address: Address, totalWeightGrams: number, subtotal: Money): Promise<Money>;
}
