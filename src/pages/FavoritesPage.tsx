import { useFavorites } from '../context/FavoritesContext';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const { t } = useLanguage();

  const handleBulkWhatsApp = () => {
    if (!WHATSAPP_NUMBER || favorites.length === 0) return;
    const itemList = favorites
      .map((p, i) => `${i + 1}. *${p.name}* — ${window.location.origin}/product/${p.id}`)
      .join('\n');
    const msg = encodeURIComponent(
      `Hi! I've browsed your flower catalog and I'm interested in the following arrangements:\n\n${itemList}\n\nCould you please share the price and availability for these?`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen" style={{ background: '#fffdf9' }}>

      {/* Page Banner */}
      <div
        className="relative px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-8 sm:pb-10 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #fff5f7 0%, #fffdf5 50%, #fef5e4 100%)' }}
      >
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-40 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #ffc9d5, transparent)' }} />

        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] uppercase mb-1" style={{ color: '#c9922c' }}>
                ❤️ Saved Items
              </p>
              <h1
                className="font-bold leading-tight mb-1"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: '#2c1810',
                  fontSize: 'clamp(1.8rem, 5vw, 3rem)',
                  letterSpacing: '-0.02em',
                }}
              >
                {t.yourFavorites || 'Your Wishlist'}
              </h1>
              <p className="text-sm font-medium" style={{ color: '#8b7060' }}>
                {favorites.length > 0
                  ? `${favorites.length} ${favorites.length === 1 ? 'arrangement' : 'arrangements'} saved`
                  : 'Heart any arrangement to save it here'}
              </p>
            </div>

            {/* Bulk WhatsApp CTA */}
            {favorites.length > 0 && (
              <button
                onClick={handleBulkWhatsApp}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-white text-sm transition-all duration-300 hover:scale-105 active:scale-95 flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #25D366, #1fbe5a)',
                  boxShadow: '0 4px 20px rgba(37,211,102,0.3)',
                }}
              >
                <WhatsAppIcon />
                Ask About All {favorites.length} Items
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {favorites.length > 0 ? (
          <>
            {/* Info banner */}
            <div
              className="flex items-start gap-3 p-4 rounded-2xl mb-6 animate-fade-in"
              style={{
                background: 'rgba(37,211,102,0.06)',
                border: '1px solid rgba(37,211,102,0.2)',
              }}
            >
              <span className="text-xl flex-shrink-0 mt-0.5">💡</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#1a6b38' }}>
                  Ready to inquire?
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#3a8a50' }}>
                  Use the "Ask on WhatsApp" button on any product, or tap "Ask About All Items" above to send your entire wishlist in one message.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
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
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div
              className="w-24 h-24 rounded-full mx-auto mb-5 flex items-center justify-center text-4xl animate-float"
              style={{ background: 'linear-gradient(135deg, #fce4ec, #fff3e0)' }}
            >
              🌸
            </div>
            <h2
              className="font-bold text-xl mb-3"
              style={{ fontFamily: "'Playfair Display', serif", color: '#2c1810' }}
            >
              Your Wishlist is Empty
            </h2>
            <p className="text-sm leading-relaxed mb-8 text-center max-w-xs" style={{ color: '#8b7060' }}>
              Browse our collections, tap the ❤️ on any arrangement you like, and they'll appear here for easy inquiring.
            </p>
            <Link
              to="/shop"
              className="btn-luxury btn-luxury-primary"
            >
              Browse Catalog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
