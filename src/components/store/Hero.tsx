"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Sprout, Rocket, Coins, Palette, Lightbulb, type LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";

const spring = { type: "spring", stiffness: 120, damping: 16 } as const;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { ...spring, delay },
});

// Clay "toys" that bob around the photo. Purely decorative.
const toys: { icon: LucideIcon; className: string; tilt: string; delay: string; size: string }[] = [
  { icon: Sprout, className: "bg-grow text-white -left-3 top-6 sm:-left-6", tilt: "-10deg", delay: "0s", size: "h-16 w-16" },
  { icon: Rocket, className: "bg-sky text-white -top-6 right-10", tilt: "12deg", delay: "0.8s", size: "h-14 w-14" },
  { icon: Coins, className: "bg-sun text-ink -right-3 top-1/2 sm:-right-6", tilt: "8deg", delay: "1.6s", size: "h-16 w-16" },
  { icon: Palette, className: "bg-create text-white -bottom-6 right-16 hidden sm:flex", tilt: "-8deg", delay: "2.2s", size: "h-14 w-14" },
  { icon: Lightbulb, className: "bg-design text-white left-[42%] -top-8 hidden lg:flex", tilt: "-6deg", delay: "1.1s", size: "h-12 w-12" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-28 sm:pt-32 md:pb-28 lg:pt-36">
      {/* Soft colour glows behind the photo. */}
      <div aria-hidden="true" className="pointer-events-none absolute right-[-10%] top-10 h-[480px] w-[480px] rounded-full bg-sun/30 blur-[90px]" />
      <div aria-hidden="true" className="pointer-events-none absolute right-[25%] top-[45%] h-[360px] w-[360px] rounded-full bg-create/20 blur-[90px]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8">
        <div className="lg:col-span-6">
          <motion.p
            {...rise(0)}
            className="clay-sm inline-flex items-center gap-2 rounded-2xl bg-create-soft px-4 py-2 text-[13px] font-bold text-create-ink sm:rounded-full sm:text-sm"
          >
            <Sparkles className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />
            Hands-on business kits for ages 8 to 16
          </motion.p>

          <motion.h1
            {...rise(0.06)}
            className="mt-6 font-display text-[2.3rem] font-bold leading-[1.08] tracking-tight text-ink min-[380px]:text-[2.6rem] sm:text-6xl xl:text-[4rem]"
          >
            Turn Your Child Into a <span className="marker">Young Entrepreneur</span>
          </motion.h1>

          <motion.p {...rise(0.12)} className="mt-5 max-w-[44ch] text-base font-medium leading-relaxed text-ink-muted sm:mt-6 sm:text-lg">
            Real materials, real products, real profit. Each kit has everything your child needs to build, brand and
            sell.
          </motion.p>

          <motion.div {...rise(0.18)} className="mt-8 grid grid-cols-1 gap-3 min-[400px]:flex min-[400px]:flex-wrap sm:mt-9 sm:gap-4">
            <Link
              href="#kits"
              className="clay group inline-flex items-center justify-center gap-2 rounded-[22px] bg-accent px-7 py-4 font-display text-lg font-semibold text-on-accent transition-transform hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]"
            >
              Shop All Kits
              <ArrowRight
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                strokeWidth={2.5}
                aria-hidden="true"
              />
            </Link>
            <Link
              href="#how-it-works"
              className="clay inline-flex items-center justify-center rounded-[22px] bg-panel px-7 py-4 font-display text-lg font-semibold text-ink transition-transform hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]"
            >
              How It Works
            </Link>
          </motion.div>
        </div>

        <div className="relative mx-2 lg:col-span-6 lg:mx-0 lg:ml-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 2 }}
            transition={{ ...spring, delay: 0.1 }}
            className="clay rounded-[36px] bg-panel p-3"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-panel-muted">
              <Image
                src="/images/kits/microgreens-realistic.jpg"
                alt="A child planting microgreen seedlings in trays from the Microgreens Farm kit"
                fill
                preload
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: -7 }}
            transition={{ ...spring, delay: 0.35 }}
            className="clay absolute -bottom-10 -left-4 hidden w-[40%] rounded-[26px] bg-panel p-2 sm:block lg:-left-10"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
              <Image
                src="/images/kits/escape-box-realistic.jpg"
                alt="The Escape Box Party kit: a locked wooden box, cipher wheel and UV torch"
                fill
                sizes="(max-width: 1024px) 40vw, 20vw"
                className="object-cover"
              />
            </div>
          </motion.div>

          {toys.map(({ icon: Icon, className, tilt, delay, size }) => (
            <span
              key={tilt}
              aria-hidden="true"
              style={{ "--tilt": tilt, animationDelay: delay } as CSSProperties}
              className={`clay animate-float absolute flex items-center justify-center rounded-[22px] ${size} ${className}`}
            >
              <Icon className="h-1/2 w-1/2" strokeWidth={2.5} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
