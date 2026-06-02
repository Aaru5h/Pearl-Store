import 'reflect-metadata';
import { container } from 'tsyringe';
import { InMemoryEventBus } from './infrastructure/events/InMemoryEventBus';
import { RedisCacheService } from './infrastructure/cache/RedisCacheService';
import { PrismaUserRepository } from './infrastructure/persistence/repositories/PrismaUserRepository';
import { PrismaCategoryRepository } from './infrastructure/persistence/repositories/PrismaCategoryRepository';
import { PrismaProductRepository } from './infrastructure/persistence/repositories/PrismaProductRepository';
import { PrismaInventoryRepository } from './infrastructure/persistence/repositories/PrismaInventoryRepository';
import { PrismaReviewRepository } from './infrastructure/persistence/repositories/PrismaReviewRepository';
import { PrismaCartRepository } from './infrastructure/persistence/repositories/PrismaCartRepository';
import { PrismaOrderRepository } from './infrastructure/persistence/repositories/PrismaOrderRepository';
import { PrismaCouponRepository } from './infrastructure/persistence/repositories/PrismaCouponRepository';
import { WeightBasedCalculator } from './infrastructure/shipping/WeightBasedCalculator';
import { FreeAboveThresholdCalculator } from './infrastructure/shipping/FreeAboveThresholdCalculator';
import { StripePaymentProcessor } from './infrastructure/payment/StripePaymentProcessor';
import { CodPaymentProcessor } from './infrastructure/payment/CodPaymentProcessor';

// Register EventBus
container.registerSingleton('EventBus', InMemoryEventBus);

// Register Payment Processors
container.registerSingleton('StripePaymentProcessor', StripePaymentProcessor);
container.registerSingleton('CodPaymentProcessor', CodPaymentProcessor);

// Register Shipping Calculators
container.registerSingleton('BaseShippingCalculator', WeightBasedCalculator);
container.registerSingleton('IShippingCalculator', FreeAboveThresholdCalculator);

// Register Repositories
container.registerSingleton('IUserRepository', PrismaUserRepository);
container.registerSingleton('ICategoryRepository', PrismaCategoryRepository);
container.registerSingleton('IProductRepository', PrismaProductRepository);
container.registerSingleton('IInventoryRepository', PrismaInventoryRepository);
container.registerSingleton('IReviewRepository', PrismaReviewRepository);
container.registerSingleton('ICartRepository', PrismaCartRepository);
container.registerSingleton('IOrderRepository', PrismaOrderRepository);
container.registerSingleton('ICouponRepository', PrismaCouponRepository);

// Register Cache Service
container.registerSingleton(RedisCacheService);

export { container };
