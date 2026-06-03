"use client";

import { useQuery } from "@tanstack/react-query";
import { Search, Eye, Filter } from "lucide-react";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { useState } from "react";

interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");

  const { data: orders, isLoading } = useQuery<AdminOrder[]>({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      // Mock data
      return [
        {
          id: "ord_1",
          orderNumber: "PRL-2026-1029",
          customerName: "Aarush Gupta",
          total: 129900, // 1299.00
          status: "PENDING",
          paymentStatus: "PAID",
          createdAt: new Date().toISOString()
        },
        {
          id: "ord_2",
          orderNumber: "PRL-2026-1028",
          customerName: "Priya Sharma",
          total: 450000,
          status: "PROCESSING",
          paymentStatus: "PAID",
          createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        {
          id: "ord_3",
          orderNumber: "PRL-2026-1027",
          customerName: "Rohan Patel",
          total: 89900,
          status: "SHIPPED",
          paymentStatus: "PAID",
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
        }
      ] as AdminOrder[];
    }
  });

  const getStatusColor = (status: AdminOrder["status"]) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "PROCESSING": return "bg-blue-100 text-blue-800";
      case "SHIPPED": return "bg-purple-100 text-purple-800";
      case "DELIVERED": return "bg-green-100 text-green-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-display font-semibold text-bark">Orders</h1>
          <p className="text-stone">View and manage customer orders.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-pebble shadow-card overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-pebble flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
            <input 
              type="text"
              placeholder="Search by order number or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-pebble rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-charcoal/20"
            />
          </div>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-pebble rounded-lg hover:bg-fog transition-colors text-[14px] font-medium text-charcoal">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-fog/50 text-[12px] font-semibold text-stone uppercase tracking-wider">
                <th className="p-4">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Fulfillment</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pebble text-[14px]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone">
                    <div className="animate-pulse flex flex-col items-center gap-4">
                      <div className="w-8 h-8 border-4 border-pebble border-t-charcoal rounded-full animate-spin" />
                      Loading orders...
                    </div>
                  </td>
                </tr>
              ) : orders?.map(order => (
                <tr key={order.id} className="hover:bg-fog/30 transition-colors">
                  <td className="p-4 font-medium text-charcoal">{order.orderNumber}</td>
                  <td className="p-4 text-stone">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-charcoal">{order.customerName}</td>
                  <td className="p-4"><PriceDisplay amount={order.total} /></td>
                  <td className="p-4">
                     <span className={`inline-flex px-2 py-1 rounded-full text-[12px] font-medium ${
                      order.paymentStatus === "PAID" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-[12px] font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-stone hover:text-charcoal hover:bg-fog rounded-md transition-colors" aria-label="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
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
