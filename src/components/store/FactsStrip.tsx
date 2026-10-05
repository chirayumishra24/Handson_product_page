import { Package, Smile, Coins, Award } from "lucide-react";
import { products } from "@/data/products";
import { formatINR } from "@/lib/format";
import { swatches } from "@/lib/theme";

const profits = products.map((p) => p.profit);

const facts = [
  { icon: Package, swatch: swatches.sky, value: String(products.length), label: "Kits to choose from" },
  { icon: Smile, swatch: swatches.create, value: "8 to 16", label: "Age range in years" },
  {
    icon: Coins,
    swatch: swatches.sun,
    value: `${formatINR(Math.min(...profits))}-${formatINR(Math.max(...profits))}`,
    label: "Profit your child can earn per kit",
  },
  { icon: Award, swatch: swatches.design, value: "Certificate", label: "Plus a guide book in every kit" },
];

export default function FactsStrip() {
  return (
    <section aria-label="Kit facts" className="px-4 sm:px-6 lg:px-8">
      <dl className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {facts.map((f, i) => (
          <div
            key={f.label}
            className={`clay flex items-center gap-4 rounded-[28px] p-5 ${f.swatch.chip} ${
              i % 2 === 1 ? "lg:translate-y-3" : ""
            }`}
          >
            <span className={`clay-sm flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${f.swatch.solid}`}>
              <f.icon className="h-7 w-7" strokeWidth={2.5} aria-hidden="true" />
            </span>
            <div className="flex min-w-0 flex-col-reverse">
              <dt className="text-sm font-semibold">{f.label}</dt>
              <dd className="font-display text-2xl font-bold tabular-nums leading-tight">{f.value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
