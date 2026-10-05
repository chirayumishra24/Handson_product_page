"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatINR } from "@/lib/format";
import { BRAND } from "@/lib/brand";
import AskGrownUp from "@/components/store/AskGrownUp";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function CartDrawer() {
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, clearCart } = useCartStore();
  const [confirmClear, setConfirmClear] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const close = () => {
    setConfirmClear(false);
    setCartOpen(false);
  };

  // While open: lock page scroll, move focus into the drawer, trap Tab, close on Escape,
  // and hand focus back to whatever opened it.
  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setConfirmClear(false);
        setCartOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus();
    };
  }, [isOpen, setCartOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden="true"
            className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            className="clay fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col bg-panel sm:right-3 sm:top-3 sm:h-[calc(100dvh-1.5rem)] sm:rounded-[36px]"
          >
            <div className="flex items-center justify-between px-5 pb-3 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-6">
              <h2 id="cart-title" className="font-display text-2xl font-bold text-ink">
                Your Cart{" "}
                {count > 0 && (
                  <span className="text-base font-semibold tabular-nums text-ink-muted">
                    ({count} {count === 1 ? "item" : "items"})
                  </span>
                )}
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close cart"
                className="clay-sm flex h-11 w-11 items-center justify-center rounded-2xl bg-panel-muted text-ink transition-transform active:scale-95"
              >
                <X className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="clay animate-float flex h-20 w-20 items-center justify-center rounded-[26px] bg-sun text-on-sun">
                    <ShoppingBag className="h-9 w-9" strokeWidth={2.25} aria-hidden="true" />
                  </span>
                  <p className="mt-6 font-display text-xl font-semibold text-ink">Your cart is empty</p>
                  <p className="mt-1 font-medium text-ink-muted">Pick a kit to get your young entrepreneur started.</p>
                  <Link
                    href="/#kits"
                    onClick={close}
                    className="clay mt-6 rounded-2xl bg-accent px-6 py-3.5 font-display font-semibold text-on-accent transition-transform hover:-translate-y-0.5 active:scale-95"
                  >
                    Browse Kits
                  </Link>
                </div>
              ) : (
                <ul className="grid gap-3">
                  {items.map((item) => {
                    const img = item.product.images.realistic || item.product.images.stylized || "";
                    return (
                      <li key={item.product.id} className="clay-sm flex gap-4 rounded-[24px] bg-panel-muted p-3">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-panel">
                          {img && <Image src={img} alt="" fill sizes="80px" className="object-cover" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/kits/${item.product.slug}`}
                              onClick={close}
                              className="truncate font-display font-semibold text-ink hover:text-accent-ink"
                            >
                              {item.product.name}
                            </Link>
                            <span className="font-display font-semibold tabular-nums text-ink">
                              {formatINR(item.product.price * item.quantity)}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs tabular-nums text-ink-muted">
                            {formatINR(item.product.price)} each
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="clay-pressed flex items-center rounded-xl bg-panel">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                aria-label={`Decrease quantity of ${item.product.name}`}
                                className="flex h-11 w-11 items-center justify-center rounded-l-xl text-ink hover:text-grow-ink active:scale-90"
                              >
                                <Minus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                              </button>
                              <span className="w-7 text-center font-display font-semibold tabular-nums" aria-live="polite">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                aria-label={`Increase quantity of ${item.product.name}`}
                                className="flex h-11 w-11 items-center justify-center rounded-r-xl text-ink hover:text-grow-ink active:scale-90"
                              >
                                <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.product.id)}
                              aria-label={`Remove ${item.product.name} from cart`}
                              className="flex h-11 w-11 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-create-soft hover:text-create-ink"
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="space-y-3 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ink-muted">Subtotal</span>
                  <span className="font-display text-2xl font-bold tabular-nums text-ink">{formatINR(subtotal)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={close}
                  className="clay flex min-h-14 w-full items-center justify-center rounded-[22px] bg-accent font-display text-lg font-semibold text-on-accent transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  Proceed to Checkout
                </Link>
                <AskGrownUp
                  label="Ask a Grown-Up to Buy"
                  text={`I picked ${count === 1 ? "a kit" : `${count} kits`} from ${BRAND.name}! Can we get ${count === 1 ? "it" : "them"}?`}
                  path={`/picks?items=${items.map((i) => `${i.product.id}x${i.quantity}`).join(",")}`}
                  className="w-full"
                />
                {confirmClear ? (
                  <div className="flex items-center justify-center gap-3 text-sm">
                    <span className="font-semibold text-ink-muted">Remove all kits?</span>
                    <button
                      type="button"
                      onClick={() => {
                        clearCart();
                        setConfirmClear(false);
                      }}
                      className="min-h-11 rounded-xl px-3 font-bold text-create-ink hover:bg-create-soft"
                    >
                      Yes, Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClear(false)}
                      className="min-h-11 rounded-xl px-3 font-bold text-ink hover:bg-panel-muted"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    className="min-h-11 w-full text-sm font-semibold text-ink-muted transition-colors hover:text-create-ink"
                  >
                    Clear Cart
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
