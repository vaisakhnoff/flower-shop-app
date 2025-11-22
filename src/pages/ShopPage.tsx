import { useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs'; 
import { useLanguage } from '../context/LanguageContext'; // Import hook

export default function ShopPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products, isLoading, error, hasMore, loadMore } = useProducts(slug);
  const { t } = useLanguage(); // Get translations

  const formatSlug = (str: string) => {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Use translated labels for Breadcrumbs
  const breadcrumbItems = [
    { label: t.home, to: '/' },
    { label: t.shop, to: '/shop' },
  ];

  if (slug) {
    breadcrumbItems.push({ label: formatSlug(slug), to: `/shop/${slug}` });
  }

  if (isLoading && products.length === 0) {
    return <div className="p-10 text-center text-lg">{t.loading}</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-lg text-red-600">{t.error}: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <Breadcrumbs items={breadcrumbItems} />

      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 capitalize">
        {slug ? `${t.categoryPrefix}${formatSlug(slug)}` : t.allProducts}
      </h2>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 sm:gap-6 mb-8">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 py-10">
            {t.noProducts}
          </p>
        )}
      </div>

      {hasMore && (
        <div className="flex justify-center pb-8">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-full hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t.loading : 'Load More Products'}
          </button>
        </div>
      )}
    </div>
  );
}