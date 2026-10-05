"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Package, Paintbrush, IndianRupee, Megaphone } from "lucide-react";
import { swatches } from "@/lib/theme";
import { BRAND } from "@/lib/brand";

const steps = [
  {
    icon: Package,
    swatch: swatches.sky,
    title: "Unbox",
    desc: "Open your kit. Every material is inside, plus a step-by-step guide book.",
  },
  {
    icon: Paintbrush,
    swatch: swatches.create,
    title: "Make",
    desc: "Follow the guide to build your product. QR codes link to video tutorials.",
  },
  {
    icon: IndianRupee,
    swatch: swatches.sun,
    title: "Sell",
    desc: "Brand it, price it, and sell to neighbours, friends and family.",
  },
  {
    icon: Megaphone,
    swatch: swatches.design,
    title: "Earn & Pitch",
    desc: `Track your profit and record a 30-second pitch to earn your ${BRAND.name} certificate.`,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-3 py-10 sm:px-5 md:py-16">
      <div className="clay mx-auto max-w-7xl rounded-[32px] bg-grow-soft px-4 py-10 sm:rounded-[44px] sm:px-10 sm:py-14 md:py-20 lg:px-14">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <h2 className="font-display text-[2.1rem] font-bold leading-tight tracking-tight text-ink sm:text-5xl">How It Works</h2>
            <p className="mt-3 max-w-[44ch] text-base font-medium text-ink-muted sm:text-lg">
              From unboxing to earning real profit in 4 simple steps.
            </p>
            <div className="clay mx-1 mt-8 -rotate-2 rounded-[28px] bg-panel p-2.5 sm:mx-0 sm:mt-10 sm:rounded-[32px] sm:p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-panel-muted">
                <Image
                  src="/images/kits/microgreens-stylized.jpg"
                  alt="Everything inside the Microgreens Farm kit laid out: seed packs, trays, coco peat, spray bottle and a growth chart"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <ol className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 sm:pb-8 lg:col-span-7 lg:pb-0">
            {steps.map((step, i) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 30, rotate: i % 2 ? 3 : -3 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ type: "spring", stiffness: 120, damping: 15, delay: i * 0.08 }}
                className={`clay relative rounded-[26px] bg-panel p-5 sm:rounded-[30px] sm:p-6 ${i % 2 === 1 ? "sm:translate-y-8" : ""}`}
              >
                <span
                  aria-hidden="true"
                  className="clay-sm absolute -right-2 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-panel font-display text-lg font-bold text-ink"
                >
                  {i + 1}
                </span>
                <span className={`clay-sm flex h-14 w-14 items-center justify-center rounded-2xl ${step.swatch.solid}`}>
                  <step.icon className="h-7 w-7" strokeWidth={2.5} aria-hidden="true" />
                </span>
                <h3 className={`mt-5 font-display text-2xl font-bold ${step.swatch.text}`}>{step.title}</h3>
                <p className="mt-2 font-medium leading-relaxed text-ink-muted">{step.desc}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
