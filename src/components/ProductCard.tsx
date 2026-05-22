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

const WhatsAppIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

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

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!WHATSAPP_NUMBER) return;
    const url = `${window.location.origin}/product/${product.id}`;
    const msg = encodeURIComponent(
      `Hi! I'm interested in this arrangement:\n\n*${displayName}*\n\nProduct link: ${url}\n\nCould you please share the price and availability?`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer');
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
              onClick={handleWhatsApp}
              className="flex items-center gap-1 py-1.5 px-3 rounded-full text-xs font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #25D366, #1fbe5a)' }}
            >
              <WhatsAppIcon /> Ask
            </button>
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

        {/* Bottom CTA overlay (appears on hover) */}
        <div
          className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out"
          style={{
            background: 'linear-gradient(to top, rgba(44,24,16,0.85), transparent)',
            paddingBottom: '12px',
            paddingTop: '32px',
            paddingLeft: '10px',
            paddingRight: '10px',
          }}
        >
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white transition-all active:scale-95"
            style={{ background: 'rgba(37,211,102,0.92)', backdropFilter: 'blur(4px)' }}
          >
            <WhatsAppIcon />
            Ask on WhatsApp
          </button>
        </div>

        {/* Badge */}
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
