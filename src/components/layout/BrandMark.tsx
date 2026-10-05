import { BRAND_MARK_T_PATH } from "./brandMarkPath";

// The Tinkupop mark: a clay tile with a "t" and a yellow pop bubble.
// Mirrors public/brand/tinkupop-mark.svg. `id` keeps gradient ids unique when
// the mark appears more than once on a page.
export default function BrandMark({ id, className }: { id: string; className?: string }) {
  return (
    <svg viewBox="0 0 122 122" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-tile`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#43D486" />
          <stop offset="1" stopColor="#1E9E58" />
        </linearGradient>
        <radialGradient id={`${id}-shine`} cx="0.3" cy="0.22" r="0.55">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-sun`} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#FFE08A" />
          <stop offset="1" stopColor="#FFC83D" />
        </radialGradient>
      </defs>
      <rect x="6" y="10" width="104" height="104" rx="34" fill="#1E9E58" opacity="0.35" />
      <rect x="4" y="4" width="104" height="104" rx="34" fill={`url(#${id}-tile)`} />
      <rect x="4" y="4" width="104" height="104" rx="34" fill={`url(#${id}-shine)`} />
      <path d={BRAND_MARK_T_PATH} fill="#fff" />
      <circle cx="96" cy="24" r="21" fill="#fff" />
      <circle cx="96" cy="24" r="16" fill={`url(#${id}-sun)`} />
      <circle cx="90.5" cy="18.5" r="4.2" fill="#fff" opacity="0.85" />
      <circle cx="114" cy="48" r="5.5" fill="#FF5C9A" />
    </svg>
  );
}
