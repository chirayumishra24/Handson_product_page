import { products, getProductBySlug } from "@/data/products";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";
import { BRAND, SITE_URL } from "@/lib/brand";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Kit Not Found" };

  return {
    title: `${product.name} Kit | ₹${product.price}`,
    description: product.description,
    openGraph: {
      title: `${product.name} Kit | ${BRAND.name}`,
      description: product.tagline,
      images: [product.images.realistic || product.images.stylized || ""],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  // Same-category kits first, then the rest, so there is always a full row.
  const others = products.filter((p) => p.id !== product.id);
  const related = [
    ...others.filter((p) => p.category === product.category),
    ...others.filter((p) => p.category !== product.category),
  ].slice(0, 4);

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} Kit`,
    description: product.description,
    image: [product.images.realistic, product.images.stylized].filter(Boolean).map((src) => `${SITE_URL}${src}`),
    brand: { "@type": "Brand", name: BRAND.name },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/kits/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd).replace(/</g, "\\u003c") }}
      />
      <ProductDetailClient product={product} related={related} />
    </>
  );
}
