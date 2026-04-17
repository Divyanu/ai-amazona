import Link from "next/link";
import { ProductCard } from "@/components/store/product-card";
import { getCatalog, getCategories } from "@/lib/storefront";

type ProductsPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    min?: string;
    max?: string;
    rating?: string;
    inStock?: string;
    sort?: string;
    page?: string;
  }>;
};

const PAGE_SIZE = 6;

export default async function ProductsPage(props: ProductsPageProps) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page ?? "1");
  const min = searchParams.min ? Number(searchParams.min) : undefined;
  const max = searchParams.max ? Number(searchParams.max) : undefined;
  const minRating = searchParams.rating ? Number(searchParams.rating) : 0;
  const inStockOnly = searchParams.inStock === "1";
  const sort = searchParams.sort ?? "latest";

  const [categories, allProducts] = await Promise.all([
    getCategories(),
    getCatalog({
      query: searchParams.q,
      category: searchParams.category,
      min,
      max,
    }),
  ]);

  const filteredProducts = allProducts
    .filter((product) => (inStockOnly ? product.stock > 0 : true))
    .filter((product) => (minRating > 0 ? product.rating >= minRating : true))
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating-desc") return b.rating - a.rating;
      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const products = filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);

  const buildQuery = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const all: Record<string, string | undefined> = {
      q: searchParams.q,
      category: searchParams.category,
      min: searchParams.min,
      max: searchParams.max,
      rating: searchParams.rating,
      inStock: searchParams.inStock,
      sort: searchParams.sort,
      ...overrides,
    };

    Object.entries(all).forEach(([key, value]) => {
      if (value && value.length > 0) params.set(key, value);
    });

    return params.toString();
  };

  return (
    <section className="grid w-full gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-6 rounded-xl border bg-white p-4">
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Search</h2>
          <form className="space-y-2">
            <input
              type="text"
              name="q"
              defaultValue={searchParams.q ?? ""}
              placeholder="Search products"
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                name="min"
                defaultValue={searchParams.min ?? ""}
                placeholder="Min $"
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
              <input
                type="number"
                name="max"
                defaultValue={searchParams.max ?? ""}
                placeholder="Max $"
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
            </div>
            <select
              name="rating"
              defaultValue={searchParams.rating ?? ""}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="">Any rating</option>
              <option value="4">4★ & above</option>
              <option value="3">3★ & above</option>
              <option value="2">2★ & above</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="inStock"
                value="1"
                defaultChecked={searchParams.inStock === "1"}
              />
              In-stock items only
            </label>
            <select
              name="sort"
              defaultValue={sort}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="latest">Latest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Top Rated</option>
            </select>
            <button className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm text-white">Apply</button>
            <Link href="/products" className="block text-center text-xs text-slate-500 hover:underline">
              Clear filters
            </Link>
          </form>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Categories</h2>
          <div className="space-y-2 text-sm">
            <Link href="/products" className={`block rounded px-2 py-1 hover:bg-slate-100 ${!searchParams.category ? "bg-slate-100 font-medium" : ""}`}>
              All categories
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?${buildQuery({ category: category.slug, page: undefined })}`}
                className={`block rounded px-2 py-1 hover:bg-slate-100 ${searchParams.category === category.slug ? "bg-slate-100 font-medium" : ""}`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </aside>

      <div className="space-y-4">
        <div className="rounded-xl border bg-white p-4 text-sm text-slate-600">
          {filteredProducts.length} result(s)
          {searchParams.q ? ` for "${searchParams.q}"` : ""}
          {searchParams.category ? ` in ${searchParams.category}` : ""}
        </div>

        {products.length === 0 ? (
          <div className="rounded-xl border bg-white p-8 text-center text-sm text-slate-600">
            No products found for your current filters.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, index) => {
            const targetPage = index + 1;

            return (
              <Link
                key={targetPage}
                href={`/products?${buildQuery({ page: String(targetPage) })}`}
                className={`rounded-md border px-3 py-1.5 text-sm ${targetPage === currentPage ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-50"}`}
              >
                {targetPage}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
