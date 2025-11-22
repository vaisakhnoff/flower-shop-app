import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  limit, 
  startAfter, 
  type QueryDocumentSnapshot, // Fix: Use type import
  type DocumentData           // Fix: Use type import
} from 'firebase/firestore';
import { type Product } from '../types';

const PRODUCTS_PER_PAGE = 8; 

export function useProducts(categorySlug: string | undefined) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setProducts([]);
    setLastDoc(null);
    setHasMore(true);
    setIsLoading(true);
    
    // Move logic inside useEffect to satisfy linter
    const fetchInitial = async () => {
      try {
        const productsCollection = collection(db, 'products');
        
        // Fix: Use 'const' instead of 'let'
        const constraints = [];

        if (categorySlug) {
          constraints.push(where('categorySlug', '==', categorySlug));
        }
        
        constraints.push(limit(PRODUCTS_PER_PAGE));

        const productQuery = query(productsCollection, ...constraints);
        const querySnapshot = await getDocs(productQuery);
        
        const newProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Product));

        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastDoc(lastVisible || null);
        
        setHasMore(querySnapshot.docs.length >= PRODUCTS_PER_PAGE);
        setProducts(newProducts);

      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitial();
  }, [categorySlug]);

  const loadMore = async () => {
    if (!lastDoc || isLoading) return;
    
    setIsLoading(true);
    try {
      const productsCollection = collection(db, 'products');
      const constraints = [];

      if (categorySlug) {
        constraints.push(where('categorySlug', '==', categorySlug));
      }

      constraints.push(startAfter(lastDoc));
      constraints.push(limit(PRODUCTS_PER_PAGE));

      const productQuery = query(productsCollection, ...constraints);
      const querySnapshot = await getDocs(productQuery);
      
      const newProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Product));

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastDoc(lastVisible || null);
      
      setHasMore(querySnapshot.docs.length >= PRODUCTS_PER_PAGE);
      setProducts(prev => [...prev, ...newProducts]);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { products, isLoading, error, hasMore, loadMore };
}