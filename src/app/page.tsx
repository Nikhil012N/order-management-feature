"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShieldAlert } from "lucide-react";

export default function Home() {
  return (
    <section className="flex-1 flex flex-col items-center justify-center p-4  bg-linear-to-b from-slate-50 to-slate-100/50">
      <div className="max-w-5xl w-full text-center space-y-12">
        
        
        <div className="space-y-4 max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Seamless Order <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Management Flow
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Welcome to FoodFlow. A high-performance, real-time platform engineered to bridge menu browsing, instant checkout, and automatic kitchen dispatch.
          </p>
        </div>

        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          <Card className="border border-slate-100 bg-white/80 backdrop-blur-md shadow-xl hover:shadow-2xl hover:border-orange-200/50 hover:shadow-orange-500/5 transition-all duration-500 rounded-3xl group text-left overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-6 -mt-6 group-hover:scale-150 transition-transform duration-700" />
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-extrabold text-slate-900 group-hover:text-orange-500 transition-colors duration-300">Customer Portal</CardTitle>
                  <CardDescription className="font-semibold text-slate-400 mt-0.5">Order & track live updates</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-0">
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                Browse our visual menu, select item quantities directly on the grid, and checkout securely. Experience fully automatic status updates simulated in real-time.
              </p>
              <div className="flex gap-3 flex-col sm:flex-row">
                <Link href="/customer" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black py-5.5 rounded-full transition-all duration-300 shadow-md shadow-orange-500/10 cursor-pointer">
                    Order Delicious Food
                  </Button>
                </Link>
                <Link href="/customer/orders">
                  <Button variant="outline" className="w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full font-bold py-5.5 px-6 cursor-pointer">
                    Track Orders
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          
          <Card className="border border-slate-100 bg-white/80 backdrop-blur-md shadow-xl hover:shadow-2xl hover:border-amber-200/50 hover:shadow-amber-500/5 transition-all duration-500 rounded-3xl group text-left overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-6 -mt-6 group-hover:scale-150 transition-transform duration-700" />
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-extrabold text-slate-900 group-hover:text-amber-500 transition-colors duration-300">Admin Dashboard</CardTitle>
                  <CardDescription className="font-semibold text-slate-400 mt-0.5">Manage live store operations</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-0">
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                Take control of store operations. Track sales metrics, view comprehensive order listings, update statuses instantly, and manage restaurant analytics in real-time.
              </p>
              <Link href="/admin" className="block w-full">
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5.5 rounded-full transition-all duration-300 cursor-pointer">
                  Go to Management Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

      
      </div>
    </section>
  );
}
