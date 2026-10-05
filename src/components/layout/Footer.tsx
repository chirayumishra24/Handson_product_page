import Link from "next/link";
import { products } from "@/data/products";
import Logo from "./Logo";
import { BRAND } from "@/lib/brand";
import { whatsappHref } from "./WhatsAppButton";

const explore = [
  { href: "/#kits", label: "All Kits" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#compare", label: "Compare Kits" },
  { href: "/#faq", label: "Questions" },
];

export default function Footer() {
  const chat = whatsappHref();
  return (
    <footer className="px-3 pb-3 pt-10 sm:px-5 sm:pb-5">
      <div className="clay mx-auto max-w-7xl rounded-[32px] bg-panel px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-10 sm:rounded-[40px] sm:px-10 sm:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-5">
            <Logo id="footer-logo" />
            <p className="mt-4 max-w-sm font-medium leading-relaxed text-ink-muted">
              Hands-on experience kits that turn children aged 8 to 16 into young entrepreneurs. Real materials, real
              business, real profit.
            </p>
            {chat && (
              <a
                href={chat}
                target="_blank"
                rel="noopener noreferrer"
                className="clay-sm mt-5 inline-flex min-h-11 items-center rounded-2xl bg-grow-soft px-4 font-display font-semibold text-grow-ink"
              >
                Chat on WhatsApp
              </a>
            )}
          </div>

          <nav aria-labelledby="footer-explore" className="lg:col-span-2">
            <h2 id="footer-explore" className="font-display text-lg font-semibold text-ink">
              Explore
            </h2>
            <ul className="mt-2 grid">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="block py-3 text-sm font-semibold text-ink-muted transition-colors hover:text-grow-ink lg:py-1.5">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-kits" className="lg:col-span-5">
            <h2 id="footer-kits" className="font-display text-lg font-semibold text-ink">
              Kits
            </h2>
            <ul className="mt-2 grid grid-cols-1 gap-x-6 lg:grid-cols-2">
              {products.map((p) => (
                <li key={p.id}>
                  <Link href={`/kits/${p.slug}`} className="block py-3 text-sm font-semibold text-ink-muted transition-colors hover:text-grow-ink lg:py-1.5">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t-2 border-dashed border-line pt-6 text-sm font-semibold text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <p>Made for young entrepreneurs.</p>
        </div>
      </div>
    </footer>
  );
}
