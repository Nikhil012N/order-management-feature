"use client";

import { Order, OrderStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { User, Mail, Phone, MapPin, ChevronDown, ClipboardList } from "lucide-react";

interface AdminOrderCardProps {
  order: Order;
  statusOptions: OrderStatus[];
  onStatusChange: (orderId: string, status: OrderStatus) => Promise<void>;
  updating: boolean;
}

const statusConfig = {
  pending: { color: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Order Received" },
  confirmed: { color: "bg-blue-50 text-blue-700 border-blue-200", label: "Confirmed" },
  preparing: { color: "bg-purple-50 text-purple-700 border-purple-200", label: "Preparing" },
  ready: { color: "bg-green-50 text-green-700 border-green-200", label: "Out for Delivery" },
  delivered: { color: "bg-slate-50 text-slate-700 border-slate-200", label: "Delivered" },
  cancelled: { color: "bg-red-50 text-red-700 border-red-200", label: "Cancelled" },
};

export default function AdminOrderCard({
  order,
  statusOptions,
  onStatusChange,
  updating,
}: AdminOrderCardProps) {
  const config = statusConfig[order.status] || {
    color: "bg-slate-50 text-slate-700 border-slate-200",
    label: order.status,
  };

  return (
    <Card className="border border-slate-100 bg-white/90 backdrop-blur-md shadow-md hover:shadow-xl hover:border-slate-200/60 transition-all duration-300 rounded-2xl overflow-hidden animate-fade-in">
      <CardHeader className="pb-4 border-b border-slate-50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-black text-slate-900 tracking-tight">Order #{order.id}</CardTitle>
              <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider shadow-2xs ${config.color}`}>
                {config.label}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-400">
              Received on {format(new Date(order.createdAt), "PPp")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" disabled={updating} className="rounded-full border-slate-200 hover:bg-slate-50 font-bold flex gap-1.5 items-center cursor-pointer shadow-xs">
                  Change Status
                  <ChevronDown className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border-slate-100 shadow-xl p-1 bg-white">
                {statusOptions.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => onStatusChange(order.id, status)}
                    className="font-bold text-xs text-slate-600 hover:text-slate-900 focus:bg-slate-50 rounded-lg py-2 cursor-pointer"
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50/50 border border-slate-100 p-4 rounded-xl text-sm">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client</p>
              <p className="font-bold text-slate-800 truncate">{order.customerName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
              <p className="font-semibold text-slate-600 truncate">{order.customerEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</p>
              <p className="font-semibold text-slate-600 truncate">{order.customerPhone || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Address</p>
              <p className="font-semibold text-slate-600 truncate">{order.customerAddress}</p>
            </div>
          </div>
        </div>

        
        <div>
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Order Basket Items</h4>
          <div className="space-y-2 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center text-sm py-1.5 border-b border-slate-100 last:border-b-0"
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
          <div className="bg-amber-50/30 border border-amber-100/50 rounded-xl p-4 text-sm flex gap-3 items-start">
            <ClipboardList className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-950 text-xs uppercase tracking-wider mb-1">
                Special Client Notes
              </h4>
              <p className="text-amber-900 font-medium italic">{order.notes}</p>
            </div>
          </div>
        )}

        
        <div className="flex justify-between items-center border-t border-slate-100 pt-5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Receipt Summary</span>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Grand Total:</span>
            <span className="text-2xl font-black text-slate-950">
              ${order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
