import { type Product } from '../types';
// We no longer need to import 'ProductCard.css'
import { Link } from 'react-router-dom';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="
        group block                           
        bg-white                           
        border border-gray-200             
        rounded-lg                         
        shadow-sm                          
        overflow-hidden                    
        transition-all duration-300 ease-in-out
        hover:shadow-md                    
        hover:-translate-y-1               
      "
    >
      {/* group: We define this as a 'group' so we can use "group-hover"
        overflow-hidden: To keep the image corners rounded
      */}
      <div className="
        w-full 
        aspect-square 
        overflow-hidden
      ">
        {/* aspect-square: Ensures a 1:1 aspect ratio (square)
        */}
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="
            w-full h-full 
            object-cover                  
            transition-transform duration-300 
            group-hover:scale-105           
          "
        />
        {/* object-cover: Fills the container, cropping if needed
          group-hover:scale-105: On hover of the parent 'group', zoom the image
        */}
      </div>
      <div className="p-4">
        {/* p-4: Padding for the text content
        */}
        <h3 className="
          text-base font-semibold 
          text-gray-800 
          mb-1 
          truncate
        ">
          {/* truncate: Adds "..." if the text is too long */}
          {product.name}
        </h3>
        <p className="text-sm font-medium text-gray-600">
          ₹{product.price.toLocaleString('en-IN')}
        </p>
      </div>
    </Link>
  );
}