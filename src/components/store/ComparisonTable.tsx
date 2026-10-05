import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { products } from "@/data/products";
import { formatINR } from "@/lib/format";
import { categoryTheme, swatches } from "@/lib/theme";

const thumb = (p: (typeof products)[number]) => p.images.realistic || p.images.stylized || "";
const chip = (p: (typeof products)[number]) => swatches[categoryTheme[p.category].swatch].chip;

export default function ComparisonTable() {
  return (
    <section id="compare" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">Compare All Kits</h2>
        <p className="mt-3 max-w-[60ch] text-lg font-medium text-ink-muted">
          Price, age range, materials and the profit your child can make, side by side.
        </p>

        {/* Desktop and tablet: a real table. */}
        <div className="clay mt-10 hidden overflow-hidden rounded-[32px] bg-panel p-2 md:block">
          <table className="w-full text-sm">
            <caption className="sr-only">Comparison of all Skillizee kits</caption>
            <thead>
              <tr className="text-left font-display text-sm font-semibold text-ink-muted">
                <th scope="col" className="px-5 py-3.5">Kit</th>
                <th scope="col" className="px-5 py-3.5">Ages</th>
                <th scope="col" className="px-5 py-3.5 text-right">Items</th>
                <th scope="col" className="px-5 py-3.5 text-right">Price</th>
                <th scope="col" className="px-5 py-3.5 text-right">Profit</th>
                <th scope="col" className="px-5 py-3.5">
                  <span className="sr-only">Details</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="group [&>*:first-child]:rounded-l-[22px] [&>*:last-child]:rounded-r-[22px] [&>*]:transition-colors hover:[&>*]:bg-panel-muted">
                  <th scope="row" className="px-5 py-3 text-left font-normal">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-2xl bg-panel-muted">
                        <Image src={thumb(p)} alt="" fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/kits/${p.slug}`}
                          className="font-display text-base font-semibold text-ink hover:text-accent-ink"
                        >
                          {p.name}
                        </Link>
                        <p className="truncate text-xs font-medium text-ink-muted">{p.tagline}</p>
                      </div>
                    </div>
                  </th>
                  <td className="whitespace-nowrap px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold tabular-nums ${chip(p)}`}>{p.ageRange}</span>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums text-ink-muted">{p.materials.length}</td>
                  <td className="px-5 py-3 text-right font-display text-base font-semibold tabular-nums text-ink">{formatINR(p.price)}</td>
                  <td className="px-5 py-3 text-right">
                    <span className="rounded-full bg-accent-soft px-3 py-1 text-sm font-bold tabular-nums text-accent-ink">
                      {formatINR(p.profit)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/kits/${p.slug}`}
                      aria-label={`View ${p.name}`}
                      className="clay-sm inline-flex rounded-xl bg-panel p-2 text-ink transition-transform hover:-translate-y-0.5"
                    >
                      <ChevronRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phones: one tappable row per kit instead of a sideways-scrolling table. */}
        <ul className="mt-8 grid gap-3 md:hidden">
          {products.map((p) => (
            <li key={p.id}>
              <Link href={`/kits/${p.slug}`} className="clay-sm flex items-center gap-3 rounded-[22px] bg-panel p-3 active:scale-[0.98]">
                <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-2xl bg-panel-muted">
                  <Image src={thumb(p)} alt="" fill sizes="56px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display font-semibold text-ink">{p.name}</p>
                  <p className="text-xs font-semibold tabular-nums text-ink-muted">
                    Ages {p.ageRange}, {p.materials.length} items
                  </p>
                </div>
                <div className="text-right tabular-nums">
                  <p className="font-display font-semibold text-ink">{formatINR(p.price)}</p>
                  <p className="text-xs font-bold text-accent-ink">{formatINR(p.profit)} profit</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
