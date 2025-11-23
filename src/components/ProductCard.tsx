import { type Product } from '../types';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function ProductCard({ product }: { product: Product }) {
  const isNew = false;
  const isOnSale = false;
  const { language } = useLanguage();

  const displayName = (language === 'ml' && product.name_ml) ? product.name_ml : product.name;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block bg-white rounded-xl overflow-hidden transition-all duration-500 ease-out shadow-[0_2px_8px_rgba(251,207,232,0.2)] hover:shadow-[0_8px_24px_rgba(251,207,232,0.4)] hover:-translate-y-1 border border-rose-100/50"
    >
      {/* Image Container with Badge */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-gradient-to-br from-rose-50 to-champagne-50">
        <img 
          src={product.images[0]} 
          alt={displayName}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {(isNew || isOnSale) && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 space-y-1.5">
            {isNew && (
              <span className="block bg-rose-600 text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-md">
                New
              </span>
            )}
            {isOnSale && (
              <span className="block bg-amber-500 text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-md">
                Sale
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content - Compact on Mobile */}
      <div className="p-3 sm:p-4 md:p-5">
        <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-rose-700 transition-colors leading-snug">
          {displayName}
        </h3>
        <p className="text-base sm:text-lg md:text-xl font-bold text-rose-700 tracking-tight">
          ₹{product.price.toLocaleString('en-IN')}
        </p>
      </div>
    </Link>
  );
}
