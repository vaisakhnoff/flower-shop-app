import { Link } from 'react-router-dom';
// We no longer need to import 'CategoryCard.css'
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
        block p-6                           
        bg-white                           
        border border-gray-200             
        rounded-lg                         
        shadow-sm                          
        text-center                        
        text-gray-800                      
        no-underline                       
        transition-all duration-300 ease-in-out 
        hover:shadow-md                    
        hover:-translate-y-1               
      "
    >
      {/* block p-6: Make it a block element with padding
        bg-white border...: Standard card styling
        transition...: Smooth transition for hover effects
        hover:shadow-md: Add a medium shadow on hover
        hover:-translate-y-1: Lift the card up slightly on hover
      */}
      <h3 className="text-lg font-semibold mb-1">
        {category.name}
      </h3>
      <p className="text-sm text-gray-500">
        {category.itemCount} items
      </p>
    </Link>
  );
}