"use client";
import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { getProductById } from "@/data/products";
import Burst from "@/components/store/Burst";

export default function AddPicksButton({ picks }: { picks: { id: string; quantity: number }[] }) {
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const [done, setDone] = useState(false);

  const addAll = () => {
    for (const { id, quantity } of picks) {
      const product = getProductById(id);
      if (!product) continue;
      for (let i = 0; i < quantity; i++) addItem(product);
    }
    setDone(true);
    setCartOpen(true);
  };

  return (
    <button
      type="button"
      onClick={addAll}
      disabled={done}
      className={`relative inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[22px] px-7 font-display text-lg font-semibold transition-transform sm:w-auto ${
        done
          ? "clay-pressed bg-accent-soft text-accent-ink"
          : "clay bg-accent text-on-accent hover:-translate-y-0.5 active:scale-[0.98]"
      }`}
    >
      {done ? (
        <Check className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
      ) : (
        <ShoppingCart className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
      )}
      {done ? "Added to Your Cart" : "Add All to Cart"}
      <Burst fire={done ? 1 : 0} />
    </button>
  );
}
