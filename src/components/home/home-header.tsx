import Link from "next/link";
import { Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderCartButton } from "@/components/home/header-cart-button";

const categories = ["Today's Deals", "Customer Service", "Registry", "Gift Cards", "Sell"];

export function HomeHeader() {
  return (
    <header className="sticky top-0 z-30 w-full">
      <div className="bg-slate-950 text-white">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3">
          <Link href="/" className="text-lg font-bold tracking-wide">
            AMAZONA
          </Link>

          <form
            action="/products"
            className="hidden items-center gap-2 rounded-md border border-slate-700 bg-white/5 px-3 py-2 text-sm text-slate-300 md:flex"
          >
            <Search className="h-4 w-4" />
            <input
              name="q"
              aria-label="Search products"
              className="w-80 bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
              placeholder="Search products..."
            />
          </form>

          <div className="ml-auto flex items-center gap-2">
            <Link href="/account">
              <Button variant="ghost" size="sm" className="text-white hover:bg-slate-800">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Account</span>
              </Button>
            </Link>
            <HeaderCartButton />
          </div>
        </div>
      </div>

      <div className="border-b bg-slate-900 text-slate-100">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-2 text-sm">
          <button className="inline-flex items-center gap-2 font-medium">
            <Menu className="h-4 w-4" />
            All
          </button>
          <nav className="hidden gap-4 md:flex">
            {categories.map((category) => (
              <Link key={category} href="/products" className="hover:text-white">
                {category}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
