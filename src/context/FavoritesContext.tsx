import { createContext, useContext, useState, useEffect } from 'react';
import { type ReactNode } from 'react';
// We need the 'Product' type
import { type Product } from '../types';

// 1. Define the shape of our Context
// It will hold the list of favorites, and functions to change them
interface FavoritesContextType {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

// 2. Create the Context
// We have to give it a 'default' value, which we'll override
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// 3. Create the "Provider" component
// This is the component that will wrap our entire app
export function FavoritesProvider({ children }: { children: ReactNode }) {
  // 4. Create the state to hold the list of favorite products
  const [favorites, setFavorites] = useState<Product[]>([]);

  // 5. === Load from Local Storage ===
  // This effect runs ONCE when the app starts.
  useEffect(() => {
    // Try to get the saved list from local storage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      // If we found a saved list, parse it from text (JSON)
      // back into a JavaScript array and set it as our state.
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []); // Empty array means "run only on first load"

  // 6. === Save to Local Storage ===
  // This effect runs EVERY TIME the 'favorites' state changes.
  useEffect(() => {
    // We save the list as a JSON string.
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]); // Dependency array: "run when 'favorites' changes"

  // 7. Define the functions our app can use

  // Function to ADD a product (if it's not already added)
  const addFavorite = (product: Product) => {
    setFavorites((prevFavorites) => {
      // Check if the product is already a favorite
      if (prevFavorites.find(p => p.id === product.id)) {
        return prevFavorites; // If so, return the list unchanged
      }
      // If not, add it to the list
      return [...prevFavorites, product];
    });
  };

  // Function to REMOVE a product
  const removeFavorite = (id: string) => {
    setFavorites((prevFavorites) => {
      // Return a new list that *filters out* the product with this id
      return prevFavorites.filter(p => p.id !== id);
    });
  };

  // Function to CHECK if a product is a favorite
  const isFavorite = (id: string) => {
    // Returns true if the product is found, false if not
    return !!favorites.find(p => p.id === id);
  };

  // 8. Provide all these values to the 'children' (our app)
  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

// 9. Create our custom hook
// This is a simple wrapper so components can just call `useFavorites()`
// instead of the more complex `useContext(FavoritesContext)`
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}