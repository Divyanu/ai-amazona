import { prisma } from "@/lib/prisma";

export type StoreProduct = {
  id: string;
  name: string;
  slug: string;
  image: string;
  category: string;
  categorySlug?: string;
  description: string;
  price: number;
  stock: number;
  rating: number;
  reviewCount: number;
};

export type ProductReview = {
  id: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: Date;
};

export type ProductDetails = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  price: number;
  stock: number;
  category: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  reviews: ProductReview[];
  relatedProducts: Array<{
    id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    category: string;
    rating: number;
  }>;
};

export async function getLatestProducts(limit = 6): Promise<StoreProduct[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true, reviews: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return products.map((product): StoreProduct => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    image: product.image ?? "/images/product-tshirt-classic.svg",
    category: product.category.name,
    description: product.description ?? "",
    price: Number(product.price),
    stock: product.stock,
    rating: product.reviews.length
      ? product.reviews.reduce((acc: number, review) => acc + review.rating, 0) / product.reviews.length
      : 0,
    reviewCount: product.reviews.length,
  }));
}

export async function getCatalog(params: {
  query?: string;
  category?: string;
  min?: number;
  max?: number;
}): Promise<StoreProduct[]> {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      name: params.query ? { contains: params.query, mode: "insensitive" } : undefined,
      category: params.category ? { slug: params.category } : undefined,
      price:
        params.min !== undefined || params.max !== undefined
          ? {
              gte: params.min,
              lte: params.max,
            }
          : undefined,
    },
    include: { category: true, reviews: true },
    orderBy: { createdAt: "desc" },
  });

  return products.map((product): StoreProduct => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    image: product.image ?? "/images/product-tshirt-classic.svg",
    category: product.category.name,
    categorySlug: product.category.slug,
    description: product.description ?? "",
    price: Number(product.price),
    stock: product.stock,
    rating: product.reviews.length
      ? product.reviews.reduce((acc: number, review) => acc + review.rating, 0) / product.reviews.length
      : 0,
    reviewCount: product.reviews.length,
  }));
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getProductBySlug(slug: string): Promise<ProductDetails | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) return null;

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    take: 4,
    include: { reviews: true, category: true },
  });

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    image: product.image ?? "/images/product-tshirt-classic.svg",
    description: product.description ?? "",
    price: Number(product.price),
    stock: product.stock,
    category: product.category,
    reviews: product.reviews.map((review): ProductReview => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment ?? "",
      userName: review.user.name ?? "Anonymous",
      createdAt: review.createdAt,
    })),
    relatedProducts: relatedProducts.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      image: item.image ?? "/images/product-tshirt-classic.svg",
      price: Number(item.price),
      category: item.category.name,
      rating: item.reviews.length
        ? item.reviews.reduce((acc: number, review) => acc + review.rating, 0) / item.reviews.length
        : 0,
    })),
  };
}
