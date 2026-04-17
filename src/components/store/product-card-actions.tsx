"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

type ProductActionsProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    image: string;
    price: number;
    stock: number;
  };
};

export function ProductCardActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Button
      size="sm"
      disabled={product.stock <= 0}
      onClick={() => {
        addItem({
          id: product.id,
          slug: product.slug,
          name: product.name,
          image: product.image,
          price: product.price,
        });
        router.push("/cart");
      }}
    >
      Add to Cart
    </Button>
  );
}
