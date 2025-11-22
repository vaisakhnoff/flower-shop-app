import { useCategories } from '../hooks/useCategories';
import CategoryCard from '../components/CategoryCard';
import { useLanguage } from '../context/LanguageContext'; // Import hook

export default function HomePage() {
  const { categories, isLoading, error } = useCategories();
  const { t } = useLanguage(); // Get translations

  if (isLoading) {
    return <div className="p-10 text-center text-lg">{t.loading}</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-lg text-red-600">{t.error}: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
        {t.categories}
      </h2>
      <p className="text-base text-gray-600 mb-6">
        {t.browseCategories}
      </p>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6">
        {categories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}