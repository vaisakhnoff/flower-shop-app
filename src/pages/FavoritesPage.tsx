import { useFavorites } from '../context/FavoritesContext';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 tracking-tight mb-2">
            {t.yourFavorites}
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            {favorites.length > 0 
              ? `${favorites.length} ${favorites.length === 1 ? 'item' : 'items'} saved`
              : t.noFavorites
            }
          </p>
        </div>
        
        {favorites.length > 0 ? (
          /* Product Grid - Same as Shop Page */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {favorites.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 md:py-24">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-md w-full text-center">
              {/* Empty Icon */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-stone-100 rounded-full text-4xl md:text-5xl">
                  💔
                </div>
              </div>
              
              {/* Empty Message */}
              <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-3">
                No Favorites Yet
              </h2>
              <p className="text-sm md:text-base text-gray-600 mb-8 leading-relaxed">
                Start adding your favorite flowers to your wishlist and they'll appear here
              </p>
              
              {/* CTA Button */}
              <Link
                to="/shop"
                className="inline-block w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold text-base py-3.5 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl active:scale-[0.98]"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
