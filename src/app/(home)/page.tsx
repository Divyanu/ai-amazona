import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <section className="grid w-full gap-6 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Welcome to Amazona</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Your customer storefront shell is ready. Next up: homepage sections (banner carousel and
          latest products), catalog filters, and product detail pages.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-600">
          <p>Browse products by category.</p>
          <p>Sign in to view account and orders.</p>
          <p>Track cart and checkout journey.</p>
        </CardContent>
      </Card>
    </section>
  );
}
