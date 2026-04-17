"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <section className="grid w-full gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        {items.length === 0 ? (
          <div className="rounded-xl border bg-white p-6 text-sm text-slate-600">
            Your cart is empty.{" "}
            <Link href="/products" className="font-medium text-slate-900 underline">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <article key={item.id} className="flex gap-4 rounded-xl border bg-white p-4">
                <img src={item.image} alt={item.name} className="h-24 w-24 rounded-md object-cover" />
                <div className="flex flex-1 items-start justify-between gap-4">
                  <div>
                    <Link href={`/products/${item.slug}`} className="font-medium hover:underline">
                      {item.name}
                    </Link>
                    <p className="text-sm text-slate-600">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                      className="w-16 rounded border px-2 py-1 text-sm"
                    />
                    <Button variant="outline" size="sm" onClick={() => removeItem(item.id)}>
                      Remove
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <aside className="h-fit rounded-xl border bg-white p-4">
        <h2 className="text-lg font-semibold">Order Summary</h2>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{subtotal > 0 ? formatCurrency(9.99) : formatCurrency(0)}</span>
          </div>
        </div>
        <div className="mt-4 border-t pt-4">
          <p className="mb-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatCurrency(subtotal > 0 ? subtotal + 9.99 : 0)}</span>
          </p>
          <Link href="/checkout" className="block">
            <Button className="w-full" disabled={items.length === 0}>
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </aside>
    </section>
  );
}
