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
      <div className="
        flex items-center justify-between  
        max-w-6xl mx-auto                   
        p-4                               
      ">
        <Link 
          to="/" 
          className="text-xl font-bold text-gray-800 hover:text-teal-600 transition-colors"
        >
          Father's Flower Shop
        </Link>
        
        <nav className="flex items-center gap-4 sm:gap-6">
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