"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

type ProductDetailActionsProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    image: string;
    price: number;
    stock: number;
  };
};

export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  return (
    <div className="flex gap-2">
      <Button
        disabled={product.stock <= 0}
        onClick={() =>
          addItem({
            id: product.id,
            slug: product.slug,
            name: product.name,
            image: product.image,
            price: product.price,
          })
        }
      >
        Add to Cart
      </Button>
      <Button
        variant="outline"
        disabled={product.stock <= 0}
        onClick={() => {
          addItem({
            id: product.id,
            slug: product.slug,
            name: product.name,
            image: product.image,
            price: product.price,
          });
          router.push("/checkout");
        }}
      >
        Buy Now
      </Button>
    </div>
  );
}
