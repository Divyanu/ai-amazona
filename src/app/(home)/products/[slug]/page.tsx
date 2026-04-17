import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/product-card";
import { ProductDetailActions } from "@/components/store/product-detail-actions";
import { formatCurrency } from "@/lib/format";
import { getProductBySlug } from "@/lib/storefront";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage(props: ProductPageProps) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="w-full space-y-8">
      <section className="grid gap-6 rounded-xl border bg-white p-6 md:grid-cols-2">
        <div>
          <img src={product.image} alt={product.name} className="h-80 w-full rounded-lg object-cover" />
        </div>
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-slate-500">{product.category.name}</p>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-slate-600">{product.description}</p>
          <p className="text-2xl font-bold">{formatCurrency(product.price)}</p>
          <p className="text-sm text-slate-600">
            {product.stock > 0 ? `In stock (${product.stock})` : "Currently out of stock"}
          </p>
          <ProductDetailActions
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              image: product.image,
              price: product.price,
              stock: product.stock,
            }}
          />
        </div>
      </section>

      <section className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">Reviews & Ratings</h2>
        {product.reviews.length === 0 ? (
          <p className="text-sm text-slate-600">No reviews yet. Be the first to review this product.</p>
        ) : (
          <div className="space-y-3">
            {product.reviews.map((review) => (
              <article key={review.id} className="rounded-lg border p-3">
                <div className="mb-1 flex items-center justify-between">
                  <p className="font-medium">{review.userName}</p>
                  <p className="text-sm text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="text-sm text-amber-500">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
                <p className="text-sm text-slate-700">{review.comment}</p>
              </article>
            ))}
          </div>
        )}

        <form
          action={async (formData) => {
            "use server";
            const session = await auth();
            if (!session?.user?.id) return;

            const rating = Number(formData.get("rating"));
            const comment = String(formData.get("comment") ?? "");

            if (rating < 1 || rating > 5) return;

            await prisma.review.upsert({
              where: {
                userId_productId: {
                  userId: session.user.id,
                  productId: product.id,
                },
              },
              create: {
                userId: session.user.id,
                productId: product.id,
                rating,
                comment,
              },
              update: {
                rating,
                comment,
              },
            });

            revalidatePath(`/products/${product.slug}`);
          }}
          className="mt-4 space-y-2 rounded-lg border p-3"
        >
          <h3 className="text-sm font-semibold">Add your review</h3>
          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="rating">Rating</label>
            <select id="rating" name="rating" defaultValue="5" className="rounded border px-2 py-1">
              <option value="5">5 stars</option>
              <option value="4">4 stars</option>
              <option value="3">3 stars</option>
              <option value="2">2 stars</option>
              <option value="1">1 star</option>
            </select>
          </div>
          <textarea
            name="comment"
            rows={3}
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="Share your experience with this product"
          />
          <button type="submit" className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">
            Submit Review
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Related Products</h2>
          <Link href={`/products?category=${product.category.slug}`} className="text-sm hover:underline">
            View category
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {product.relatedProducts.map((related) => (
            <div key={related.id} className="min-w-[260px] flex-1">
              <ProductCard
                key={related.id}
                product={{
                  id: related.id,
                  name: related.name,
                  slug: related.slug,
                  image: related.image,
                  category: related.category,
                  description: "",
                  price: related.price,
                  stock: 1,
                  rating: related.rating,
                  reviewCount: 0,
                }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
