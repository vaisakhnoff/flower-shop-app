// 1. Import our favorites hook
import { useFavorites } from '../context/FavoritesContext';
// 2. Import our reusable ProductCard
import ProductCard from '../components/ProductCard';
// 3. We are re-using the `useFavorites` hook we built earlier

export default function FavoritesPage() {
  // 4. Get the list of favorites from our global context
  const { favorites } = useFavorites();

  return (
    <div className="
      max-w-6xl 
      mx-auto 
      p-4 sm:p-6 lg:p-8
    ">
      {/* We use the exact same layout classes as HomePage and ShopPage */}
      
      <h2 className="
        text-2xl sm:text-3xl 
        font-bold 
        text-gray-800 
        mb-6
      ">
        Your Favorites
      </h2>
      
      <div className="
        grid 
        grid-cols-2 
        gap-4 
        sm:grid-cols-3 
        md:grid-cols-4 
        sm:gap-6
      ">
        {/* We use the exact same responsive grid as ShopPage */}
        
        {/* 5. Check if the list is empty */}
        {favorites.length > 0 ? (
          // If we have favorites, map over them and render a card
          favorites.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          // If the list is empty, show a message
          // col-span-full makes this message span the entire grid
          <p className="col-span-full text-center text-gray-500 text-lg">
            You haven't added any favorites yet.
          </p>
        )}
      </div>
    </div>
  );
}