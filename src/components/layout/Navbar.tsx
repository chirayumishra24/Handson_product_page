"use client";
import { ShoppingCart, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useHydrated } from "@/lib/useHydrated";
import Logo from "./Logo";

const links = [
  { href: "/#kits", label: "Kits", hover: "hover:bg-grow-soft hover:text-grow-ink" },
  { href: "/#how-it-works", label: "How It Works", hover: "hover:bg-build-soft hover:text-build-ink" },
  { href: "/#compare", label: "Compare", hover: "hover:bg-design-soft hover:text-design-ink" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const count = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const hydrated = useHydrated();

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const cartLabel = hydrated && count > 0 ? `Open cart, ${count} ${count === 1 ? "item" : "items"}` : "Open cart";

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5">
      <div className="clay mx-auto max-w-7xl rounded-[28px] bg-panel/90 backdrop-blur-xl">
        <nav aria-label="Main" className="flex h-16 items-center justify-between pl-3 pr-2 sm:pl-4">
          <Logo onClick={() => setMobileOpen(false)} />

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`rounded-2xl px-4 py-2 font-display text-[15px] font-semibold text-ink-muted transition-colors ${l.hover}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleCart}
              aria-label={cartLabel}
              className="clay-sm relative flex h-12 w-12 items-center justify-center rounded-2xl bg-sun text-ink transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
              {hydrated && count > 0 && (
                <span
                  key={count}
                  aria-hidden="true"
                  className="animate-pop absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-panel bg-create px-1 font-display text-xs font-bold tabular-nums text-white"
                >
                  {count}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="clay-sm flex h-12 w-12 items-center justify-center rounded-2xl bg-panel-muted text-ink md:hidden"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <ul id="mobile-menu" className="grid gap-1 px-3 pb-3 md:hidden">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-2xl px-4 py-3 font-display text-lg font-semibold text-ink ${l.hover}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}
