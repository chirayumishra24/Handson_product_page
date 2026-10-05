"use client";
import { useSyncExternalStore } from "react";
import { products, categories } from "@/data/products";
import ProductCard from "./ProductCard";
import { categoryTheme, swatches } from "@/lib/theme";

type Category = (typeof categories)[number]["value"];
const FILTER_EVENT = "kit-filter-change";

// The active filter lives in ?category= so it survives reloads and can be shared.
// Reading it through useSyncExternalStore keeps the server render (all kits) intact.
function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(FILTER_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(FILTER_EVENT, onChange);
  };
}

function readCategory(): Category {
  const value = new URLSearchParams(window.location.search).get("category");
  return categories.some((c) => c.value === value) ? (value as Category) : "all";
}

function setCategory(value: Category) {
  const url = new URL(window.location.href);
  if (value === "all") url.searchParams.delete("category");
  else url.searchParams.set("category", value);
  window.history.replaceState(window.history.state, "", url);
  window.dispatchEvent(new Event(FILTER_EVENT));
}

export default function ProductGrid() {
  const active = useSyncExternalStore(subscribe, readCategory, () => "all" as Category);
  const filtered = active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <section id="kits" className="py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-[2.1rem] font-bold leading-tight tracking-tight text-ink sm:text-5xl">
          Choose Your <span className="marker">Kit</span>
        </h2>
        <p className="mt-3 max-w-[60ch] text-base font-medium text-ink-muted sm:text-lg">
          {products.length} hands-on kits. Each one teaches your child to build, brand, price and sell a real product.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
          <div
            role="group"
            aria-label="Filter kits by category"
            className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 py-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:py-0 [&::-webkit-scrollbar]:hidden"
          >
            {categories.map((cat) => {
              const isActive = active === cat.value;
              const theme = categoryTheme[cat.value];
              const swatch = swatches[theme.swatch];
              return (
                <button
                  key={cat.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setCategory(cat.value)}
                  className={`inline-flex shrink-0 snap-start items-center gap-2 rounded-full py-2 pl-2 pr-5 font-display text-[15px] font-semibold transition-transform active:scale-95 ${
                    isActive ? `clay-pressed ${swatch.chip}` : "clay-sm bg-panel text-ink hover:-translate-y-0.5"
                  }`}
                >
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full ${swatch.solid}`}>
                    <theme.icon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  {cat.label}
                </button>
              );
            })}
          </div>
          <p className="text-sm font-semibold tabular-nums text-ink-muted" aria-live="polite">
            Showing {filtered.length} of {products.length} kits
          </p>
        </div>

        {filtered.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="clay mt-10 rounded-[32px] bg-panel px-6 py-16 text-center">
            <p className="font-display text-xl font-semibold text-ink">No kits in this category yet.</p>
            <button
              type="button"
              onClick={() => setCategory("all")}
              className="clay-sm mt-5 rounded-2xl bg-accent px-5 py-3 font-display font-semibold text-on-accent active:scale-95"
            >
              Show All Kits
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
