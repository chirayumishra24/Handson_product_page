import { products, getProductBySlug } from "@/data/products";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Kit Not Found" };

  return {
    title: `${product.name} | Skillizee Kit | ₹${product.price}`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Skillizee Kit`,
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

  return <ProductDetailClient product={product} related={related} />;
}
