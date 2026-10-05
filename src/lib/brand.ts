// Single source of truth for the brand name. A rename also needs new logo art:
// edit the wordmark letters in scripts/make-logo.py, then run it and
// scripts/brand-png.mjs to regenerate public/brand, icon.svg and the share image.
export const BRAND = {
  name: "Tinkupop",
  tagline: "Hands-on business kits for young entrepreneurs",
  description:
    "8 hands-on kits that teach children aged 8-16 to build, brand, price and sell real products. Real materials, real business, real profit.",
} as const;

// Set NEXT_PUBLIC_SITE_URL once the domain is live, so share previews and the
// sitemap use absolute production URLs.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
