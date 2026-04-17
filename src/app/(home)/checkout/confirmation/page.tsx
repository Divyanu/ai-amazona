import Link from "next/link";
import { Button } from "@/components/ui/button";

type ConfirmationPageProps = {
  searchParams: Promise<{ orderId?: string }>;
};

export default async function ConfirmationPage(props: ConfirmationPageProps) {
  const searchParams = await props.searchParams;
  const orderId = searchParams.orderId;

  return (
    <section className="mx-auto w-full max-w-2xl rounded-xl border bg-white p-8 text-center">
      <h1 className="text-3xl font-bold">Order Confirmed</h1>
      <p className="mt-3 text-slate-600">
        Thank you for your purchase. We have sent your order details to your email.
      </p>
      {orderId && (
        <p className="mt-2 text-sm text-slate-500">
          Order ID: <span className="font-medium">{orderId}</span>
        </p>
      )}
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/orders">
          <Button variant="outline">View Orders</Button>
        </Link>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </section>
  );
}
