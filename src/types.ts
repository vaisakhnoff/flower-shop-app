export interface Category {
  id: string;
  name: string;
  itemCount: number;
  slug: string;
  imageUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  categorySlug: string;
  images: string[];
  specifications: Record<string, string>;
}