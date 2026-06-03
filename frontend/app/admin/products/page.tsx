"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Plus, Search, MoreVertical, Edit, Trash2 } from "lucide-react";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

interface AdminProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: "ACTIVE" | "DRAFT" | "OUT_OF_STOCK";
  category: {
    name: string;
  };
  images: { url: string }[];
}

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");

  const { data: products, isLoading } = useQuery<AdminProduct[]>({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      // Mock data
      return [
        {
          id: "prod_1",
          name: "Handcrafted Ceramic Mug",
          price: 129900, // 1299.00
          stock: 45,
          status: "ACTIVE",
          category: { name: "Home & Kitchen" },
          images: [{ url: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=400" }]
        },
        {
          id: "prod_2",
          name: "Organic Cotton Throw",
          price: 349900,
          stock: 12,
          status: "ACTIVE",
          category: { name: "Home & Kitchen" },
          images: [{ url: "https://images.unsplash.com/photo-1580828369019-2238b909193e?auto=format&fit=crop&q=80&w=400" }]
        },
        {
          id: "prod_3",
          name: "Brass Incense Holder",
          price: 89900,
          stock: 0,
          status: "OUT_OF_STOCK",
          category: { name: "Decor" },
          images: [{ url: "https://images.unsplash.com/photo-1603513492128-ba7bc9b3e143?auto=format&fit=crop&q=80&w=400" }]
        }
      ] as AdminProduct[];
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-display font-semibold text-bark">Products</h1>
          <p className="text-stone">Manage your inventory and product listings.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-charcoal text-white rounded-lg hover:bg-charcoal/90 transition-colors text-[14px] font-medium"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-pebble shadow-card overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-pebble flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
            <input 
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-pebble rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-charcoal/20"
            />
          </div>
          <select className="border border-pebble rounded-lg px-4 py-2 text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-charcoal/20">
            <option value="ALL">All Categories</option>
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-fog/50 text-[12px] font-semibold text-stone uppercase tracking-wider">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pebble text-[14px]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone">
                    <div className="animate-pulse flex flex-col items-center gap-4">
                      <div className="w-8 h-8 border-4 border-pebble border-t-charcoal rounded-full animate-spin" />
                      Loading products...
                    </div>
                  </td>
                </tr>
              ) : products?.map(product => (
                <tr key={product.id} className="hover:bg-fog/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-fog relative overflow-hidden flex-shrink-0">
                        {product.images?.[0]?.url && (
                          <Image 
                            src={product.images[0].url} 
                            alt={product.name} 
                            fill 
                            className="object-cover"
                          />
                        )}
                      </div>
                      <span className="font-medium text-charcoal">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-stone">{product.category.name}</td>
                  <td className="p-4"><PriceDisplay amount={product.price} /></td>
                  <td className="p-4">
                    <span className={`${product.stock <= 5 ? "text-error font-medium" : "text-charcoal"}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-[12px] font-medium ${
                      product.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                      product.status === "OUT_OF_STOCK" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {product.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-stone hover:text-charcoal hover:bg-fog rounded-md transition-colors" aria-label="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-stone hover:text-error hover:bg-error/10 rounded-md transition-colors" aria-label="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
