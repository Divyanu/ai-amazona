"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const slides = [
  {
    title: "Fresh Fashion Drops",
    subtitle: "Discover the latest t-shirts, jeans, and shoes.",
    cta: "Shop Now",
    href: "/products",
    image: "/images/category-tshirts.svg",
  },
  {
    title: "Weekend Sneaker Deals",
    subtitle: "Up to 30% off on selected shoes this week.",
    cta: "View Deals",
    href: "/products?category=shoes",
    image: "/images/category-shoes.svg",
  },
  {
    title: "New Season Denim",
    subtitle: "Relaxed and slim fits made for daily comfort.",
    cta: "Browse Jeans",
    href: "/products?category=jeans",
    image: "/images/category-jeans.svg",
  },
];

export function BannerCarousel() {
  const [index, setIndex] = useState(0);
  const current = useMemo(() => slides[index], [index]);

  useEffect(() => {
    const id = setInterval(() => setIndex((prev) => (prev + 1) % slides.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden rounded-xl border bg-white">
      <div className="grid gap-4 p-6 md:grid-cols-2 md:p-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Featured</p>
          <h2 className="text-3xl font-bold tracking-tight">{current.title}</h2>
          <p className="text-slate-600">{current.subtitle}</p>
          <Link href={current.href} className="inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm text-white">
            {current.cta}
          </Link>
        </div>
        <img src={current.image} alt={current.title} className="h-56 w-full rounded-lg object-cover" />
      </div>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, dotIndex) => (
          <button
            key={dotIndex}
            aria-label={`Go to slide ${dotIndex + 1}`}
            className={`h-2.5 w-2.5 rounded-full ${dotIndex === index ? "bg-slate-900" : "bg-slate-300"}`}
            onClick={() => setIndex(dotIndex)}
          />
        ))}
      </div>
    </section>
  );
}
