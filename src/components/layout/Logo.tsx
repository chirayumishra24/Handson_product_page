import Link from "next/link";
import BrandMark from "./BrandMark";
import { BRAND } from "@/lib/brand";

export default function Logo({ id, onClick }: { id: string; onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="group flex items-center gap-2 rounded-2xl" aria-label={`${BRAND.name} home`}>
      <BrandMark
        id={id}
        className="h-11 w-11 shrink-0 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"
      />
      <span className="font-display text-xl font-bold lowercase tracking-tight text-ink min-[360px]:text-2xl" translate="no">
        tinku<span className="text-grow-ink">pop</span>
      </span>
    </Link>
  );
}
