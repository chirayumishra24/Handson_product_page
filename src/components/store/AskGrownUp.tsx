"use client";
import { useState } from "react";
import { HeartHandshake } from "lucide-react";

// Kids browse, grown-ups pay. This sends a link to a parent: the phone's share
// sheet where available (WhatsApp, SMS, email...), otherwise WhatsApp Web.
export async function shareWithGrownUp(text: string, path: string) {
  const url = new URL(path, window.location.origin).toString();
  if (navigator.share) {
    try {
      await navigator.share({ text, url });
      return "shared";
    } catch (err) {
      // The child closed the share sheet; that's not an error worth showing.
      if ((err as Error).name === "AbortError") return "cancelled";
    }
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, "_blank", "noopener,noreferrer");
  return "shared";
}

export default function AskGrownUp({
  text,
  path,
  label = "Ask a Grown-Up",
  className = "",
}: {
  text: string;
  path: string;
  label?: string;
  className?: string;
}) {
  const [sent, setSent] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={async () => {
          if ((await shareWithGrownUp(text, path)) === "shared") setSent(true);
        }}
        className={`clay inline-flex min-h-12 items-center justify-center gap-2 rounded-[22px] bg-sky-soft px-5 font-display font-semibold text-sky-ink transition-transform hover:-translate-y-0.5 active:scale-[0.98] ${className}`}
      >
        <HeartHandshake className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
        {sent ? "Sent! Ask Again" : label}
      </button>
      <span className="sr-only" aria-live="polite">
        {sent ? "Link ready to send to a grown-up" : ""}
      </span>
    </>
  );
}
