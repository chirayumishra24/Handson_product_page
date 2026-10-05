import Hero from "@/components/store/Hero";
import FactsStrip from "@/components/store/FactsStrip";
import ProductGrid from "@/components/store/ProductGrid";
import HowItWorks from "@/components/store/HowItWorks";
import ComparisonTable from "@/components/store/ComparisonTable";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FactsStrip />
      <ProductGrid />
      <HowItWorks />
      <ComparisonTable />
    </>
  );
}
