import Link from "next/link";
import { ProductCardActions } from "@/components/store/product-card-actions";
import { formatCurrency } from "@/lib/format";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    image: string;
    category: string;
    description: string;
    price: number;
    stock: number;
    rating?: number;
    reviewCount?: number;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <Link href={`/products/${product.slug}`} className="block">
        <img src={product.image} alt={product.name} className="h-52 w-full object-cover" />
      </Link>
      <div className="space-y-2 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">{product.category}</p>
        <Link href={`/products/${product.slug}`} className="line-clamp-1 font-semibold hover:underline">
          {product.name}
        </Link>
        <p className="line-clamp-2 text-sm text-slate-600">{product.description}</p>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-lg font-bold">{formatCurrency(product.price)}</p>
            <p className="text-xs text-slate-500">
              {product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}
            </p>
          </div>
          <ProductCardActions product={product} />
        </div>
      </div>
    </article>
  );
}
