"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Package, Users, ShoppingCart, TrendingUp } from "lucide-react";
import { PriceDisplay } from "@/components/shared/PriceDisplay";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
}

export default function AdminDashboardPage() {
  // Using mock data for now
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      // return api.get("/admin/stats").then(res => res.data.data);
      // Mock stats
      return {
        totalRevenue: 1542050, // in paise
        totalOrders: 152,
        totalCustomers: 89,
        totalProducts: 45
      };
    }
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
         <div className="h-8 bg-pebble rounded w-48 mb-8" />
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-pebble rounded-2xl" />)}
         </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Revenue", value: <PriceDisplay amount={stats?.totalRevenue || 0} />, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Customers", value: stats?.totalCustomers || 0, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Total Products", value: stats?.totalProducts || 0, icon: Package, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-8">
      <div>
         <h1 className="text-[24px] font-display font-semibold text-bark mb-2">Dashboard Overview</h1>
         <p className="text-stone">Welcome back to Pearl Store Admin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-6 border border-pebble shadow-card">
              <div className={`w-12 h-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                 <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-stone text-[14px] font-medium mb-1">{stat.label}</h3>
              <div className="text-charcoal text-[24px] font-semibold">{stat.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white rounded-2xl border border-pebble p-6 shadow-card">
            <h2 className="font-semibold text-bark mb-4">Recent Orders</h2>
            <div className="flex flex-col items-center justify-center py-12 text-stone text-[14px]">
               No recent orders found.
            </div>
         </div>
         <div className="bg-white rounded-2xl border border-pebble p-6 shadow-card">
            <h2 className="font-semibold text-bark mb-4">Low Stock Alerts</h2>
            <div className="flex flex-col items-center justify-center py-12 text-stone text-[14px]">
               Inventory levels look good.
            </div>
         </div>
      </div>
    </div>
  );
}
