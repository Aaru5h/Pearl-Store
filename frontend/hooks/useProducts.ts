"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { QUERY_KEYS, API } from "@/lib/constants";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data";
import type { Product, Category, ProductFilters, ProductDetail } from "@/types/product";
import type { PaginatedData, ApiResponse } from "@/types/api";

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: async (): Promise<Category[]> => {
      if (USE_MOCKS) return MOCK_CATEGORIES;
      const { data } = await api.get<ApiResponse<Category[]>>(API.CATEGORIES.TREE);
      return data.data || [];
    },
  });
}

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: [...QUERY_KEYS.products, filters],
    queryFn: async (): Promise<PaginatedData<Product>> => {
      if (USE_MOCKS) {
        let filtered = [...MOCK_PRODUCTS];
        if (filters?.category) {
          filtered = filtered.filter((p) => p.categoryId === filters.category);
        }
        if (filters?.search) {
          const q = filters.search.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.description?.toLowerCase().includes(q)
          );
        }
        return {
          items: filtered,
          total: filtered.length,
          page: filters?.page || 1,
          limit: filters?.limit || 20,
          totalPages: 1,
          hasMore: false,
        };
      }
      const { data } = await api.get<ApiResponse<PaginatedData<Product>>>(API.PRODUCTS.LIST, {
        params: filters,
      });
      return data.data!;
    },
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: [...QUERY_KEYS.products, "featured"],
    queryFn: async (): Promise<Product[]> => {
      if (USE_MOCKS) {
        return MOCK_PRODUCTS.filter((p) => p.isFeatured);
      }
      const { data } = await api.get<ApiResponse<Product[]>>(API.PRODUCTS.FEATURED);
      return data.data || [];
    },
  });
}

export function useNewArrivals() {
  return useQuery({
    queryKey: [...QUERY_KEYS.products, "new-arrivals"],
    queryFn: async (): Promise<Product[]> => {
      if (USE_MOCKS) {
        return MOCK_PRODUCTS.slice(0, 4);
      }
      const { data } = await api.get<ApiResponse<Product[]>>(API.PRODUCTS.NEW_ARRIVALS);
      return data.data || [];
    },
  });
}

export function useProductDetail(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.product(slug),
    queryFn: async (): Promise<ProductDetail> => {
      if (USE_MOCKS) {
        const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
        if (!product) throw new Error("Product not found");
        return {
          product,
          inventory: {
            quantityAvailable: product.inventory?.quantityAvailable || 0,
            allowBackorder: product.inventory?.allowBackorder || false,
          },
          breadcrumbs: [{ id: product.categoryId || "", name: "Category", slug: "category" }],
          reviewSummary: { averageRating: 4.5, totalReviews: 12, distribution: { 1: 0, 2: 0, 3: 1, 4: 4, 5: 7 } },
          relatedProducts: MOCK_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4),
          isInWishlist: false,
        };
      }
      const { data } = await api.get<ApiResponse<ProductDetail>>(API.PRODUCTS.BY_SLUG(slug));
      return data.data!;
    },
    enabled: !!slug,
  });
}
