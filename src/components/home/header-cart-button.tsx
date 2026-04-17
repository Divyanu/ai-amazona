"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

export function HeaderCartButton() {
  const itemCount = useCartStore((state) =>
    state.items.reduce((count, item) => count + item.quantity, 0),
  );

  return (
    <Link href="/cart">
      <Button variant="ghost" size="sm" className="text-white hover:bg-slate-800">
        <ShoppingCart className="h-4 w-4" />
        <span className="hidden sm:inline">Cart ({itemCount})</span>
      </Button>
    </Link>
  );
}
