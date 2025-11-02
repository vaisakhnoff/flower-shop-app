import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, QuerySnapshot, type DocumentData } from 'firebase/firestore';
import { type Product } from '../types'; // Use type-only import

export function useProducts(categorySlug: string | undefined) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Start with the base collection
        const productsCollection = collection(db, 'products');

        // Create our query
        // If a categorySlug is provided, filter by it.
        // Otherwise, fetch all products.
        const productQuery = categorySlug 
          ? query(productsCollection, where('categorySlug', '==', categorySlug))
          : query(productsCollection);

        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(productQuery);

        const productsData: Product[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Product)); // Assert the type

        setProducts(productsData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug]); 

  return { products, isLoading, error };
}
