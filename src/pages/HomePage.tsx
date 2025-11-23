import { useCategories } from '../hooks/useCategories';
import CategoryCard from '../components/CategoryCard';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage() {
  const { categories, isLoading, error } = useCategories();
  const { t } = useLanguage();

  if (isLoading) {
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
      {/* Hero Section - Compact for Mobile */}
      <section className="relative bg-gradient-to-br from-rose-100 via-blush-50 to-champagne-100 py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-rose-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-56 h-56 sm:w-80 sm:h-80 bg-amber-100/30 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 tracking-tight leading-tight px-2">
            {t.heroTitle}
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-2">
            {t.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Category Grid Section - Compact Mobile Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        {/* Section Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-1.5 sm:mb-2">
            {t.categories}
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed">
            {t.browseCategories}
          </p>
        </div>
        
        {/* Compact 2-Column Mobile Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-12 sm:py-16 md:py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-rose-100 rounded-full mb-4">
              <span className="text-3xl sm:text-4xl">🌺</span>
            </div>
            <p className="text-base sm:text-lg text-gray-600">
              No categories available yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
