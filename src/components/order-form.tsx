"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreateOrderRequest, MenuItem, Order } from "@/lib/types";
import { useMutation } from "@/hooks/use-api";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Truck, ClipboardList } from "lucide-react";
import Image from "next/image";
const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.email("Please enter a valid email address"),
  customerPhone: z.string().min(7, "Phone number must be at least 7 characters"),
  customerAddress: z.string().min(5, "Delivery address must be at least 5 characters"),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface OrderFormProps {
  menuItems: MenuItem[];
  cart?: Map<
    string,
    {
      item: MenuItem;
      quantity: number;
    }
  >;
  onAdd?: (item: MenuItem) => void;
  onRemove?: (id: string) => void;
  hideMenuSelection?: boolean;
  onBackToMenu?: () => void;
}

export default function OrderForm({
  menuItems,
  cart: externalCart,
  onAdd: externalOnAdd,
  onRemove: externalOnRemove,
  hideMenuSelection = false,
  onBackToMenu,
}: OrderFormProps) {
  const [internalCart, setInternalCart] = useState<
    Map<
      string,
      {
        item: MenuItem;
        quantity: number;
      }
    >
  >(new Map());

  const cart = externalCart || internalCart;
const getInitialCustomerId = () => {
  const savedId = localStorage.getItem("customer_id");
  if (savedId && savedId !== "undefined" && savedId !== "null") {
    return savedId;
  }
  return "cust-" + Date.now();
};

  const [customerId] = useState(getInitialCustomerId);
  const [submitted, setSubmitted] = useState(false);

  const { mutate: createOrder, loading, error } = useMutation<Order, CreateOrderRequest>(
    "/api/orders",
    "POST"
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerAddress: "",
      notes: "",
    },
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("customer_name") || "";
      const savedEmail = localStorage.getItem("customer_email") || "";
      const savedPhone = localStorage.getItem("customer_phone") || "";
      const savedAddress = localStorage.getItem("customer_address") || "";
      const cleanName = savedName === "undefined" || savedName === "null" ? "" : savedName;
      const cleanEmail = savedEmail === "undefined" || savedEmail === "null" ? "" : savedEmail;
      const cleanPhone = savedPhone === "undefined" || savedPhone === "null" ? "" : savedPhone;
      const cleanAddress = savedAddress === "undefined" || savedAddress === "null" ? "" : savedAddress;

      reset({
        customerName: cleanName,
        customerEmail: cleanEmail,
        customerPhone: cleanPhone,
        customerAddress: cleanAddress,
        notes: "",
      });
    }
  }, [reset]);

  const toggleItem = (item: MenuItem) => {
    if (externalOnAdd) {
      externalOnAdd(item);
      return;
    }
    const newCart = new Map(cart);
    if (newCart.has(item.id)) {
      const entry = newCart.get(item.id)!;
      entry.quantity += 1;
    } else {
      newCart.set(item.id, { item, quantity: 1 });
    }
    setInternalCart(newCart);
  };

  const removeItem = (id: string) => {
    if (externalOnRemove) {
      externalOnRemove(id);
      return;
    }
    const newCart = new Map(cart);
    const entry = newCart.get(id);
    if (entry) {
      if (entry.quantity > 1) {
        entry.quantity -= 1;
      } else {
        newCart.delete(id);
      }
    }
    setInternalCart(newCart);
  };

  const calculateTotal = () => {
    let total = 0;
    cart.forEach(({ item, quantity }) => {
      total += item.price * quantity;
    });
    return total;
  };

  const onSubmit = async (values: CheckoutFormValues) => {
    if (cart.size === 0) {
      alert("Please add items to your order");
      return;
    }

    try {
      const order = await createOrder({
        customerId,
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        customerPhone: values.customerPhone,
        customerAddress: values.customerAddress,
        items: Array.from(cart.values()).map(({ item, quantity }) => ({
          menuItemId: item.id,
          quantity,
        })),
        notes: values.notes || "",
      });
      if (order && order.customerId) {
        localStorage.setItem("customer_id", order.customerId);
        localStorage.setItem("customer_name", order.customerName || "");
        localStorage.setItem("customer_email", order.customerEmail || "");
        localStorage.setItem("customer_phone", order.customerPhone || "");
        localStorage.setItem("customer_address", order.customerAddress || "");
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Order submission failed:", err);
    }
  };

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto border border-green-100 bg-green-50/50 backdrop-blur-md shadow-xl p-4 sm:p-8 rounded-2xl animate-fade-in">
        <CardContent className="pt-6 text-center space-y-6">
          <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20 text-3xl animate-bounce-subtle">
            ✓
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-green-950 tracking-tight">
              Order Placed Successfully!
            </h2>
            <p className="text-green-700 max-w-md mx-auto text-base">
              Your delicious food is being prepared. You can track its real-time delivery status now!
            </p>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/customer/orders" className="w-full sm:w-auto">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-full transition-all duration-300 shadow-lg shadow-green-600/20 cursor-pointer animate-pulse-subtle">
                Track My Order
              </Button>
            </Link>
            {onBackToMenu && (
              <Button
                variant="outline"
                onClick={onBackToMenu}
                className="w-full sm:w-auto border-green-200 text-green-800 hover:bg-green-100 rounded-full font-bold px-6 cursor-pointer"
              >
                Back to Menu
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  if (hideMenuSelection) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in px-2 sm:px-0">
        {onBackToMenu && (
          <Button
            variant="ghost"
            onClick={onBackToMenu}
            className="flex gap-2 items-center text-slate-600 hover:text-slate-900 group font-bold px-0 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Menu
          </Button>
        )}

        <div className="grid gap-6">
          
          <Card className="border border-slate-100 bg-white/80 backdrop-blur-xs shadow-lg rounded-2xl">
            <CardHeader className="pb-3 border-b border-slate-50 flex flex-row items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-orange-500" />
              <CardTitle className="text-xl font-extrabold text-slate-900 tracking-tight">Basket Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {cart.size === 0 ? (
                <p className="text-slate-500 text-center py-4 font-medium">Your basket is empty</p>
              ) : (
                <>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {Array.from(cart.values()).map(({ item, quantity }) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center text-slate-700 py-1.5 border-b border-slate-100 last:border-0"
                      >
                        <span className="font-semibold text-sm">
                          {item.name} <span className="text-orange-500 ml-1">× {quantity}</span>
                        </span>
                        <span className="font-black text-slate-900 text-sm">
                          ${(item.price * quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 pt-4 flex justify-between items-center font-black text-xl text-slate-950">
                    <span>Total Amount:</span>
                    <span className="text-orange-500">${calculateTotal().toFixed(2)}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          
          <Card className="border border-slate-100 bg-white/80 backdrop-blur-xs shadow-lg rounded-2xl">
            <CardHeader className="pb-3 border-b border-slate-50 flex flex-row items-center gap-3">
              <Truck className="w-5 h-5 text-orange-500" />
              <CardTitle className="text-xl font-extrabold text-slate-900 tracking-tight">Delivery Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Name *
                    </label>
                    <Input
                      {...register("customerName")}
                      placeholder="Your full name"
                      className="mt-1.5 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500/20 py-2.5 font-medium"
                    />
                    {errors.customerName && (
                      <p className="text-red-500 text-xs font-bold mt-1.5 animate-pulse-subtle">
                        {errors.customerName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Phone Number *
                    </label>
                    <Input
                      {...register("customerPhone")}
                      placeholder="(555) 123-4567"
                      className="mt-1.5 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500/20 py-2.5 font-medium"
                    />
                    {errors.customerPhone && (
                      <p className="text-red-500 text-xs font-bold mt-1.5 animate-pulse-subtle">
                        {errors.customerPhone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    {...register("customerEmail")}
                    placeholder="your@email.com"
                    className="mt-1.5 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500/20 py-2.5 font-medium"
                  />
                  {errors.customerEmail && (
                    <p className="text-red-500 text-xs font-bold mt-1.5 animate-pulse-subtle">
                      {errors.customerEmail.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Delivery Address *
                  </label>
                  <Input
                    {...register("customerAddress")}
                    placeholder="Street Address, Suite/Apt, City, State"
                    className="mt-1.5 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500/20 py-2.5 font-medium"
                  />
                  {errors.customerAddress && (
                    <p className="text-red-500 text-xs font-bold mt-1.5 animate-pulse-subtle">
                      {errors.customerAddress.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <ClipboardList className="w-3.5 h-3.5" />
                    Special Instructions
                  </label>
                  <Textarea
                    {...register("notes")}
                    placeholder="Allergies, delivery gate code, drop-off instructions..."
                    className="mt-1.5 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500/20 font-medium"
                    rows={3}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100 font-semibold animate-pulse-subtle">
                    Error placing order: {error.message}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || cart.size === 0}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base py-6 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/20 cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Placing Your Order...
                    </span>
                  ) : (
                    "Place Order & Pay"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Select Items</h2>
        <div className="space-y-2 bg-white rounded-lg p-4 border border-slate-200">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 items-center p-3 border-b border-slate-200 last:border-b-0"
            >
            
              <Image
                width={64}
                height={64}
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md bg-slate-100 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 truncate">{item.name}</h3>
                <p className="text-sm text-slate-600 line-clamp-1">{item.description}</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  ${item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeItem(item.id)}
                  disabled={!cart.has(item.id)}
                >
                  −
                </Button>
                <span className="w-8 text-center font-bold text-slate-900">
                  {cart.get(item.id)?.quantity || 0}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleItem(item)}
                >
                  +
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div className="space-y-6">
        
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cart.size === 0 ? (
              <p className="text-slate-600">No items selected</p>
            ) : (
              <>
                {Array.from(cart.values()).map(({ item, quantity }) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-slate-700"
                  >
                    <span>
                      {item.name} × {quantity}
                    </span>
                    <span>${(item.price * quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-lg text-slate-900">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Name *
                </label>
                <Input
                  {...register("customerName")}
                  placeholder="Your full name"
                  className="mt-1"
                />
                {errors.customerName && (
                  <p className="text-red-500 text-xs font-bold mt-1.5">
                    {errors.customerName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Email *
                </label>
                <Input
                  type="email"
                  {...register("customerEmail")}
                  placeholder="your@email.com"
                  className="mt-1"
                />
                {errors.customerEmail && (
                  <p className="text-red-500 text-xs font-bold mt-1.5">
                    {errors.customerEmail.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Address *
                </label>
                <Input
                  {...register("customerAddress")}
                  placeholder="123 Main St, City"
                  className="mt-1"
                />
                {errors.customerAddress && (
                  <p className="text-red-500 text-xs font-bold mt-1.5">
                    {errors.customerAddress.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Phone *
                </label>
                <Input
                  {...register("customerPhone")}
                  placeholder="(555) 123-4567"
                  className="mt-1"
                />
                {errors.customerPhone && (
                  <p className="text-red-500 text-xs font-bold mt-1.5">
                    {errors.customerPhone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Special Instructions
                </label>
                <Textarea
                  {...register("notes")}
                  placeholder="Any special requests or allergies?"
                  className="mt-1"
                  rows={3}
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm">
                  Error: {error.message}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || cart.size === 0}
                className="w-full bg-slate-900 hover:bg-slate-800 cursor-pointer"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
