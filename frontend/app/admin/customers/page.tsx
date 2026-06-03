"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";

interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: "ACTIVE" | "INACTIVE";
}

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");

  const { data: customers, isLoading } = useQuery<AdminCustomer[]>({
    queryKey: ["admin", "customers"],
    queryFn: async () => {
      // Mock data
      return [
        {
          id: "usr_1",
          name: "Anita Sharma",
          email: "anita.sharma@example.com",
          phone: "+91 98765 43210",
          totalOrders: 12,
          totalSpent: 4580000, // ₹45,800
          lastOrderDate: "2024-03-10T10:30:00Z",
          status: "ACTIVE",
        },
        {
          id: "usr_2",
          name: "Rahul Verma",
          email: "rahul.v@example.com",
          totalOrders: 3,
          totalSpent: 850000,
          lastOrderDate: "2024-02-15T14:20:00Z",
          status: "ACTIVE",
        },
      ] as AdminCustomer[];
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-display font-semibold text-bark">Customers</h1>
          <p className="text-stone">Manage your store's registered customers.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-pebble shadow-card overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-pebble flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
            <input 
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-pebble rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-charcoal/20"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-fog/50 text-[12px] font-semibold text-stone uppercase tracking-wider">
                <th className="p-4">Customer</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Total Spent</th>
                <th className="p-4">Last Order</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pebble text-[14px]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone">
                    <div className="animate-pulse flex flex-col items-center gap-4">
                      <div className="w-8 h-8 border-4 border-pebble border-t-charcoal rounded-full animate-spin" />
                      Loading customers...
                    </div>
                  </td>
                </tr>
              ) : customers?.map(customer => (
                <tr key={customer.id} className="hover:bg-fog/30 transition-colors">
                  <td className="p-4 font-medium text-charcoal">{customer.name}</td>
                  <td className="p-4 text-stone">
                    <div>{customer.email}</div>
                    {customer.phone && <div className="text-[12px]">{customer.phone}</div>}
                  </td>
                  <td className="p-4">{customer.totalOrders}</td>
                  <td className="p-4 text-stone">₹{(customer.totalSpent / 100).toLocaleString('en-IN')}</td>
                  <td className="p-4 text-stone">{new Date(customer.lastOrderDate).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-[12px] font-medium ${
                      customer.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {customer.status}
                    </span>
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
