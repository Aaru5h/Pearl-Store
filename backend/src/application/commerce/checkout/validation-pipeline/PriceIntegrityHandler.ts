import { injectable, inject } from 'tsyringe';
import { CheckoutValidationHandler } from './CheckoutValidationHandler';
import { CheckoutContext } from './CheckoutContext';
import { IProductRepository } from '../../../../infrastructure/persistence/interfaces/IProductRepository';
import { ValidationError } from '../../../../domain/shared/errors/ValidationError';

@injectable()
export class PriceIntegrityHandler extends CheckoutValidationHandler {
  constructor(
    @inject('IProductRepository') private productRepository: IProductRepository
  ) {
    super();
  }

  protected async validate(context: CheckoutContext): Promise<void> {
    const items = context.cart.getItems();

    for (const item of items) {
      const product = await this.productRepository.findById(item.getProductId());
      
      if (!product) {
        throw new ValidationError(`Product ${item.getProductId()} no longer exists`);
      }

      if (!product.getIsActive()) {
        throw new ValidationError(`Product ${product.getName()} is no longer active`);
      }

      const livePrice = product.getPrice();
      const snapshotPrice = item.getPriceSnapshot();

      if (!livePrice.equals(snapshotPrice)) {
        throw new ValidationError(
          `Price integrity violation for ${product.getName()}. Cart price: ${snapshotPrice.getFormattedAmount()} ${snapshotPrice.getCurrency()}, Live price: ${livePrice.getFormattedAmount()} ${livePrice.getCurrency()}`
        );
      }
    }
  }
}
