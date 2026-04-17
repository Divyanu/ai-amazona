import Link from "next/link";
import { BannerCarousel } from "@/components/store/banner-carousel";
import { ProductCard } from "@/components/store/product-card";
import { getLatestProducts, type StoreProduct } from "@/lib/storefront";

export default async function HomePage() {
  const latestProducts = await getLatestProducts(6);

  return (
    <div className="w-full space-y-8">
      <BannerCarousel />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Latest Products</h2>
          <Link href="/products" className="text-sm font-medium text-slate-700 hover:underline">
            View all products
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latestProducts.map((product: StoreProduct) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
