import { useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs'; 
import { useLanguage } from '../context/LanguageContext';

export default function ShopPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products, isLoading, error, hasMore, loadMore } = useProducts(slug);
  const { t } = useLanguage();

  const formatSlug = (str: string) => {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const breadcrumbItems = [
    { label: t.home, to: '/' },
    { label: t.shop, to: '/shop' },
  ];

  if (slug) {
    breadcrumbItems.push({ label: formatSlug(slug), to: `/shop/${slug}` });
  }

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mb-4"></div>
          <p className="text-lg text-gray-700">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-lg text-red-600">{t.error}: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
        {/* Breadcrumbs - Mobile Optimized */}
        <div className="mb-4 sm:mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Header - Responsive Sizing */}
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-14">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 tracking-tight capitalize leading-tight">
            {slug ? formatSlug(slug) : t.allProducts}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-2">
            {products.length} {products.length === 1 ? 'product' : 'products'} available
          </p>
        </div>
        
        {/* Product Grid - Compact 2-Column Mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-8 sm:mb-10 md:mb-12">
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 sm:py-16 md:py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-rose-100 rounded-full mb-4">
                <span className="text-3xl sm:text-4xl">🌸</span>
              </div>
              <p className="text-base sm:text-lg text-gray-600">
                {t.noProducts}
              </p>
            </div>
          )}
        </div>

        {/* Load More Button - Wedding Theme */}
        {hasMore && (
          <div className="flex justify-center pb-6 sm:pb-8">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="group relative px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-rose-600 text-rose-700 font-semibold uppercase tracking-wider text-xs sm:text-sm rounded-full overflow-hidden transition-all duration-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-rose-700 shadow-md hover:shadow-lg"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-500 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0 group-disabled:translate-y-full"></span>
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.loading}
                  </>
                ) : (
                  'Load More'
                )}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
