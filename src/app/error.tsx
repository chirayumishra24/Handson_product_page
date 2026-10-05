"use client"; // Error boundaries must be Client Components
import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import OopsScreen from "@/components/store/OopsScreen";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <OopsScreen
      title="Something went wobbly."
      message="A part of this page didn't load. Give it another try, or head back to the kits."
      action={
        <button
          type="button"
          onClick={() => retry()}
          className="clay inline-flex min-h-12 items-center justify-center gap-2 rounded-[22px] bg-panel px-7 font-display text-lg font-semibold text-ink transition-transform hover:-translate-y-0.5"
        >
          <RotateCcw className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
          Try Again
        </button>
      }
    />
  );
}
