import { injectable } from 'tsyringe';
import { IInventoryRepository, InventoryTransactionDTO } from '../interfaces/IInventoryRepository';
import { InventoryEntry } from '../../../domain/inventory/InventoryEntry';
import { prisma } from '../prisma/PrismaClient';

@injectable()
export class PrismaInventoryRepository implements IInventoryRepository {
  public async findByProductId(productId: string): Promise<InventoryEntry | null> {
    const raw = await prisma.inventory.findUnique({
      where: { productId },
    });
    if (!raw) return null;
    return this.toDomain(raw);
  }

  public async save(entry: InventoryEntry): Promise<InventoryEntry> {
    const data = {
      productId: entry.getProductId(),
      quantityOnHand: entry.getQuantityOnHand(),
      quantityReserved: entry.getQuantityReserved(),
      lowStockThreshold: entry.getLowStockThreshold(),
      reorderPoint: entry.getReorderPoint(),
      maxCapacity: entry.getMaxCapacity(),
      allowBackorder: entry.getAllowBackorder(),
      backorderLimit: entry.getBackorderLimit(),
      lastCountedAt: entry.getLastCountedAt(),
    };

    const savedRaw = await prisma.inventory.upsert({
      where: { productId: entry.getProductId() },
      create: data,
      update: data,
    });

    return this.toDomain(savedRaw);
  }

  public async recordTransaction(dto: InventoryTransactionDTO): Promise<void> {
    await prisma.inventoryTransaction.create({
      data: {
        productId: dto.productId,
        type: dto.type,
        quantityChange: dto.quantityChange,
        quantityBefore: dto.quantityBefore,
        quantityAfter: dto.quantityAfter,
        referenceType: dto.referenceType || null,
        referenceId: dto.referenceId || null,
        note: dto.note || null,
        performedBy: dto.performedBy || null,
      },
    });
  }

  public async findTransactionHistory(
    productId: string,
    page: number,
    limit: number
  ): Promise<{ items: any[]; total: number }> {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.inventoryTransaction.findMany({
        where: { productId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.inventoryTransaction.count({
        where: { productId },
      }),
    ]);

    return { items, total };
  }

  private toDomain(raw: any): InventoryEntry {
    return new InventoryEntry({
      id: raw.id,
      productId: raw.productId,
      quantityOnHand: raw.quantityOnHand,
      quantityReserved: raw.quantityReserved,
      lowStockThreshold: raw.lowStockThreshold,
      reorderPoint: raw.reorderPoint,
      maxCapacity: raw.maxCapacity,
      allowBackorder: raw.allowBackorder,
      backorderLimit: raw.backorderLimit,
      lastCountedAt: raw.lastCountedAt,
      updatedAt: raw.updatedAt,
    });
  }
}
