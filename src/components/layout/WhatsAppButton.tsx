import { MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/brand";

// Set NEXT_PUBLIC_WHATSAPP_NUMBER (country code + number, digits only, e.g. 919876543210)
// to show a chat button. Without it nothing renders.
const NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");

export function whatsappHref() {
  if (!NUMBER) return null;
  const text = encodeURIComponent(`Hi ${BRAND.name}! I have a question about your kits.`);
  return `https://wa.me/${NUMBER}?text=${text}`;
}

export default function WhatsAppButton() {
  const href = whatsappHref();
  if (!href) return null;
  return (
    // Tablets and up only: on phones the kit pages already use the bottom edge for the buy bar.
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp (opens in a new tab)"
      className="clay fixed bottom-6 right-6 z-30 hidden h-14 items-center gap-2 rounded-full bg-[#25D366] px-5 font-display font-semibold text-[#073b1d] transition-transform hover:-translate-y-1 md:inline-flex"
    >
      <MessageCircle className="h-6 w-6" strokeWidth={2.5} aria-hidden="true" />
      Ask Us
    </a>
  );
}
