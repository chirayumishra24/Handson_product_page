import Link from "next/link";
import { products } from "@/data/products";
import Logo from "./Logo";

const explore = [
  { href: "/#kits", label: "All Kits" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#compare", label: "Compare Kits" },
];

export default function Footer() {
  return (
    <footer className="px-3 pb-3 pt-10 sm:px-5 sm:pb-5">
      <div className="clay mx-auto max-w-7xl rounded-[40px] bg-panel px-6 py-12 sm:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-4 max-w-sm font-medium leading-relaxed text-ink-muted">
              Hands-on experience kits that turn children aged 8 to 16 into young entrepreneurs. Real materials, real
              business, real profit.
            </p>
          </div>

          <nav aria-labelledby="footer-explore" className="md:col-span-2">
            <h2 id="footer-explore" className="font-display text-lg font-semibold text-ink">
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm font-semibold text-ink-muted transition-colors hover:text-grow-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-kits" className="md:col-span-5">
            <h2 id="footer-kits" className="font-display text-lg font-semibold text-ink">
              Kits
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {products.map((p) => (
                <li key={p.id}>
                  <Link href={`/kits/${p.slug}`} className="text-sm font-semibold text-ink-muted transition-colors hover:text-grow-ink">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t-2 border-dashed border-line pt-6 text-sm font-semibold text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Skillizee. All rights reserved.</p>
          <p>Made for young entrepreneurs.</p>
        </div>
      </div>
    </footer>
  );
}
