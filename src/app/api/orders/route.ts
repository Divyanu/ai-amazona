import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type CheckoutItem = {
  id: string;
  quantity: number;
  price: number;
};

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { items: CheckoutItem[] };
  const items = body.items ?? [];

  if (items.length === 0) {
    return NextResponse.json({ error: "No items provided" }, { status: 400 });
  }

  const productIds = items.map((item) => item.id);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  const productMap = new Map(products.map((product) => [product.id, product]));

  const normalizedItems = items
    .map((item) => {
      const product = productMap.get(item.id);
      if (!product) return null;
      return {
        productId: product.id,
        quantity: Math.max(1, item.quantity),
        unitPrice: product.price,
      };
    })
    .filter((item): item is { productId: string; quantity: number; unitPrice: typeof products[number]["price"] } => Boolean(item));

  if (normalizedItems.length === 0) {
    return NextResponse.json({ error: "No valid products found" }, { status: 400 });
  }

  const totalAmount = normalizedItems.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0,
  );

  const order = await prisma.order.create({
    data: {
      userId,
      status: "PAID",
      totalAmount,
      items: {
        create: normalizedItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      },
    },
  });

  return NextResponse.json({ orderId: order.id });
}
