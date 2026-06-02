import { Cart } from '../../../domain/commerce/Cart';

export interface ICartRepository {
  findById(id: string): Promise<Cart | null>;
  findByUserId(userId: string): Promise<Cart | null>;
  findBySessionToken(token: string): Promise<Cart | null>;
  save(cart: Cart): Promise<Cart>;
  delete(id: string): Promise<boolean>;
}
