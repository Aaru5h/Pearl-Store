"use client";

import { PriceDisplay } from "@/components/shared/PriceDisplay";
import Link from "next/link";
import { PackageSearch } from "lucide-react";

export default function OrdersPage() {
  // In a real app, fetch orders using TanStack query
  const mockOrders = [
    {
      id: "ORD-P123456",
      date: "Oct 12, 2023",
      status: "Delivered",
      total: 125000,
      itemCount: 4,
    },
    {
      id: "ORD-P789012",
      date: "Sep 28, 2023",
      status: "Processing",
      total: 45000,
      itemCount: 2,
    }
  ];

  return (
    <div>
      <h2 className="font-sans font-semibold text-[20px] text-charcoal mb-8 pb-4 border-b border-pebble">
        Order History
      </h2>

      {mockOrders.length === 0 ? (
        <div className="py-12 flex flex-col items-center text-center">
            <PackageSearch className="w-12 h-12 text-stone opacity-30 mb-4" />
            <p className="text-[16px] font-medium text-charcoal mb-2">No orders yet</p>
            <p className="text-[14px] text-stone mb-6">You haven't placed any orders with us.</p>
            <Link href="/shop" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {mockOrders.map((order) => (
            <div key={order.id} className="border border-pebble rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-stone transition-colors">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-charcoal">{order.id}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-medium ${
                            order.status === "Delivered" ? "bg-sage/10 text-sage" : "bg-terracotta/10 text-terracotta"
                        }`}>
                            {order.status}
                        </span>
                    </div>
                    <p className="text-[13px] text-stone">
                        Placed on {order.date} • {order.itemCount} items
                    </p>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                    <PriceDisplay amount={order.total} size="md" />
                    <button className="text-[14px] font-medium text-bark hover:underline">
                        View Details
                    </button>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
