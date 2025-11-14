// We import the 'type' keyword to satisfy TypeScript's verbatimModuleSyntax rule
import { type Product } from '../types';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

/**
 * A custom React hook to fetch a single product from Firestore by its ID.
 * @param id The document ID of the product to fetch.
 * @returns An object containing the product, loading state, and any error.
 */
export function useProduct(id: string | undefined) {
  // State for the product itself
  const [product, setProduct] = useState<Product | null>(null);
  // State to track if we are currently loading
  const [isLoading, setIsLoading] = useState(true);
  // State to hold any error messages
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This effect runs whenever the 'id' parameter changes.
    
    // If the id is not yet available (e.g., component is still loading),
    // we don't want to run the fetch.
    if (!id) {
      setIsLoading(false); // Stop loading
      return; // Exit the effect
    }

    // Define the async function to fetch data
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // 1. Create a "document reference" to the specific product
        // This is like creating a pointer to 'products/[the-id]'
        const docRef = doc(db, 'products', id);

        // 2. Fetch the actual document data
        const docSnap = await getDoc(docRef);

        // 3. Check if the document exists
        if (docSnap.exists()) {
          // If it exists, combine the ID and the data to create our Product object
          setProduct({
            id: docSnap.id,
            ...docSnap.data()
          } as Product); // Assert the type to match our interface
        } else {
          // If no document was found
          setError('Product not found.');
        }
      } catch (err) {
        // Handle any errors from Firebase
        console.error("Error fetching product:", err);
        setError('Failed to fetch product.');
      } finally {
        // This runs whether the try/catch succeeded or failed
        setIsLoading(false); // We are done loading
      }
    };

    fetchProduct(); // Call the function

  }, [id]); // The "dependency array" - this effect re-runs if 'id' changes

  // Return the data and loading states for our component to use
  return { product, isLoading, error };
}