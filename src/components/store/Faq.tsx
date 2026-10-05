import { ChevronDown, Smile, Package, Coins, Award, Shuffle, type LucideIcon } from "lucide-react";
import { products } from "@/data/products";
import { formatINR } from "@/lib/format";
import { swatches, type Swatch } from "@/lib/theme";
import { BRAND } from "@/lib/brand";

const profits = products.map((p) => p.profit);

// Answers only state what the kits and their pages already promise.
// Add delivery and returns questions here once those policies are decided.
const faqs: { q: string; a: string; icon: LucideIcon; swatch: Swatch }[] = [
  {
    q: "What age are the kits for?",
    a: "Every kit is made for children aged 8 to 16. Each kit shows its exact age range on its card and its page.",
    icon: Smile,
    swatch: swatches.create,
  },
  {
    q: "What comes in the box?",
    a: "All the materials your child needs to make the product, plus a step-by-step guide book with QR codes that link to video tutorials. Open \"What's in the Box\" on any kit page to see every item.",
    icon: Package,
    swatch: swatches.sky,
  },
  {
    q: "How does my child actually earn money?",
    a: `They make a real product, then brand it, price it and sell it to neighbours, friends and family. Depending on the kit, they can earn ${formatINR(Math.min(...profits))} to ${formatINR(Math.max(...profits))} in profit.`,
    icon: Coins,
    swatch: swatches.sun,
  },
  {
    q: `How does the ${BRAND.name} certificate work?`,
    a: "After selling, your child tracks their profit and records a 30-second pitch about their business. That pitch earns their certificate.",
    icon: Award,
    swatch: swatches.design,
  },
  {
    q: "Is each kit a different business?",
    a: "Yes. Some kits are about making and selling a product, like microgreens or stickers. Others are a service, like renting out the Escape Box game again and again. Every kit teaches something new.",
    icon: Shuffle,
    swatch: swatches.grow,
  },
];

export default function Faq() {
  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-[2.1rem] font-bold leading-tight tracking-tight text-ink sm:text-5xl">
          Questions From <span className="marker">Parents</span>
        </h2>
        <div className="mt-8 grid gap-4">
          {faqs.map((f) => (
            <details key={f.q} className="clay group rounded-[26px] bg-panel">
              <summary className="flex min-h-14 cursor-pointer list-none items-center gap-4 rounded-[26px] p-4 font-display text-lg font-semibold text-ink sm:p-5 [&::-webkit-details-marker]:hidden">
                <span className={`clay-sm flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${f.swatch.solid}`}>
                  <f.icon className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
                </span>
                <span className="flex-1">{f.q}</span>
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-ink-muted transition-transform group-open:rotate-180"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              </summary>
              <p className="px-5 pb-5 font-medium leading-relaxed text-ink-muted sm:pl-[5.25rem] sm:pr-8">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
