import { injectable } from 'tsyringe';
import { ICategoryRepository } from '../interfaces/ICategoryRepository';
import { Category } from '../../../domain/catalogue/Category';
import { prisma } from '../prisma/PrismaClient';

@injectable()
export class PrismaCategoryRepository implements ICategoryRepository {
  public async findById(id: string): Promise<Category | null> {
    const raw = await prisma.category.findUnique({
      where: { id, deletedAt: null },
    });
    if (!raw) return null;
    return this.toDomain(raw);
  }

  public async findBySlug(slug: string): Promise<Category | null> {
    const raw = await prisma.category.findUnique({
      where: { slug, deletedAt: null },
    });
    if (!raw) return null;
    return this.toDomain(raw);
  }

  public async findAll(): Promise<Category[]> {
    const list = await prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: { displayOrder: 'asc' },
    });
    return list.map((item) => this.toDomain(item));
  }

  public async save(category: Category): Promise<Category> {
    const id = category.getId();
    const data = {
      name: category.getName(),
      slug: category.getSlug(),
      description: category.getDescription(),
      imageUrl: category.getImageUrl(),
      parentId: category.getParentId(),
      displayOrder: category.getDisplayOrder(),
      isActive: category.getIsActive(),
      metaTitle: category.getMetaTitle(),
      metaDescription: category.getMetaDescription(),
      updatedAt: new Date(),
    };

    let savedRaw;
    if (id) {
      savedRaw = await prisma.category.update({
        where: { id },
        data,
      });
    } else {
      savedRaw = await prisma.category.create({
        data: {
          ...data,
          createdAt: category.getCreatedAt(),
        },
      });
    }

    return this.toDomain(savedRaw);
  }

  public async delete(id: string): Promise<boolean> {
    try {
      await prisma.category.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return true;
    } catch {
      return false;
    }
  }

  private toDomain(raw: any): Category {
    return new Category({
      id: raw.id,
      name: raw.name,
      slug: raw.slug,
      description: raw.description,
      imageUrl: raw.imageUrl,
      parentId: raw.parentId,
      displayOrder: raw.displayOrder,
      isActive: raw.isActive,
      metaTitle: raw.metaTitle,
      metaDescription: raw.metaDescription,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
