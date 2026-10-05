"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ShoppingCart, ArrowLeft, Check, ChevronDown, Coins, Star, BookOpen, Award, Package } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";
import { formatINR } from "@/lib/format";
import { categoryTheme, swatches } from "@/lib/theme";
import ProductCard from "@/components/store/ProductCard";
import Burst from "@/components/store/Burst";
import AskGrownUp from "@/components/store/AskGrownUp";
import { BRAND } from "@/lib/brand";

type ImageKey = "realistic" | "stylized";
const imageLabels: Record<ImageKey, string> = { realistic: "In use", stylized: "What's inside" };
const spring = { type: "spring", stiffness: 120, damping: 16 } as const;

export default function ProductDetailClient({ product, related }: { product: Product; related: Product[] }) {
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const [activeImage, setActiveImage] = useState<ImageKey>(product.images.realistic ? "realistic" : "stylized");
  const [added, setAdded] = useState(false);
  const [bursts, setBursts] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Phones: a sticky buy bar shows while the main Add to Cart button is off screen,
  // and steps aside once the visitor reaches the footer.
  const buyRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const buyInView = useInView(buyRef);
  // A huge top margin counts the marker as "seen" once it is anywhere above the
  // bottom of the screen, so the bar stays hidden over the footer.
  const endInView = useInView(endRef, { margin: "100000px 0px 0px 0px" });
  const soldOut = !product.inStock;
  const showBar = !buyInView && !endInView && !soldOut;

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setBursts((n) => n + 1);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 2500);
  };

  const theme = categoryTheme[product.category];
  const swatch = swatches[theme.swatch];
  const images = (["realistic", "stylized"] as const)
    .filter((key) => product.images[key])
    .map((key) => ({ key, src: product.images[key]!, label: imageLabels[key] }));
  const current = images.find((i) => i.key === activeImage) ?? images[0];

  const totalMaterialCost = product.materials.reduce((s, m) => s + m.cost, 0);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const included = [
    { icon: Package, swatch: swatches.sky, text: `${product.materials.length} materials, ready to use` },
    { icon: BookOpen, swatch: swatches.create, text: "Step-by-step guide book with video QR codes" },
    { icon: Award, swatch: swatches.design, text: `${BRAND.name} certificate after the final pitch` },
  ];

  return (
    <div className="pb-16 pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/#kits"
          className="clay-sm inline-flex min-h-11 items-center gap-1.5 rounded-full bg-panel px-4 py-2 font-display text-sm font-semibold text-ink transition-transform hover:-translate-x-0.5"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" /> All Kits
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-10 sm:mt-8 lg:grid-cols-12 lg:gap-14">
          {/* Gallery */}
          <motion.div
            initial={{ y: 20, rotate: -2 }}
            animate={{ y: 0, rotate: 0 }}
            transition={spring}
            className="lg:col-span-7"
          >
            <div className="clay rounded-[30px] bg-panel p-2.5 sm:rounded-[40px] sm:p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-panel-muted sm:rounded-[30px]">
                <Image
                  key={current.src}
                  src={current.src}
                  alt={`${product.name}: ${current.label.toLowerCase()}`}
                  fill
                  preload
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                />
              </div>
            </div>

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:flex sm:gap-4" role="group" aria-label="Product images">
                {images.map((img) => {
                  const isActive = img.key === current.key;
                  return (
                    <button
                      key={img.key}
                      type="button"
                      onClick={() => setActiveImage(img.key)}
                      aria-pressed={isActive}
                      className={`flex min-w-0 items-center gap-2.5 rounded-[22px] p-2 pr-3 transition-transform active:scale-95 sm:gap-3 sm:pr-4 ${
                        isActive ? `clay-pressed ${swatch.chip}` : "clay-sm bg-panel text-ink hover:-translate-y-0.5"
                      }`}
                    >
                      <span className="relative block h-12 w-14 shrink-0 overflow-hidden rounded-2xl sm:h-14 sm:w-20">
                        <Image src={img.src} alt="" fill sizes="80px" className="object-cover" />
                      </span>
                      <span className="truncate font-display text-[13px] font-semibold sm:text-sm">{img.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.08 }}
            className="lg:col-span-5"
          >
            <p className="flex flex-wrap items-center gap-2 text-sm font-bold">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${swatch.chip}`}>
                <theme.icon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                Ages {product.ageRange}
              </span>
              {soldOut && (
                <span className={`inline-flex items-center rounded-full px-3 py-1.5 ${swatches.create.chip}`}>Sold out</span>
              )}
              {product.badge && (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${swatches.sun.chip}`}>
                  <Star className="h-4 w-4 fill-current" strokeWidth={2} aria-hidden="true" />
                  {product.badge}
                </span>
              )}
            </p>
            <h1 className="mt-4 font-display text-[2.1rem] font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
              {product.name}
            </h1>
            <p className={`mt-3 font-display text-lg font-semibold sm:text-xl ${swatch.text}`}>{product.tagline}</p>
            <p className="mt-4 font-medium leading-relaxed text-ink-muted">{product.description}</p>

            <div ref={buyRef} className="clay mt-8 rounded-[28px] bg-panel p-5 sm:rounded-[32px] sm:p-6">
              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 tabular-nums">
                <span className="font-display text-4xl font-bold text-ink sm:text-5xl">{formatINR(product.price)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg font-semibold text-ink-muted line-through">
                      <span className="sr-only">was </span>
                      {formatINR(product.originalPrice)}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-sm font-bold ${swatches.create.chip}`}>
                      {discount}% off
                    </span>
                  </>
                )}
              </p>
              <p className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-accent-soft px-3 py-2 text-sm font-bold text-accent-ink sm:text-base">
                <Coins className="h-5 w-5 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                Your child can earn up to {formatINR(product.profit)} profit
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={soldOut}
                  className={`relative flex flex-1 items-center justify-center gap-2 rounded-[22px] py-4 font-display text-lg font-semibold transition-transform ${
                    soldOut
                      ? "clay-pressed cursor-not-allowed bg-panel-muted text-ink-muted"
                      : added
                        ? "clay-pressed bg-accent-soft text-accent-ink"
                        : "clay bg-accent text-on-accent hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                  }`}
                >
                  {soldOut ? null : added ? (
                    <Check className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
                  ) : (
                    <ShoppingCart className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                  )}
                  {soldOut ? "Sold Out" : added ? "Added to Cart" : "Add to Cart"}
                  <Burst fire={bursts} />
                </button>
                {added && (
                  <button
                    type="button"
                    onClick={() => setCartOpen(true)}
                    className="clay rounded-[22px] bg-sun px-6 py-4 font-display text-lg font-semibold text-on-sun transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    View Cart
                  </button>
                )}
              </div>
              <span className="sr-only" aria-live="polite">
                {added ? `${product.name} added to cart` : ""}
              </span>
              <AskGrownUp
                text={`Can I get the ${product.name} kit from ${BRAND.name}? ${product.tagline}.`}
                path={`/kits/${product.slug}`}
                className="mt-3 w-full"
              />
            </div>

            <ul className="mt-8 grid gap-3">
              {included.map((item) => (
                <li key={item.text} className="flex items-center gap-3 font-semibold text-ink">
                  <span className={`clay-sm flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.swatch.solid}`}>
                    <item.icon className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>

            <details className="clay group mt-8 rounded-[28px] bg-panel">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-[28px] px-5 py-4 font-display text-lg font-semibold text-ink sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
                What&apos;s in the Box ({product.materials.length} items)
                <span className="clay-sm flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-panel-muted">
                  <ChevronDown
                    className="h-5 w-5 transition-transform group-open:rotate-180"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                </span>
              </summary>
              <div className="px-5 pb-5 sm:px-6">
                <table className="w-full text-sm">
                  <caption className="sr-only">Materials included in the {product.name} kit</caption>
                  <thead>
                    <tr className="border-b-2 border-dashed border-line text-xs font-bold text-ink-muted">
                      <th scope="col" className="py-2 text-left">Material</th>
                      <th scope="col" className="py-2 pl-3 text-right">Qty</th>
                      <th scope="col" className="py-2 pl-3 text-right">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.materials.map((m) => (
                      <tr key={m.name}>
                        <td className="py-2 pr-2 font-medium text-ink">{m.name}</td>
                        <td className="whitespace-nowrap py-2 pl-3 text-right font-semibold tabular-nums text-ink-muted">
                          {m.quantity}
                        </td>
                        <td className="py-2 pl-3 text-right font-semibold tabular-nums text-ink-muted">
                          {formatINR(m.cost)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-dashed border-line">
                      <th scope="row" colSpan={2} className="pt-3 text-left font-display font-semibold text-ink">
                        Materials Total
                      </th>
                      <td className="pt-3 text-right font-display font-semibold tabular-nums text-ink">
                        {formatINR(totalMaterialCost)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </details>
          </motion.div>
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related-title" className="mt-16 sm:mt-24">
            <h2 id="related-title" className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              More Kits to <span className="marker">Explore</span>
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:mt-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
        <div ref={endRef} aria-hidden="true" className="h-px" />
      </div>

      <AnimatePresence>
        {showBar && (
          <motion.div
            initial={{ y: "120%" }}
            animate={{ y: 0 }}
            exit={{ y: "120%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
          >
            <div className="clay mx-auto flex max-w-xl items-center gap-3 rounded-[26px] bg-panel/95 p-2.5 pl-4 backdrop-blur-xl">
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-semibold text-ink">{product.name}</p>
                <p className="text-sm font-bold tabular-nums text-ink-muted">{formatINR(product.price)}</p>
              </div>
              <button
                type="button"
                onClick={handleAdd}
                className={`relative inline-flex min-h-12 shrink-0 items-center gap-2 rounded-[20px] px-5 font-display font-semibold transition-transform active:scale-95 ${
                  added ? "clay-pressed bg-accent-soft text-accent-ink" : "clay-sm bg-accent text-on-accent"
                }`}
              >
                {added ? (
                  <Check className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
                ) : (
                  <ShoppingCart className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                )}
                {added ? "Added" : "Add to Cart"}
                <Burst fire={bursts} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
