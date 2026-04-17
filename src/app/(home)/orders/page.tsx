import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/format";

function getOrdersByUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export default async function OrdersPage() {
  const session = await auth();
  const userId = session?.user?.id;

  type OrderWithItems = Awaited<ReturnType<typeof getOrdersByUser>>[number];

  const orders: OrderWithItems[] = userId
    ? await getOrdersByUser(userId)
    : [];

  return (
    <section className="w-full space-y-4">
      <h1 className="text-2xl font-bold">Order History</h1>
      {orders.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-sm text-slate-600">
          No orders yet. Place your first order from checkout.
        </div>
      ) : (
        orders.map((order: OrderWithItems) => (
          <article key={order.id} className="rounded-xl border bg-white p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">Order #{order.id.slice(-8).toUpperCase()}</p>
              <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="space-y-2 text-sm">
              {order.items.map((item: OrderWithItems["items"][number]) => (
                <p key={item.id} className="flex justify-between">
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>{formatCurrency(Number(item.unitPrice) * item.quantity)}</span>
                </p>
              ))}
            </div>
            <div className="mt-3 border-t pt-3 text-sm">
              <p className="flex justify-between">
                <span>Status</span>
                <span className="font-medium">{order.status}</span>
              </p>
              <p className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(Number(order.totalAmount))}</span>
              </p>
            </div>
          </article>
        ))
      )}
    </section>
  );
}
