"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Plus, Star, Coins } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import { formatINR } from "@/lib/format";
import { categoryTheme, swatches } from "@/lib/theme";

export default function ProductCard({ product, index }: { product: Product; index: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const theme = categoryTheme[product.category];
  const swatch = swatches[theme.swatch];
  const mainImage = product.images.realistic || product.images.stylized || "";
  const altImage = product.images.stylized && product.images.realistic ? product.images.stylized : null;

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1600);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 140, damping: 18, delay: Math.min(index, 4) * 0.06 }}
      className="group relative"
    >
      <div
        className={`clay flex h-full flex-col rounded-[32px] bg-panel p-3 transition-transform duration-300 group-hover:-translate-y-1.5 ${
          index % 2 === 0 ? "group-hover:-rotate-1" : "group-hover:rotate-1"
        }`}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-panel-muted">
          <Image
            src={mainImage}
            alt={`${product.name} kit`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {/* Hovering shows the flat-lay of what is in the box. */}
          {altImage && (
            <Image
              src={altImage}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
          <p className="flex min-h-7 flex-wrap items-center gap-1.5 text-xs font-bold">
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${swatch.chip}`}>
              <theme.icon className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
              Ages {product.ageRange}
            </span>
            {product.badge && (
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${swatches.sun.chip}`}>
                <Star className="h-3.5 w-3.5 fill-current" strokeWidth={2} aria-hidden="true" />
                {product.badge}
              </span>
            )}
          </p>

          <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-ink">
            {/* Stretched link: the whole card opens the kit, the add button sits above it. */}
            <Link
              href={`/kits/${product.slug}`}
              className="rounded-md after:absolute after:inset-0 after:rounded-[32px] after:content-['']"
            >
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 line-clamp-2 text-sm font-medium leading-relaxed text-ink-muted">{product.tagline}</p>

          <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-accent-ink">
            <Coins className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
            Earn up to {formatINR(product.profit)}
          </p>

          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
            <p className="flex items-baseline gap-1.5 tabular-nums">
              <span className="font-display text-2xl font-bold text-ink">{formatINR(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm font-semibold text-ink-muted line-through">
                  <span className="sr-only">was </span>
                  {formatINR(product.originalPrice)}
                </span>
              )}
            </p>

            <button
              type="button"
              onClick={handleAdd}
              aria-label={added ? `${product.name} added to cart` : `Add ${product.name} to cart`}
              className={`relative z-10 inline-flex shrink-0 items-center gap-1.5 rounded-2xl px-4 py-2.5 font-display font-semibold transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
                added ? "clay-pressed bg-accent-soft text-accent-ink" : "clay-sm bg-accent text-on-accent"
              }`}
            >
              {added ? (
                <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
              ) : (
                <Plus className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
              )}
              {added ? "Added" : "Add"}
            </button>
          </div>
          <span className="sr-only" aria-live="polite">
            {added ? `${product.name} added to cart` : ""}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
