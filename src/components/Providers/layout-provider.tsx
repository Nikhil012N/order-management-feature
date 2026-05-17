import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { Button } from "../ui/button";
import { ErrorBoundary } from "@/components/ErrorBoundary/react-error-boundary";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-85 transition-opacity">
            <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
            <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">FoodFlow</span>
          </Link>

          
          <div className="flex items-center gap-1 sm:gap-3">
            <Link href="/customer">
              <Button variant="ghost" size="sm" className="font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs sm:text-sm h-9 px-2 sm:px-3 cursor-pointer">
                Menu
              </Button>
            </Link>
            <Link href="/customer/orders">
              <Button variant="ghost" size="sm" className="font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs sm:text-sm h-9 px-2 sm:px-3 cursor-pointer">
                Orders
              </Button>
            </Link>
            <Link href="/admin">
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm h-9 px-3 sm:px-4 cursor-pointer border-0 rounded-lg shadow-xs transition-all">
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-600 text-sm">
        <p>FoodFlow Order Management System &copy; {new Date().getFullYear()}.</p>
      </div>
    </footer>
  );
};

const LayoutProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Header />
      <ErrorBoundary>
        <main className="min-h-200 bg-linear-to-b from-background to-slate-50 flex flex-col">{children}</main>
      </ErrorBoundary>
      <Footer />
    </>
  );
};

export default LayoutProvider;
