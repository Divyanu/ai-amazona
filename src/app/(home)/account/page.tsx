import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function AccountPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [orderCount, reviewCount] = userId
    ? await Promise.all([
        prisma.order.count({ where: { userId } }),
        prisma.review.count({ where: { userId } }),
      ])
    : [0, 0];

  return (
    <section className="w-full space-y-6">
      <div className="rounded-xl border bg-white p-6">
        <h1 className="text-2xl font-bold">My Account</h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage your profile, addresses, wishlist, and order history.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-slate-500">Name</p>
          <p className="font-semibold">{session?.user?.name ?? "Customer"}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-slate-500">Email</p>
          <p className="font-semibold">{session?.user?.email ?? "Not available"}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-slate-500">Orders</p>
          <p className="font-semibold">{orderCount}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-slate-500">Reviews</p>
          <p className="font-semibold">{reviewCount}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border bg-white p-6">
          <h2 className="mb-2 text-lg font-semibold">Saved Addresses</h2>
          <p className="text-sm text-slate-600">
            Address book support will be wired to database-backed profiles in the next iteration.
          </p>
        </article>

        <article className="rounded-xl border bg-white p-6">
          <h2 className="mb-2 text-lg font-semibold">Wishlist</h2>
          <p className="text-sm text-slate-600">
            Wishlist management is prepared in the dashboard flow and will be connected to persistent
            storage soon.
          </p>
        </article>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-3 text-lg font-semibold">Quick Links</h2>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/orders" className="rounded-md border px-3 py-2 hover:bg-slate-50">
            View Orders
          </Link>
          <Link href="/products" className="rounded-md border px-3 py-2 hover:bg-slate-50">
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
