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
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
        {facts.map((f, i) => (
          <li
            key={f.label}
            className={`clay flex flex-col items-start gap-3 rounded-[24px] p-4 sm:flex-row sm:items-center sm:gap-4 sm:rounded-[28px] sm:p-5 ${f.swatch.chip} ${
              i % 2 === 1 ? "lg:translate-y-3" : ""
            }`}
          >
            <span className={`clay-sm flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl sm:h-14 sm:w-14 ${f.swatch.solid}`}>
              <f.icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.5} aria-hidden="true" />
            </span>
            <div className="flex min-w-0 flex-col-reverse">
              <p className="text-[13px] font-semibold leading-snug sm:text-sm">{f.label}</p>
              <p className="font-display text-xl font-bold tabular-nums leading-tight min-[380px]:text-2xl">{f.value}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
