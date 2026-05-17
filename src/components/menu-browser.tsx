"use client";

import { MenuItem } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Plus, Minus } from "lucide-react";
import Image from "next/image";

interface MenuBrowserProps {
  items: MenuItem[];
  cart?: Map<
    string,
    {
      item: MenuItem;
      quantity: number;
    }
  >;
  onAdd?: (item: MenuItem) => void;
  onRemove?: (id: string) => void;
}

export default function MenuBrowser({
  items,
  cart = new Map(),
  onAdd,
  onRemove,
}: MenuBrowserProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const cats = new Map<string, MenuItem[]>();
    items.forEach((item) => {
      if (!cats.has(item.category)) {
        cats.set(item.category, []);
      }
      cats.get(item.category)!.push(item);
    });
    return Array.from(cats.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
  }, [items]);

  const filteredCategories = useMemo(() => {
    if (activeCategory === "all") return categories;
    return categories.filter(([category]) => category === activeCategory);
  }, [categories, activeCategory]);

  return (
    <div className="space-y-8">
      <div className="flex gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none sticky top-16 bg-slate-50/90 backdrop-blur-md z-10 -mx-4 px-4 sm:mx-0 sm:px-0">
        <Button
          size="sm"
          variant={activeCategory === "all" ? "default" : "outline"}
          onClick={() => setActiveCategory("all")}
          className={`rounded-full transition-all duration-300 font-medium ${
            activeCategory === "all"
              ? "bg-orange-500 hover:bg-orange-600 text-white border-transparent shadow-md shadow-orange-500/20 scale-105"
              : "border-slate-200 text-slate-600 hover:text-slate-900 bg-white"
          }`}
        >
          All Menu
        </Button>
        {categories.map(([category]) => (
          <Button
            key={category}
            size="sm"
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full transition-all duration-300 font-medium whitespace-nowrap ${
              activeCategory === category
                ? "bg-orange-500 hover:bg-orange-600 text-white border-transparent shadow-md shadow-orange-500/20 scale-105"
                : "border-slate-200 text-slate-600 hover:text-slate-900 bg-white"
            }`}
          >
            {category}
          </Button>
        ))}
      </div>

      
      <div className="space-y-12">
        {filteredCategories.map(([category, categoryItems]) => (
          <div key={category} className="space-y-5 scroll-mt-32">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{category}</h2>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-slate-200 to-transparent rounded-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryItems.map((item) => {
                const cartEntry = cart.get(item.id);
                const quantity = cartEntry?.quantity || 0;

                return (
                  <Card
                    key={item.id}
                    className={`overflow-hidden flex flex-col group border border-slate-100 bg-white/70 backdrop-blur-xs transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/5 hover:border-orange-100 ${
                      item.available
                        ? "opacity-100"
                        : "opacity-60 bg-slate-50"
                    }`}
                  >
                    
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      
                      <Image
                        width={400}
                        height={400}
                        src={item.image}
                        alt={item.name}
                        className="object-cover h-full w-full group-hover:scale-108 transition-transform duration-700 ease-out"
                      />
                      {!item.available && (
                        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-xs">
                          <span className="text-xs font-bold text-white bg-slate-900/90 px-3 py-1.5 rounded-full uppercase tracking-wider">
                            Sold Out
                          </span>
                        </div>
                      )}
                      {quantity > 0 && (
                        <div className="absolute top-3 right-3 bg-orange-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm shadow-md animate-bounce-subtle">
                          {quantity}
                        </div>
                      )}
                    </div>

                    
                    <CardHeader className="pb-1 pt-5 px-5">
                      <CardTitle className="text-lg text-slate-900 font-bold group-hover:text-orange-500 transition-colors duration-300">
                        {item.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between p-5 pt-1">
                      <p className="text-sm text-slate-500 mb-5 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-2xl font-black text-slate-900">
                          ${item.price.toFixed(2)}
                        </span>

                        
                        {item.available && onAdd && onRemove && (
                          <div className="flex items-center">
                            {quantity === 0 ? (
                              <Button
                                size="sm"
                                onClick={() => onAdd(item)}
                                className="bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white border border-orange-100 hover:border-transparent rounded-full font-bold transition-all duration-300 px-4 py-1.5 flex gap-1.5 items-center shadow-xs"
                              >
                                <Plus className="w-4 h-4" />
                                Add
                              </Button>
                            ) : (
                              <div className="flex items-center bg-orange-500 text-white rounded-full p-1 shadow-lg shadow-orange-500/25 border border-orange-400/20">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => onRemove(item.id)}
                                  className="w-8 h-8 rounded-full text-white hover:bg-orange-600 hover:text-white p-0 flex items-center justify-center cursor-pointer"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-8 text-center font-black text-sm">
                                  {quantity}
                                </span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => onAdd(item)}
                                  className="w-8 h-8 rounded-full text-white hover:bg-orange-600 hover:text-white p-0 flex items-center justify-center cursor-pointer"
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
