import { Coupon } from '../../../domain/commerce/Coupon';

export interface ICouponRepository {
  findById(id: string): Promise<Coupon | null>;
  findByCode(code: string): Promise<Coupon | null>;
  save(coupon: Coupon): Promise<Coupon>;
  delete(id: string): Promise<boolean>;
}
