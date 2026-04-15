import { useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';
import { useLanguage } from '../context/LanguageContext';

export default function ShopPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products, isLoading, error, hasMore, loadMore } = useProducts(slug);
  const { t } = useLanguage();

  const formatSlug = (str: string) =>
    str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const breadcrumbItems = [
    { label: t.home, to: '/' },
    { label: t.shop, to: '/shop' },
  ];
  if (slug) breadcrumbItems.push({ label: formatSlug(slug), to: `/shop/${slug}` });

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fffdf9' }}>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-t-[#c9922c] border-[#f3e8e0] animate-spin" />
          <p className="text-sm font-medium" style={{ color: '#8b7060' }}>{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-red-500 text-center">{t.error}: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#fffdf9' }}>

      {/* ── Page Banner ── */}
      <div
        className="relative px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-10 sm:pb-12 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #fff5f7 0%, #fffdf5 50%, #fef5e4 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-40 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #ffc9d5, transparent)' }} />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #fdf0c2, transparent)' }} />

        <div className="relative max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="mb-5">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          {/* Title */}
          <h1
            className="font-display font-bold leading-tight mb-2"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: '#2c1810',
              fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
              letterSpacing: '-0.02em',
            }}
          >
            {slug ? formatSlug(slug) : (t.allProducts || 'All Collections')}
          </h1>
          <div className="flex items-center gap-3">
            <div className="h-px w-8" style={{ background: 'linear-gradient(to right, #c9922c, transparent)' }} />
            <p className="text-sm font-medium" style={{ color: '#8b7060' }}>
              {products.length} {products.length === 1 ? 'arrangement' : 'arrangements'} available
            </p>
          </div>
        </div>
      </div>

      {/* ── Products ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-10">
              {products.map((product, i) => (
                <div
                  key={product.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${Math.min(i * 0.06, 0.5)}s`, animationFillMode: 'both' }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center pb-4">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="relative px-8 py-3 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden group"
                  style={{
                    border: '1.5px solid rgba(201,146,44,0.5)',
                    color: '#c9922c',
                    background: 'transparent',
                  }}
                >
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                    style={{ background: 'rgba(201,146,44,0.06)' }}
                  />
                  <span className="relative flex items-center gap-2">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Loading...
                      </>
                    ) : 'Load More'}
                  </span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-5"
              style={{ background: 'linear-gradient(135deg, #fce4ec, #fff3e0)' }}
            >
              🌺
            </div>
            <p className="text-base font-medium mb-1" style={{ color: '#4a3728' }}>
              {t.noProducts || 'No arrangements found'}
            </p>
            <p className="text-sm" style={{ color: '#8b7060' }}>
              Check back soon — new blooms are added regularly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
