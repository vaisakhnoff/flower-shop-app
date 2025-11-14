// 1. Import our hook
import { useFavorites } from '../context/FavoritesContext';
// 2. Import our reusable ProductCard component
import ProductCard from '../components/ProductCard';
// 3. We can reuse the same styles as the ShopPage!
import './ShopPage.css'; 

export default function FavoritesPage() {
  // 3. Get the list of favorites from our global context
  const { favorites } = useFavorites();

  return (
    <div className="shop-page">
      <h2>Your Favorites</h2>
      
      <div className="product-grid">
        {/* 4. Check if the list is empty */}
        {favorites.length > 0 ? (
          // If we have favorites, map over them and render a card
          favorites.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          // If the list is empty, show a message
          <p>You haven't added any favorites yet.</p>
        )}
      </div>
    </div>
  );
}