import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ml' : 'en');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 shadow-sm backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center justify-between max-w-6xl mx-auto p-4">
        <Link to="/" className="text-xl font-bold text-gray-800 hover:text-teal-600 transition-colors">
          Father's Flower Shop
        </Link>
        
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link to="/" className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">
            {t.home}
          </Link>
          <Link to="/shop" className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">
            {t.shop}
          </Link>
          <Link to="/favorites" className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">
            {t.favorites}
          </Link>
          <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">
            {t.contact}
          </Link> 
          
          {/* Language Toggle Button */}
          <button 
            onClick={toggleLanguage}
            className="text-sm font-bold border border-gray-300 rounded px-2 py-1 hover:bg-gray-100 transition-colors"
          >
            {language === 'en' ? 'മലയാളം' : 'ENG'}
          </button>
        </nav>
      </div>
    </header>
  );
}