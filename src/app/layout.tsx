import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import MotionProvider from "@/components/layout/MotionProvider";

// Rounded, friendly faces that young readers find easy and fun to read.
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  title: "Skillizee Kits | Hands-On Experience Kits for Young Entrepreneurs",
  description:
    "8 hands-on kits that teach children aged 8-16 to build, brand, price and sell real products. Real materials, real business, real profit.",
  keywords: ["skillizee", "kids entrepreneurship", "hands-on kits", "learning kits", "young entrepreneurs", "STEM kits India"],
  openGraph: {
    title: "Skillizee Kits | Turn Your Child Into a Young Entrepreneur",
    description: "Real materials. Real products. Real profit. 8 unique kits for ages 8-16.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f7ff" },
    { media: "(prefers-color-scheme: dark)", color: "#12162b" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${fredoka.variable}`}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-on-accent"
        >
          Skip to Content
        </a>
        <MotionProvider>
          <Navbar />
          <CartDrawer />
          <main id="main">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
