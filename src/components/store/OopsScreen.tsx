import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Compass, Rocket, Sprout, Star } from "lucide-react";

// Shared playful layout for the 404 and error pages. No hooks, so it works in
// both Server and Client Components.
export default function OopsScreen({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-[80dvh] items-center px-4 pb-16 pt-28">
      <div className="clay relative mx-auto w-full max-w-xl rounded-[40px] bg-panel px-6 py-14 text-center sm:px-12">
        {/* Clay toys scattered around the card. */}
        <span
          aria-hidden="true"
          style={{ "--tilt": "-10deg" } as CSSProperties}
          className="clay animate-float absolute -left-3 -top-5 flex h-14 w-14 items-center justify-center rounded-[20px] bg-grow text-white sm:-left-6"
        >
          <Sprout className="h-7 w-7" strokeWidth={2.5} />
        </span>
        <span
          aria-hidden="true"
          style={{ "--tilt": "12deg", animationDelay: "1s" } as CSSProperties}
          className="clay animate-float absolute -right-3 top-10 flex h-12 w-12 items-center justify-center rounded-[18px] bg-sun text-on-sun sm:-right-6"
        >
          <Star className="h-6 w-6 fill-current" strokeWidth={2} />
        </span>
        <span
          aria-hidden="true"
          style={{ "--tilt": "-6deg", animationDelay: "2s" } as CSSProperties}
          className="clay animate-float absolute -bottom-5 right-12 flex h-12 w-12 items-center justify-center rounded-[18px] bg-create text-white"
        >
          <Rocket className="h-6 w-6" strokeWidth={2.5} />
        </span>

        <span className="clay mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] bg-sky text-white">
          <Compass className="h-10 w-10" strokeWidth={2.25} aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-[40ch] text-lg font-medium text-ink-muted">{message}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {action}
          <Link
            href="/#kits"
            className="clay inline-flex min-h-12 items-center justify-center rounded-[22px] bg-accent px-7 font-display text-lg font-semibold text-on-accent transition-transform hover:-translate-y-0.5"
          >
            See All Kits
          </Link>
        </div>
      </div>
    </div>
  );
}
