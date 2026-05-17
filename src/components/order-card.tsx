"use client";

import { Order, OrderStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Clock, MapPin, Phone, User, CheckCircle } from "lucide-react";

interface OrderCardProps {
  order: Order;
  showCustomerInfo?: boolean;
  onStatusChange?: (orderId: string, status: string) => void;
}

const statusConfig = {
  pending: {
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    label: "Order Received",
    icon: "⏳",
  },
  confirmed: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    label: "Confirmed",
    icon: "✓",
  },
  preparing: {
    color: "bg-purple-50 text-purple-700 border-purple-200",
    label: "Preparing",
    icon: "👨‍🍳",
  },
  ready: {
    color: "bg-green-50 text-green-700 border-green-200",
    label: "Out for Delivery",
    icon: "🛵",
  },
  delivered: {
    color: "bg-slate-50 text-slate-700 border-slate-200",
    label: "Delivered",
    icon: "🎁",
  },
  cancelled: {
    color: "bg-red-50 text-red-700 border-red-200",
    label: "Cancelled",
    icon: "❌",
  },
};

const trackingSteps: { key: OrderStatus; label: string; icon: string }[] = [
  { key: "pending", label: "Placed", icon: "⏳" },
  { key: "confirmed", label: "Confirmed", icon: "👍" },
  { key: "preparing", label: "Preparing", icon: "🍳" },
  { key: "ready", label: "En Route", icon: "🛵" },
  { key: "delivered", label: "Delivered", icon: "🎁" },
];

export default function OrderCard({
  order,
  showCustomerInfo = false,
}: OrderCardProps) {
  const config = statusConfig[order.status] || {
    color: "bg-slate-50 text-slate-700 border-slate-200",
    label: order.status,
    icon: "📝",
  };

  const currentStepIndex = trackingSteps.findIndex((s) => s.key === order.status);

  return (
    <Card className="border border-slate-100 bg-white/90 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden animate-fade-in">
      <CardHeader className="pb-3 border-b border-slate-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <CardTitle className="text-lg font-black text-slate-900 tracking-tight">Order #{order.id}</CardTitle>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Placed on {format(new Date(order.createdAt), "PPp")}
            </p>
          </div>
          <div className={`px-3 py-1.5 rounded-full border text-xs font-bold flex gap-1.5 items-center shadow-xs ${config.color}`}>
            <span>{config.icon}</span>
            <span>{config.label}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-5">
        
        
        {order.status !== "cancelled" && (
          <div className="py-4 border-b border-slate-50">
            <div className="relative flex justify-between items-center max-w-xl mx-auto">
              
              
              <div className="absolute left-0 right-0 top-1/3 h-[3px] bg-slate-100 -translate-y-1/2 z-0 rounded-full" />
              
              
              <div
                className="absolute left-0 top-1/3 h-[3px] bg-gradient-to-r from-orange-500 to-amber-500 -translate-y-1/2 z-0 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${(currentStepIndex >= 0 ? currentStepIndex / (trackingSteps.length - 1) : 0) * 100}%`,
                }}
              />

              
              {trackingSteps.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isActive = idx === currentStepIndex;
                
                return (
                  <div key={step.key} className="flex flex-col items-center z-10 relative">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-all duration-500 ${
                        isActive
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white scale-115 ring-4 ring-orange-100 animate-pulse-subtle"
                          : isCompleted
                          ? "bg-orange-500 text-white"
                          : "bg-white text-slate-400 border border-slate-200"
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : <span>{step.icon}</span>}
                    </div>
                    <span
                      className={`text-[9px] sm:text-[10px] font-bold mt-2 uppercase tracking-wider text-center transition-colors duration-300 ${
                        isActive ? "text-orange-600" : isCompleted ? "text-slate-700" : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}

            </div>
          </div>
        )}

        
        {showCustomerInfo && (
          <div className="text-sm bg-slate-50/50 rounded-xl p-4 border border-slate-100 grid sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="font-semibold text-slate-800 truncate">{order.customerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="font-semibold text-slate-600 truncate">{order.customerPhone || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="font-semibold text-slate-600 truncate">{order.customerAddress}</span>
            </div>
          </div>
        )}

        
        <div>
          <h4 className="font-bold text-slate-900 text-sm mb-3">Basket Items</h4>
          <div className="space-y-2.5">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center text-sm py-2 border-b border-slate-50 last:border-b-0"
              >
                <span className="font-semibold text-slate-700">
                  {item.menuItemName} <span className="text-orange-500 ml-1">× {item.quantity}</span>
                </span>
                <span className="font-black text-slate-950">
                  ${item.subtotal.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        
        {order.notes && (
          <div className="bg-orange-50/30 border border-orange-100/50 rounded-xl p-3 text-sm">
            <h4 className="font-bold text-orange-950 text-xs uppercase tracking-wider mb-1">
              Instructions
            </h4>
            <p className="text-orange-900 font-medium italic">{order.notes}</p>
          </div>
        )}

        
        <div className="flex justify-between items-end border-t border-slate-100 pt-5">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Grand Total</p>
            <p className="text-2xl font-black text-slate-950">
              ${order.totalAmount.toFixed(2)}
            </p>
          </div>
          {order.estimatedDeliveryTime && order.status !== "delivered" && order.status !== "cancelled" && (
            <div className="text-right bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 flex items-center gap-2.5 shadow-2xs">
              <Clock className="w-4 h-4 text-orange-500" />
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. Arrival</p>
                <p className="text-sm font-black text-slate-950">
                  {format(new Date(order.estimatedDeliveryTime), "p")}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
