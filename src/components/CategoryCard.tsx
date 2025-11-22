import { Link } from 'react-router-dom';
import { type Category } from '../types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const categoryLink = `/shop/${category.slug}`;

  return (
    <Link
      to={categoryLink}
      className="
        group
        block                           
        bg-white                           
        border border-gray-200             
        rounded-xl                         
        shadow-sm                          
        overflow-hidden
        transition-all duration-300 ease-in-out 
        hover:shadow-md                    
        hover:-translate-y-1               
      "
    >
      {/* Image Area */}
      <div className="relative h-32 w-full bg-gray-100 overflow-hidden">
        {category.imageUrl ? (
          <img 
            src={category.imageUrl} 
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Fallback Emoji if no image */
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🌸
          </div>
        )}
        
        {/* Dark gradient overlay for better text readability if we put text over image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content Area */}
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-teal-600 transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-gray-500">
          {category.itemCount} items
        </p>
      </div>
    </Link>
  );
}