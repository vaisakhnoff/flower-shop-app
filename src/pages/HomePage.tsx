import { useCategories } from '../hooks/useCategories';
import CategoryCard from '../components/CategoryCard';
// We no longer need to import './HomePage.css'

export default function HomePage() {
  const { categories, isLoading, error } = useCategories();

  // We can use Tailwind classes for the loading/error states too
  if (isLoading) {
    return <div className="p-10 text-center text-lg">Loading categories...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-lg text-red-600">Error: {error}</div>;
  }

  return (
    <div className="
      max-w-6xl 
      mx-auto 
      p-4 sm:p-6 lg:p-8
    ">
      {/* max-w-6xl: Sets a max-width for the content
        mx-auto: Centers the content
        p-4 sm:p-6 lg:p-8: Responsive padding (mobile, small, large)
      */}
      <h2 className="
        text-2xl sm:text-3xl 
        font-bold 
        text-gray-800 
        mb-2
      ">
        Categories
      </h2>
      <p className="text-base text-gray-600 mb-6">
        Browse our products by category.
      </p>
      
      <div className="
        grid 
        grid-cols-2 
        gap-4 
        sm:grid-cols-3 
        md:grid-cols-4 
        lg:grid-cols-5
        sm:gap-6
      ">
        {/* grid: Enables grid layout
          grid-cols-2 sm:grid-cols-3...: Responsive grid columns
            - 2 columns on mobile (default)
            - 3 columns on small screens (sm)
            - 4 columns on medium screens (md)
            - 5 columns on large screens (lg)
          gap-4 sm:gap-6: Responsive gaps between cards
        */}
        {categories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}