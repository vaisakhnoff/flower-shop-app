// We no longer need to import 'Header.css'
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="
      sticky top-0 z-50 w-full            
      bg-white/95                       
      shadow-sm                         
      backdrop-blur-sm                  
      border-b border-gray-200
    ">
      {/* sticky top-0 z-50: Makes the header stick to the top
        bg-white/95: White background with 95% opacity
        shadow-sm: A light, modern shadow
        backdrop-blur-sm: Blurs content scrolling underneath (for iOS)
        border-b: A subtle bottom border
      */}
      <div className="
        flex items-center justify-between  
        max-w-6xl mx-auto                   
        p-4                               
      ">
        {/* flex items-center justify-between: The classic layout
          max-w-6xl mx-auto: A wide, centered container
          p-4: Padding
        */}
        <Link 
          to="/" 
          className="text-xl font-bold text-gray-800 hover:text-teal-600 transition-colors"
        >
          Father's Flower Shop
        </Link>
        
        <nav className="flex items-center gap-4 sm:gap-6">
          {/* gap-4 sm:gap-6: Puts 4px of space between links on mobile, 6px on small screens+
          */}
          <Link 
            to="/" 
            className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/shop" 
            className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors"
          >
            Shop
          </Link>
          <Link 
            to="/favorites" 
            className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors"
          >
            Favorites
          </Link>
          <Link 
            to="/contact" 
            className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}