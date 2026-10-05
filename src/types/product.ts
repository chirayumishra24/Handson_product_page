export interface MaterialItem {
  name: string;
  quantity: string;
  cost: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  ageRange: string;
  price: number;
  originalPrice?: number;
  profit: number;
  materialsCost: number;
  images: {
    stylized?: string;
    realistic?: string;
  };
  materials: MaterialItem[];
  category: "create" | "build" | "design" | "grow";
  badge?: string;
  inStock: boolean;
}
