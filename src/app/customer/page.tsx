"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { MenuItem } from "@/lib/types";
import MenuBrowser from "@/components/menu-browser";
import OrderForm from "@/components/order-form";
import { ShoppingBasket, Plus, Minus, ArrowRight, Clock } from "lucide-react";

export default function CustomerPage() {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showMobileBasket, setShowMobileBasket] = useState(false);
  const [cart, setCart] = useState<
    Map<
      string,
      {
        item: MenuItem;
        quantity: number;
      }
    >
  >(new Map());

  const {
    data: menuItems,
    loading: menuLoading,
    error: menuError,
  } = useApi<MenuItem[]>("/api/menu");

  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const next = new Map(prev);
      if (next.has(item.id)) {
        next.get(item.id)!.quantity += 1;
      } else {
        next.set(item.id, { item, quantity: 1 });
      }
      return next;
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => {
      const next = new Map(prev);
      if (next.has(id)) {
        const entry = next.get(id)!;
        if (entry.quantity > 1) {
          entry.quantity -= 1;
        } else {
          next.delete(id);
        }
      }
      return next;
    });
  };

  const calculateTotal = () => {
    let total = 0;
    cart.forEach(({ item, quantity }) => {
      total += item.price * quantity;
    });
    return total;
  };

  const totalItemsCount = Array.from(cart.values()).reduce(
    (acc, val) => acc + val.quantity,
    0
  );

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Explore Menu
          </h1>
          <p className="text-slate-500 font-medium">
            Browse our categories, add items to your basket, and track live delivery.
          </p>
        </div>
        <Link href="/customer/orders">
          <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full font-bold cursor-pointer">
            Track Active Orders
          </Button>
        </Link>
      </div>

      {menuError && (
        <Card className="border-red-200 bg-red-50 mb-8">
          <CardContent className="pt-6">
            <p className="text-red-600 font-semibold">
              Error loading menu: {menuError.message}
            </p>
          </CardContent>
        </Card>
      )}

      {menuLoading ? (
        <div className="flex justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : menuItems && menuItems.length > 0 ? (
        showOrderForm ? (
          <OrderForm
            menuItems={menuItems}
            cart={cart}
            onAdd={handleAddToCart}
            onRemove={handleRemoveFromCart}
            hideMenuSelection={true}
            onBackToMenu={() => setShowOrderForm(false)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-8">
              <MenuBrowser
                items={menuItems}
                cart={cart}
                onAdd={handleAddToCart}
                onRemove={handleRemoveFromCart}
              />
            </div>

            
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <Card className="border border-slate-100 bg-white/90 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBasket className="w-5 h-5 text-orange-500" />
                    <CardTitle className="text-lg font-black text-slate-900 tracking-tight">Your Basket</CardTitle>
                  </div>
                  {totalItemsCount > 0 && (
                    <span className="bg-orange-500 text-white text-xs font-black px-2.5 py-1 rounded-full">
                      {totalItemsCount} items
                    </span>
                  )}
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {cart.size === 0 ? (
                    <div className="text-center py-12 space-y-3">
                      <div className="text-4xl text-slate-300">🛒</div>
                      <p className="text-sm font-semibold text-slate-400">
                        Your basket is empty.
                      </p>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        Add some delicious meals from the menu to start checkout!
                      </p>
                    </div>
                  ) : (
                    <>
                      
                      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                        {Array.from(cart.values()).map(({ item, quantity }) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0"
                          >
                            <div className="min-w-0 flex-1 pr-3">
                              <p className="font-bold text-slate-800 text-sm truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-slate-500 font-medium">
                                ${item.price.toFixed(2)} each
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleRemoveFromCart(item.id)}
                                className="w-7 h-7 rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </Button>
                              <span className="font-extrabold text-slate-900 text-sm w-5 text-center">
                                {quantity}
                              </span>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleAddToCart(item)}
                                className="w-7 h-7 rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      
                      <div className="bg-slate-50/70 rounded-xl p-3 flex gap-2.5 items-center border border-slate-100">
                        <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span className="text-xs font-semibold text-slate-600 leading-snug">
                          Estimated preparation time is <strong>15-25 minutes</strong>.
                        </span>
                      </div>

                      
                      <div className="space-y-4 pt-2">
                        <div className="flex justify-between items-center text-sm font-semibold text-slate-500">
                          <span>Subtotal</span>
                          <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-semibold text-slate-500">
                          <span>Delivery Fee</span>
                          <span className="text-green-600 font-bold">FREE</span>
                        </div>
                        <div className="border-t border-slate-100 pt-4 flex justify-between items-center font-black text-xl text-slate-950">
                          <span>Total</span>
                          <span className="text-orange-500">${calculateTotal().toFixed(2)}</span>
                        </div>

                        <Button
                          onClick={() => setShowOrderForm(true)}
                          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base py-6 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/25 cursor-pointer flex gap-2 items-center justify-center group"
                        >
                          Proceed to Checkout
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )
      ) : (
        <Card className="border border-slate-100 bg-white shadow-md rounded-2xl">
          <CardContent className="pt-12 pb-12 text-center text-slate-500 font-medium">
            <p className="text-lg">No menu items available at the moment.</p>
            <p className="text-sm text-slate-400 mt-1">Please contact restaurant administration.</p>
          </CardContent>
        </Card>
      )}

      
      {cart.size > 0 && !showOrderForm && (
        <div className="fixed bottom-6 left-4 right-4 z-40 lg:hidden">
          <Button
            onClick={() => setShowMobileBasket(true)}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black py-6 rounded-2xl shadow-2xl flex justify-between items-center px-6 transition-all duration-300 active:scale-95 cursor-pointer border-0"
          >
            <div className="flex items-center gap-2">
              <span className="bg-white text-orange-600 font-extrabold text-xs px-2.5 py-1 rounded-full flex items-center justify-center min-w-6 h-6 shadow-sm">
                {totalItemsCount}
              </span>
              <span className="text-sm uppercase tracking-wider font-bold">View Basket</span>
            </div>
            <span className="font-black text-base">${calculateTotal().toFixed(2)}</span>
          </Button>
        </div>
      )}

      
      {showMobileBasket && !showOrderForm && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-end justify-center lg:hidden animate-fade-in">
          <div className="absolute inset-0" onClick={() => setShowMobileBasket(false)} />
          <div className="bg-white w-full max-h-[85vh] rounded-t-3xl p-6 overflow-y-auto space-y-6 shadow-2xl relative z-10 animate-slide-up border-t border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBasket className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Your Basket</h3>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowMobileBasket(false)}
                className="rounded-full text-slate-400 hover:text-slate-900 font-bold px-3 py-1 cursor-pointer"
              >
                Close
              </Button>
            </div>

            
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1">
              {Array.from(cart.values()).map(({ item, quantity }) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="font-bold text-slate-800 text-sm truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="w-7 h-7 rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </Button>
                    <span className="font-extrabold text-slate-900 text-sm w-5 text-center">
                      {quantity}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleAddToCart(item)}
                      className="w-7 h-7 rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            
            <div className="bg-slate-50 rounded-xl p-3 flex gap-2.5 items-center border border-slate-100">
              <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span className="text-xs font-semibold text-slate-600 leading-snug">
                Estimated preparation time is <strong>15-25 minutes</strong>.
              </span>
            </div>

            
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-500">
                <span>Subtotal</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold text-slate-500">
                <span>Delivery Fee</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between items-center font-black text-xl text-slate-950">
                <span>Total</span>
                <span className="text-orange-500">${calculateTotal().toFixed(2)}</span>
              </div>

              <Button
                onClick={() => {
                  setShowMobileBasket(false);
                  setShowOrderForm(true);
                }}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base py-6 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/25 cursor-pointer flex gap-2 items-center justify-center border-0"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
