import { NextResponse } from "next/server";
import Stripe from "stripe";

type CheckoutItem = {
  name: string;
  image: string;
  quantity: number;
  price: number;
};

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ url: null, configured: false });
  }

  const stripe = new Stripe(secretKey);
  const { items } = (await request.json()) as { items: CheckoutItem[] };

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    success_url: `${baseUrl}/checkout/confirmation`,
    cancel_url: `${baseUrl}/checkout`,
    line_items: items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.name,
          images: item.image ? [`${baseUrl}${item.image}`] : undefined,
        },
      },
    })),
  });

  return NextResponse.json({ url: session.url, configured: true });
}
