import { injectable, inject } from 'tsyringe';
import { CheckoutValidationHandler } from './CheckoutValidationHandler';
import { CheckoutContext } from './CheckoutContext';
import { IInventoryRepository } from '../../../../infrastructure/persistence/interfaces/IInventoryRepository';
import { InsufficientStockError } from '../../../../domain/shared/errors/InsufficientStockError';

@injectable()
export class StockValidationHandler extends CheckoutValidationHandler {
  constructor(
    @inject('IInventoryRepository') private inventoryRepository: IInventoryRepository
  ) {
    super();
  }

  protected async validate(context: CheckoutContext): Promise<void> {
    const items = context.cart.getItems();

    for (const item of items) {
      const inventory = await this.inventoryRepository.findByProductId(item.getProductId());
      if (!inventory) {
        throw new InsufficientStockError(item.getProductId(), item.getQuantity(), 0, `No stock entry found for product ${item.getProductId()}`);
      }

      const available = inventory.getQuantityAvailable();
      if (item.getQuantity() > available) {
        if (!inventory.getAllowBackorder()) {
          throw new InsufficientStockError(item.getProductId(), item.getQuantity(), available);
        }

        const maxAllowed = available + inventory.getBackorderLimit();
        if (item.getQuantity() > maxAllowed) {
          throw new InsufficientStockError(
            item.getProductId(),
            item.getQuantity(),
            available,
            `Insufficient stock including backorder limit. Requested: ${item.getQuantity()}, Available: ${available}, Backorder limit: ${inventory.getBackorderLimit()}`
          );
        }
      }
    }
  }
}
