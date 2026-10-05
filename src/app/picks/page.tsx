import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import { getProductById } from "@/data/products";
import { formatINR } from "@/lib/format";
import { BRAND } from "@/lib/brand";
import AddPicksButton from "./AddPicksButton";

export const metadata: Metadata = {
  title: "Kits Picked for You",
  description: `A young entrepreneur picked these ${BRAND.name} kits and would love your help getting them.`,
  robots: { index: false },
};

type Props = { searchParams: Promise<{ items?: string }> };

// ?items=1x2,5x1  ->  kit id 1 (qty 2), kit id 5 (qty 1). Unknown or sold-out kits are skipped.
function parsePicks(raw: string | undefined) {
  if (!raw) return [];
  return raw.split(",").flatMap((part) => {
    const [id, qty] = part.split("x");
    const product = getProductById(id);
    const quantity = Math.min(20, Math.max(1, Math.floor(Number(qty) || 1)));
    return product && product.inStock ? [{ product, quantity }] : [];
  });
}

export default async function PicksPage({ searchParams }: Props) {
  const picks = parsePicks((await searchParams).items);
  const total = picks.reduce((s, p) => s + p.product.price * p.quantity, 0);

  return (
    <div className="pb-20 pt-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {picks.length === 0 ? (
          <div className="clay rounded-[36px] bg-panel px-6 py-12 text-center">
            <h1 className="font-display text-3xl font-bold text-ink">This list is empty</h1>
            <p className="mt-2 font-medium text-ink-muted">The link may be incomplete. Have a look at all our kits instead.</p>
            <Link
              href="/#kits"
              className="clay mt-6 inline-flex min-h-12 items-center rounded-[22px] bg-accent px-7 font-display text-lg font-semibold text-on-accent"
            >
              See All Kits
            </Link>
          </div>
        ) : (
          <>
            <span className="clay animate-float flex h-16 w-16 items-center justify-center rounded-[22px] bg-sky text-white">
              <HeartHandshake className="h-8 w-8" strokeWidth={2.25} aria-hidden="true" />
            </span>
            <h1 className="mt-6 font-display text-[2.1rem] font-bold leading-tight tracking-tight text-ink sm:text-5xl">
              Your young entrepreneur <span className="marker">picked these!</span>
            </h1>
            <p className="mt-3 text-lg font-medium text-ink-muted">
              Each {BRAND.name} kit has everything they need to make a real product, sell it and earn a profit.
            </p>

            <ul className="mt-8 grid gap-4">
              {picks.map(({ product, quantity }) => (
                <li key={product.id}>
                  <Link
                    href={`/kits/${product.slug}`}
                    className="clay flex items-center gap-4 rounded-[26px] bg-panel p-3 transition-transform hover:-translate-y-0.5"
                  >
                    <span className="relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl bg-panel-muted sm:h-24 sm:w-32">
                      <Image
                        src={product.images.realistic || product.images.stylized || ""}
                        alt=""
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg font-semibold leading-tight text-ink">{product.name}</span>
                      <span className="mt-1 block text-sm font-medium text-ink-muted">{product.tagline}</span>
                      <span className="mt-1 block text-sm font-bold text-accent-ink">
                        Earns up to {formatINR(product.profit)} profit
                      </span>
                    </span>
                    <span className="shrink-0 text-right tabular-nums">
                      <span className="block font-display text-lg font-semibold text-ink">
                        {formatINR(product.price * quantity)}
                      </span>
                      {quantity > 1 && <span className="text-sm font-semibold text-ink-muted">Qty {quantity}</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="clay mt-6 flex flex-col gap-4 rounded-[28px] bg-panel p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <p className="flex items-baseline gap-2">
                <span className="font-semibold text-ink-muted">Total</span>
                <span className="font-display text-3xl font-bold tabular-nums text-ink">{formatINR(total)}</span>
              </p>
              <AddPicksButton picks={picks.map(({ product, quantity }) => ({ id: product.id, quantity }))} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
