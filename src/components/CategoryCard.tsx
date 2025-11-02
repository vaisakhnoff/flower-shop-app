import { Link } from 'react-router-dom';
import type { Category } from '../types';
import './CategoryCard.css';

// This component takes a single 'category' object as a prop
type CategoryCardProps = {
  category: Category;
};

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    // Link to the specific shop page for this category's slug
    <Link to={`/shop/${category.slug}`} className="category-card">
      <div className="card-content">
        <h3>{category.name}</h3>
      </div>
    </Link>
  );
}
