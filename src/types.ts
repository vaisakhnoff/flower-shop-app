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
  categorySlug: string; // Fixed typo: 'cateregorySlug' -> 'categorySlug'
  images: string[];
  specifications: Record<string, string>; // This is correct for a Firestore map
}

