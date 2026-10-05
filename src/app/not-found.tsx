import type { Metadata } from "next";
import OopsScreen from "@/components/store/OopsScreen";

export const metadata: Metadata = { title: "Page Not Found" };

export default function NotFound() {
  return (
    <OopsScreen
      title="Oops! This page wandered off."
      message="We looked everywhere, even under the seed trays. Let's get you back to the kits."
    />
  );
}
