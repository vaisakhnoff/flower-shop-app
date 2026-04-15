import { useFavorites } from '../context/FavoritesContext';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen" style={{ background: '#fffdf9' }}>

      {/* Page Banner */}
      <div
        className="relative px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-10 sm:pb-12 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #fff5f7 0%, #fffdf5 50%, #fef5e4 100%)' }}
      >
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-40 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #ffc9d5, transparent)' }} />

        <div className="relative max-w-7xl mx-auto">
          <h1
            className="font-display font-bold leading-tight mb-2"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: '#2c1810',
              fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
              letterSpacing: '-0.02em',
            }}
          >
            {t.yourFavorites || 'Your Wishlist'}
          </h1>
          <div className="flex items-center gap-3">
            <div className="h-px w-8" style={{ background: 'linear-gradient(to right, #c9922c, transparent)' }} />
            <p className="text-sm font-medium" style={{ color: '#8b7060' }}>
              {favorites.length > 0
                ? `${favorites.length} ${favorites.length === 1 ? 'arrangement' : 'arrangements'} saved`
                : t.noFavorites || 'Your wishlist is empty'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {favorites.map((product, i) => (
              <div
                key={product.id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 0.07}s`, animationFillMode: 'both' }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            {/* Empty state card */}
            <div
              className="max-w-sm w-full text-center p-8 sm:p-10 rounded-3xl"
              style={{
                background: '#fff',
                boxShadow: 'var(--shadow-card)',
                border: '1px solid rgba(243,232,224,0.8)',
              }}
            >
              <div
                className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center text-3xl animate-float"
                style={{ background: 'linear-gradient(135deg, #fce4ec, #fff3e0)' }}
              >
                🌸
              </div>
              <h2
                className="font-display font-bold text-xl mb-3"
                style={{ fontFamily: "'Playfair Display', serif", color: '#2c1810' }}
              >
                No Favorites Yet
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: '#8b7060' }}>
                Browse our collections and heart the arrangements that speak to you — they'll appear here.
              </p>
              <Link
                to="/shop"
                className="btn-luxury btn-luxury-primary block w-full"
              >
                Explore Collection
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
