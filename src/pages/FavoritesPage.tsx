import { useFavorites } from '../context/FavoritesContext';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext'; // Import hook

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const { t } = useLanguage(); // Get translations

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        {t.yourFavorites}
      </h2>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 sm:gap-6">
        {favorites.length > 0 ? (
          favorites.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 text-lg py-10">
            {t.noFavorites}
          </p>
        )}
      </div>
    </div>
  );
}