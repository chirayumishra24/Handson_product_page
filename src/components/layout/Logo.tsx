import Link from "next/link";
import { Leaf } from "lucide-react";

export default function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="group flex items-center gap-2 rounded-2xl" aria-label="Skillizee home">
      <span className="clay-sm flex h-10 w-10 items-center justify-center rounded-2xl bg-grow text-white transition-transform duration-300 group-hover:-rotate-12">
        <Leaf className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
      </span>
      <span className="font-display text-2xl font-bold tracking-tight text-ink" translate="no">
        Skill<span className="text-grow-ink">izee</span>
      </span>
    </Link>
  );
}
