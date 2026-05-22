import { type Product } from '../types';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../context/FavoritesContext';

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="15" height="15" viewBox="0 0 24 24"
    fill={filled ? '#f43b6a' : 'none'}
    stroke={filled ? '#f43b6a' : '#6b5444'}
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);


interface ProductCardProps {
  product: Product;
  badge?: 'new' | 'popular' | null;
  layout?: 'grid' | 'list';
}

export default function ProductCard({ product, badge = null, layout = 'grid' }: ProductCardProps) {
  const { language } = useLanguage();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const displayName = (language === 'ml' && product.name_ml) ? product.name_ml : product.name;
  const isLiked = isFavorite(product.id);

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isLiked ? removeFavorite(product.id) : addFavorite(product);
  };


  if (layout === 'list') {
    return (
      <Link
        to={`/product/${product.id}`}
        className="group flex gap-3 p-3 rounded-2xl bg-white hover:shadow-lg transition-all duration-300"
        style={{ border: '1px solid rgba(243,232,224,0.8)' }}
      >
        <div
          className="relative overflow-hidden rounded-xl flex-shrink-0 img-zoom"
          style={{ width: 88, height: 88, background: 'linear-gradient(135deg, #fce4ec, #fff3e0)' }}
        >
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={displayName} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">🌸</div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {badge && (
              <span className={badge === 'new' ? 'badge-new mr-1' : 'badge-popular mr-1'}>{badge}</span>
            )}
            <p className="font-semibold text-sm line-clamp-2 mt-1" style={{ color: '#2c1810', fontFamily: "'DM Sans', sans-serif" }}>
              {displayName}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={handleFav}
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${isLiked ? 'bg-pink-50' : 'bg-gray-50'}`}
              style={{ border: `1px solid ${isLiked ? '#f9b8c8' : 'rgba(243,232,224,1)'}` }}
            >
              <HeartIcon filled={isLiked} />
            </button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/product/${product.id}`} className="group block product-card">
      {/* Image Container */}
      <div
        className="relative overflow-hidden img-zoom"
        style={{ aspectRatio: '3/4', background: 'linear-gradient(135deg, #fce4ec, #fff3e0)' }}
      >
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={displayName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🌸</div>
        )}

        {/* Top gradient for badge visibility */}
        <div
          className="absolute inset-x-0 top-0 h-16 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.18), transparent)' }}
        />


        {badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className={badge === 'new' ? 'badge-new' : 'badge-popular'}>
              {badge === 'new' ? '✨ New' : '🔥 Popular'}
            </span>
          </div>
        )}

        {/* Favourite heart button */}
        <button
          onClick={handleFav}
          className={`fav-btn ${isLiked ? 'active' : ''}`}
          aria-label={isLiked ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <HeartIcon filled={isLiked} />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-3 sm:p-3.5">
        <h3
          className="font-medium text-[0.875rem] sm:text-[0.9375rem] leading-snug line-clamp-2 group-hover:text-[#c9922c] transition-colors duration-200"
          style={{ color: '#2c1810', fontFamily: "'DM Sans', sans-serif" }}
        >
          {displayName}
        </h3>
        <p className="text-[11px] mt-1 font-medium" style={{ color: '#b0997a' }}>
          Tap to view details
        </p>
      </div>
    </Link>
  );
}
