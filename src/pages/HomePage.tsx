import { useCategories } from '../hooks/useCategories'; // 1. Use our hook
import CategoryCard from '../components/CategoryCard'; // 2. Use our component
import './HomePage.css'; // We'll add styles for the grid

export default function HomePage() {
  // 3. Get data, loading, and error state from our hook
  const { categories, isLoading, error } = useCategories();

  // 4. Handle loading state
  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  // 5. Handle error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // 6. Render the data
  return (
    <div className="home-page">
      <h2>Categories</h2>
      <p>Browse our products by category.</p>
      
      <div className="category-grid">
        {categories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}