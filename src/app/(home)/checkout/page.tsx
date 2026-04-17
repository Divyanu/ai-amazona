"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  const shipping = items.length > 0 ? 9.99 : 0;
  const total = subtotal + shipping;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    })
      .then((res) => res.json())
      .then(async (orderResult: { orderId?: string }) => {
        const checkoutResponse = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
        const checkoutData = (await checkoutResponse.json()) as {
          url: string | null;
          configured: boolean;
        };

        if (checkoutData.configured && checkoutData.url) {
          window.location.href = checkoutData.url;
          return;
        }

        clear();
        router.push(`/checkout/confirmation?orderId=${orderResult.orderId ?? ""}`);
      })
      .finally(() => setIsSubmitting(false));
  }

  return (
    <section className="grid w-full gap-6 lg:grid-cols-[1fr_320px]">
      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border bg-white p-6">
        <h1 className="text-2xl font-bold">Checkout</h1>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Full name</label>
            <input required className="w-full rounded-md border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input required type="email" className="w-full rounded-md border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Phone</label>
            <input required className="w-full rounded-md border px-3 py-2 text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Address</label>
            <input required className="w-full rounded-md border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">City</label>
            <input required className="w-full rounded-md border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Postal code</label>
            <input required className="w-full rounded-md border px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="rounded-lg border border-dashed p-3 text-sm text-slate-600">
          If Stripe keys are configured, checkout redirects to Stripe. Otherwise, this flow simulates
          successful payment and redirects to confirmation.
        </div>

        <Button type="submit" disabled={items.length === 0 || isSubmitting}>
          {isSubmitting ? "Placing order..." : "Place Order"}
        </Button>
      </form>

      <aside className="h-fit rounded-xl border bg-white p-4">
        <h2 className="text-lg font-semibold">Order Review</h2>
        <div className="mt-3 space-y-2 text-sm">
          {items.map((item) => (
            <p key={item.id} className="flex justify-between">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </p>
          ))}
          <div className="mt-2 border-t pt-2">
            <p className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </p>
            <p className="flex justify-between">
              <span>Shipping</span>
              <span>{formatCurrency(shipping)}</span>
            </p>
            <p className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </p>
          </div>
        </div>
      </aside>
    </section>
  );
}
