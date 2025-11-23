import { Link } from 'react-router-dom';
import { type Category } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const categoryLink = `/shop/${category.slug}`;
  const { language } = useLanguage();

  const displayName = (language === 'ml' && category.name_ml) ? category.name_ml : category.name;

  return (
    <Link
      to={categoryLink}
      className="group block relative aspect-[3/4] sm:aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 ease-out hover:-translate-y-1"
    >
      {/* Image with Zoom Effect */}
      <div className="absolute inset-0 w-full h-full">
        {category.imageUrl ? (
          <img 
            src={category.imageUrl} 
            alt={displayName}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-100 via-blush-50 to-champagne-100 text-4xl sm:text-5xl md:text-6xl">
            🌸
          </div>
        )}
      </div>

      {/* Gradient Overlay - Rose/Champagne tones */}
      <div className="absolute inset-0 bg-gradient-to-t from-rose-900/80 via-rose-800/30 to-transparent group-hover:from-rose-900/90 transition-all duration-500" />

      {/* Content Overlay - Compact for Mobile */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5 lg:p-6">
        <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-serif font-bold text-white mb-1 transform transition-transform duration-500 group-hover:translate-y-[-2px] leading-tight line-clamp-2">
          {displayName}
        </h3>
        <p className="text-xs sm:text-sm text-rose-50/90 font-medium">
          {category.itemCount} {category.itemCount === 1 ? 'item' : 'items'}
        </p>
      </div>
    </Link>
  );
}
