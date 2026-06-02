import { Request, Response } from 'express';
import { container } from '../../../container';
import { ICategoryRepository } from '../../../infrastructure/persistence/interfaces/ICategoryRepository';
import { RedisCacheService } from '../../../infrastructure/cache/RedisCacheService';
import { NotFoundError } from '../../../domain/shared/errors/NotFoundError';
import { ApiResponse } from '../../../utils/ApiResponse';
import { prisma } from '../../../infrastructure/persistence/prisma/PrismaClient';

export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  displayOrder: number;
  parentId: string | null;
  children: CategoryNode[];
}

export class CategoryController {
  private getCategoryRepository(): ICategoryRepository {
    return container.resolve<ICategoryRepository>('ICategoryRepository');
  }

  private getCacheService(): RedisCacheService {
    return container.resolve(RedisCacheService);
  }

  public getCategoriesTree = async (req: Request, res: Response): Promise<void> => {
    const cacheService = this.getCacheService();
    const cacheKey = 'cache:categories:tree';

    const cached = await cacheService.get<CategoryNode[]>(cacheKey);
    if (cached) {
      res.status(200).json(ApiResponse.success(cached, 'Category tree retrieved from cache'));
      return;
    }

    const repo = this.getCategoryRepository();
    const allCategories = await repo.findAll();

    // Build tree representation in memory
    const tree = this.buildTree(allCategories);

    await cacheService.set(cacheKey, tree, 1800); // 30 min cache

    res.status(200).json(ApiResponse.success(tree, 'Category tree retrieved successfully'));
  };

  public getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
    const slug = req.params.slug;
    const repo = this.getCategoryRepository();

    const category = await repo.findBySlug(slug);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    const categoryId = category.getId()!;

    // Resolve children categories
    const children = await prisma.category.findMany({
      where: { parentId: categoryId, deletedAt: null, isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    // Resolve breadcrumbs path
    const breadcrumbs = await this.getBreadcrumbs(category.getParentId());

    // Resolve direct product count
    const productCount = await prisma.product.count({
      where: { categoryId, deletedAt: null, isActive: true },
    });

    res.status(200).json(ApiResponse.success({
      category,
      children,
      breadcrumbs,
      productCount,
    }, 'Category details retrieved successfully'));
  };

  private buildTree(categories: any[]): CategoryNode[] {
    const map = new Map<string, CategoryNode>();
    const roots: CategoryNode[] = [];

    // Map each item to CategoryNode interface
    categories.forEach((cat) => {
      const id = cat.getId()!;
      map.set(id, {
        id,
        name: cat.getName(),
        slug: cat.getSlug(),
        description: cat.getDescription(),
        imageUrl: cat.getImageUrl(),
        displayOrder: cat.getDisplayOrder(),
        parentId: cat.getParentId(),
        children: [],
      });
    });

    // Link parents to children
    map.forEach((node) => {
      if (node.parentId) {
        const parent = map.get(node.parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          // If parent is not in the list (e.g. deleted or deactivated), treat as root
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    // Sort children by displayOrder
    const sortTree = (nodes: CategoryNode[]) => {
      nodes.sort((a, b) => a.displayOrder - b.displayOrder);
      nodes.forEach((node) => {
        if (node.children.length > 0) {
          sortTree(node.children);
        }
      });
    };

    sortTree(roots);

    return roots;
  }

  private async getBreadcrumbs(parentId: string | null): Promise<any[]> {
    if (!parentId) return [];
    const list = [];
    let currentId: string | null = parentId;
    while (currentId) {
      const cat = await prisma.category.findUnique({
        where: { id: currentId, deletedAt: null },
      });
      if (!cat) break;
      list.push({ id: cat.id, name: cat.name, slug: cat.slug });
      currentId = cat.parentId;
    }
    return list.reverse();
  }
}
