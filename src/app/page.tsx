import Hero from "@/components/store/Hero";
import FactsStrip from "@/components/store/FactsStrip";
import ProductGrid from "@/components/store/ProductGrid";
import KitFinder from "@/components/store/KitFinder";
import HowItWorks from "@/components/store/HowItWorks";
import ComparisonTable from "@/components/store/ComparisonTable";
import Faq from "@/components/store/Faq";
import { BRAND, SITE_URL } from "@/lib/brand";

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: BRAND.name,
  url: SITE_URL,
  logo: `${SITE_URL}/brand/tinkupop-mark.svg`,
  description: BRAND.description,
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <FactsStrip />
      <ProductGrid />
      <KitFinder />
      <HowItWorks />
      <ComparisonTable />
      <Faq />
    </>
  );
}
