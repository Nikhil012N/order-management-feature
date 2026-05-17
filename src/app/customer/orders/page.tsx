"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { Order } from "@/lib/types";
import OrderCard from "@/components/order-card";
const getInitialCustomerId = () => {
  if (typeof window !== "undefined") {
    const savedId = localStorage.getItem("customer_id");
    if (savedId && savedId !== "undefined" && savedId !== "null") {
      return savedId;
    }
  }
  return "";
};
export default function OrdersPage() {
  const [customerId] = useState<string | null>(getInitialCustomerId);
  const [hasCheckedSession] = useState(true);


  const apiUrl = customerId 
    ? `/api/orders?customerId=${customerId}` 
    : "/api/orders";

  const {
    data: orders,
    loading,
    error,
    startPolling,
    stopPolling,
  } = useApi<Order[]>(apiUrl, { autoFetch: false });

  useEffect(() => {
    if (hasCheckedSession && customerId) {
      startPolling(5000);
    }
    return () => stopPolling();
  }, [customerId, hasCheckedSession, startPolling, stopPolling]);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return [...orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [orders]);

  const statusCounts = {
    pending: filteredOrders.filter((o) => o.status === "pending").length,
    confirmed: filteredOrders.filter((o) => o.status === "confirmed").length,
    preparing: filteredOrders.filter((o) => o.status === "preparing").length,
    ready: filteredOrders.filter((o) => o.status === "ready").length,
    delivered: filteredOrders.filter((o) => o.status === "delivered").length,
  };

  if (!hasCheckedSession) {
    return (
      <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Your Orders
            </h1>
            <p className="text-slate-600">
              Track your orders in real-time (updates every 5 seconds)
            </p>
          </div>
          <Link href="/customer">
            <Button variant="outline">Place New Order</Button>
          </Link>
        </div>

        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Order Received", count: statusCounts.pending, color: "bg-yellow-50 border-yellow-200" },
            { label: "Confirmed", count: statusCounts.confirmed, color: "bg-blue-50 border-blue-200" },
            { label: "Preparing", count: statusCounts.preparing, color: "bg-purple-50 border-purple-200" },
            { label: "Out for Delivery", count: statusCounts.ready, color: "bg-green-50 border-green-200" },
            { label: "Delivered", count: statusCounts.delivered, color: "bg-slate-50 border-slate-200" },
          ].map((status) => (
            <Card key={status.label} className={`${status.color} border`}>
              <CardContent className="pt-4 text-center">
                <p className="text-2xl font-bold text-slate-900">
                  {status.count}
                </p>
                <p className="text-xs text-slate-600 mt-1">{status.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        
        {error && (
          <Card className="border-red-200 bg-red-50 mb-8">
            <CardContent className="pt-6">
              <p className="text-red-600">
                Error loading orders: {error.message}
              </p>
            </CardContent>
          </Card>
        )}

        {loading && filteredOrders.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="grid gap-6">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center text-slate-600">
              <p className="mb-4">No orders yet</p>
              <Link href="/customer">
                <Button className="bg-slate-900 hover:bg-slate-800">
                  Place Your First Order
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
