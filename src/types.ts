export interface Category {
  id: string;
  name: string; // Fallback / Admin display name (usually English)
  name_en?: string; // English Name
  name_ml?: string; // Malayalam Name
  itemCount: number;
  slug: string;
  imageUrl?: string; // Category image URL
}

export interface Product {
  id: string;
  name: string; // Fallback / Admin display name (usually English)
  name_en?: string; // English Name
  name_ml?: string; // Malayalam Name
  price: number;
  description: string;
  categorySlug: string;
  images: string[]; // Array of product images
  specifications: Record<string, string>;
}