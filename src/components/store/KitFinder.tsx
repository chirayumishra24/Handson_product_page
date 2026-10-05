"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Wand2, ArrowRight } from "lucide-react";
import { products } from "@/data/products";
import type { Product } from "@/types/product";
import { categoryTheme, swatches } from "@/lib/theme";
import { formatINR } from "@/lib/format";

const ages = [
  { label: "8 to 9", min: 8, max: 9 },
  { label: "10 to 12", min: 10, max: 12 },
  { label: "13 to 16", min: 13, max: 16 },
];

const interests: { category: Product["category"]; label: string }[] = [
  { category: "grow", label: "Growing plants" },
  { category: "build", label: "Building & gadgets" },
  { category: "create", label: "Making & crafting" },
  { category: "design", label: "Drawing & ideas" },
];

// "10-16" -> [10, 16]
const ageSpan = (p: Product) => p.ageRange.split("-").map(Number) as [number, number];
const fitsAge = (p: Product, a: (typeof ages)[number]) => {
  const [lo, hi] = ageSpan(p);
  return lo <= a.max && hi >= a.min;
};

function recommend(age: (typeof ages)[number], category: Product["category"]) {
  const exact = products.filter((p) => p.category === category && fitsAge(p, age));
  if (exact.length) return { exact: true, kits: exact };
  return { exact: false, kits: products.filter((p) => fitsAge(p, age)).slice(0, 3) };
}

export default function KitFinder() {
  const [age, setAge] = useState<(typeof ages)[number] | null>(null);
  const [interest, setInterest] = useState<Product["category"] | null>(null);
  const result = age && interest ? recommend(age, interest) : null;

  const reset = () => {
    setAge(null);
    setInterest(null);
  };

  return (
    <section aria-labelledby="finder-title" className="px-3 py-6 sm:px-5 md:py-10">
      <div className="clay mx-auto max-w-7xl rounded-[32px] bg-sun-soft px-4 py-10 sm:rounded-[44px] sm:px-10 sm:py-14 lg:px-14">
        <div className="flex items-start gap-4">
          <span className="clay-sm hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sun text-ink sm:flex">
            <Wand2 className="h-7 w-7" strokeWidth={2.5} aria-hidden="true" />
          </span>
          <div>
            <h2 id="finder-title" className="font-display text-[2.1rem] font-bold leading-tight tracking-tight text-ink sm:text-5xl">
              Find Your Kit
            </h2>
            <p className="mt-2 text-base font-medium text-ink-muted sm:text-lg">
              Not sure where to start? Two taps and we&apos;ll pick for you.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <fieldset>
            <legend className="font-display text-lg font-semibold text-ink">1. How old is your child?</legend>
            <div className="mt-3 flex flex-wrap gap-3">
              {ages.map((a) => {
                const active = age?.label === a.label;
                return (
                  <button
                    key={a.label}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setAge(a)}
                    className={`min-h-12 rounded-2xl px-5 font-display text-base font-semibold transition-transform active:scale-95 ${
                      active ? "clay-pressed bg-sun text-ink" : "clay-sm bg-panel text-ink hover:-translate-y-0.5"
                    }`}
                  >
                    {a.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-display text-lg font-semibold text-ink">2. What do they love most?</legend>
            <div className="mt-3 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
              {interests.map((it) => {
                const active = interest === it.category;
                const theme = categoryTheme[it.category];
                const sw = swatches[theme.swatch];
                return (
                  <button
                    key={it.category}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setInterest(it.category)}
                    className={`flex min-h-12 items-center gap-3 rounded-2xl p-2 pr-4 text-left font-display font-semibold transition-transform active:scale-95 ${
                      active ? `clay-pressed ${sw.chip}` : "clay-sm bg-panel text-ink hover:-translate-y-0.5"
                    }`}
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${sw.solid}`}>
                      <theme.icon className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                    </span>
                    {it.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div aria-live="polite">
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                key={`${age?.label}-${interest}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: "spring", stiffness: 160, damping: 20 }}
                className="mt-10"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display text-2xl font-bold text-ink">
                    {result.exact
                      ? result.kits.length === 1
                        ? "We found the perfect kit!"
                        : `We found ${result.kits.length} great kits!`
                      : "Great picks for this age"}
                  </h3>
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 font-display font-semibold text-ink-muted hover:text-ink"
                  >
                    <RotateCcw className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                    Start Over
                  </button>
                </div>
                {!result.exact && (
                  <p className="mt-1 font-medium text-ink-muted">
                    Our {interests.find((i) => i.category === interest)?.label.toLowerCase()} kits are for older
                    kids, so here are the best fits for ages {age?.label}.
                  </p>
                )}

                <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {result.kits.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/kits/${p.slug}`}
                        className="clay group flex items-center gap-4 rounded-[24px] bg-panel p-3 transition-transform hover:-translate-y-1"
                      >
                        <span className="relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl bg-panel-muted">
                          <Image
                            src={p.images.realistic || p.images.stylized || ""}
                            alt=""
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-lg font-semibold leading-tight text-ink">{p.name}</span>
                          <span className="mt-1 block text-sm font-semibold text-ink-muted">
                            Ages {p.ageRange}, {formatINR(p.price)}
                          </span>
                          <span className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-accent-ink">
                            See kit
                            <ArrowRight
                              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                              strokeWidth={2.5}
                              aria-hidden="true"
                            />
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
