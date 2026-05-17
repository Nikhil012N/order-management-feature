"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent} from "@/components/ui/card";
import { useApi, useMutation } from "@/hooks/use-api";
import { Order, OrderStatus } from "@/lib/types";
import AdminOrderCard from "@/components/admin-order-card";
import { ClipboardList, TrendingUp, Clock, RefreshCw, Layers } from "lucide-react";

export default function AdminPage() {
  const statusLabels: Record<OrderStatus, string> = {
    pending: "Order Received",
    confirmed: "Confirmed",
    preparing: "Preparing",
    ready: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">(
    "all"
  );
  const {
    data: orders,
    loading,
    error,
    startPolling,
    stopPolling,
    refetch,
  } = useApi<Order[]>("/api/orders", { autoFetch: false });

  const { mutate: updateOrderStatus, loading: updating } = useMutation(
    "",
    "PATCH"
  );

  useEffect(() => {
    startPolling(5000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    let sorted = [...orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (selectedStatus !== "all") {
      sorted = sorted.filter((o) => o.status === selectedStatus);
    }

    return sorted;
  }, [orders, selectedStatus]);

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      await updateOrderStatus(
        { status: newStatus },
        `/api/orders/${orderId}`
      );
      refetch();
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter((o) => o.status === "pending").length || 0,
    confirmed: orders?.filter((o) => o.status === "confirmed").length || 0,
    preparing: orders?.filter((o) => o.status === "preparing").length || 0,
    ready: orders?.filter((o) => o.status === "ready").length || 0,
    delivered: orders?.filter((o) => o.status === "delivered").length || 0,
    totalRevenue: orders
      ?.reduce((sum, o) => (o.status === "delivered" ? sum + o.totalAmount : sum), 0)
      .toFixed(2) || "0.00",
  };

  const statusOptions: OrderStatus[] = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "delivered",
  ];

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100/50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              Operational Hub
            </h1>
            <p className="text-slate-500 font-medium">
              Monitor, dispatch, and track live restaurant performance.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-full px-4 py-2 shadow-xs">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              Live Feed Connected
            </span>
          </div>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border border-slate-100 bg-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-2xl p-5 flex items-center justify-between group">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Dispatches</p>
              <p className="text-3xl font-black text-slate-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shadow-xs group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
              <ClipboardList className="w-6 h-6" />
            </div>
          </Card>

          <Card className="border border-slate-100 bg-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-2xl p-5 flex items-center justify-between group">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Queue</p>
              <p className="text-3xl font-black text-yellow-600">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center shadow-xs group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">
              <Clock className="w-6 h-6" />
            </div>
          </Card>

          <Card className="border border-slate-100 bg-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-2xl p-5 flex items-center justify-between group">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">In Progress</p>
              <p className="text-3xl font-black text-purple-600">{stats.confirmed + stats.preparing}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shadow-xs group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
              <Layers className="w-6 h-6" />
            </div>
          </Card>

          <Card className="border border-slate-100 bg-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 rounded-2xl p-5 flex items-center justify-between group">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Sales Revenue</p>
              <p className="text-3xl font-black text-green-600">${stats.totalRevenue}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center shadow-xs group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
              <TrendingUp className="w-6 h-6" />
            </div>
          </Card>
        </div>

        
        <div className="flex justify-between items-center gap-4 flex-wrap bg-white/70 backdrop-blur-md border border-slate-100 p-3 rounded-2xl shadow-sm">
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={selectedStatus === "all" ? "default" : "outline"}
              onClick={() => setSelectedStatus("all")}
              className={`rounded-full font-bold transition-all duration-300 cursor-pointer ${
                selectedStatus === "all"
                  ? "bg-slate-900 hover:bg-slate-800 text-white border-transparent"
                  : "border-slate-200 text-slate-600 hover:text-slate-900 bg-white"
              }`}
            >
              All Orders ({stats.total})
            </Button>
            {(["pending", "confirmed", "preparing", "ready", "delivered"] as const).map(
              (status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={selectedStatus === status ? "default" : "outline"}
                  onClick={() => setSelectedStatus(status)}
                  className={`rounded-full font-bold transition-all duration-300 cursor-pointer ${
                    selectedStatus === status
                      ? "bg-slate-900 hover:bg-slate-800 text-white border-transparent"
                      : "border-slate-200 text-slate-600 hover:text-slate-900 bg-white"
                  }`}
                >
                  {statusLabels[status]} ({stats[status]})
                </Button>
              )
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => refetch()}
            className="rounded-full border border-slate-100 hover:bg-slate-50 text-slate-500 hover:text-slate-800 font-bold px-3 py-1 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Now
          </Button>
        </div>

        
        <div className="space-y-6">
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-600 font-semibold">
                  Error loading order matrix: {error.message}
                </p>
              </CardContent>
            </Card>
          )}

          {loading && filteredOrders.length === 0 ? (
            <div className="flex justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="grid gap-6">
              {filteredOrders.map((order) => (
                <AdminOrderCard
                  key={order.id}
                  order={order}
                  statusOptions={statusOptions}
                  onStatusChange={handleStatusChange}
                  updating={updating}
                />
              ))}
            </div>
          ) : (
            <Card className="border border-slate-100 bg-white shadow-sm rounded-2xl">
              <CardContent className="pt-16 pb-16 text-center text-slate-400 font-medium">
                <p className="text-lg">No orders found with status &quot;{selectedStatus}&quot;</p>
                <p className="text-sm text-slate-400 mt-1">Updates populate automatically as clients place orders.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
