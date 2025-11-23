import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ml' : 'en');
  };

  const isActive = (path: string) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overscrollBehavior = 'none';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overscrollBehavior = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overscrollBehavior = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { path: '/', label: t.home },
    { path: '/shop', label: t.shop },
    { path: '/favorites', label: t.favorites },
    { path: '/contact', label: t.contact },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md border-b border-amber-100">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3 md:px-6">
        {/* Logo */}
        <Link 
          to="/" 
          onClick={closeMobileMenu}
          className="text-xl sm:text-2xl md:text-2xl font-serif font-bold text-amber-600 hover:text-amber-700 transition-colors duration-300 z-50 relative"
        >
          Father's Flower Shop
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={`relative text-base font-semibold transition-colors duration-300 ${
                isActive(link.path) 
                  ? 'text-red-600' 
                  : 'text-amber-700 hover:text-red-600'
              }`}
            >
              {link.label}
              {isActive(link.path) && (
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-red-600 rounded-full"></span>
              )}
            </Link>
          ))}
          
          {/* Desktop Language Toggle */}
          <button 
            onClick={toggleLanguage}
            className="text-sm font-bold border-2 border-amber-500 text-amber-600 rounded-lg px-4 py-1.5 hover:bg-amber-500 hover:text-white active:scale-95 transition-all duration-200"
          >
            {language === 'en' ? 'മലയാളം' : 'ENG'}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden z-50 p-2 rounded-lg hover:bg-amber-50 transition-colors duration-200 relative"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span 
              className={`w-full h-0.5 rounded-full transition-all duration-300 ${
                isMobileMenuOpen ? 'bg-amber-800 rotate-45 translate-y-2' : 'bg-gray-900'
              }`}
            />
            <span 
              className={`w-full h-0.5 rounded-full transition-all duration-300 ${
                isMobileMenuOpen ? 'bg-amber-800 opacity-0' : 'bg-gray-900'
              }`}
            />
            <span 
              className={`w-full h-0.5 rounded-full transition-all duration-300 ${
                isMobileMenuOpen ? 'bg-amber-800 -rotate-45 -translate-y-2' : 'bg-gray-900'
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay - 30% transparent (70% opaque) */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 md:hidden ${
          isMobileMenuOpen ? 'opacity-70 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Navigation Menu - Right side */}
      <nav
        className={`fixed inset-y-0 right-0 w-64 max-w-full bg-white z-50 transform transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ touchAction: 'pan-y' }}
      >
        <div className="flex flex-col h-full pt-16 px-6 pb-6">
          {/* Logo in Menu */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-black text-lg font-serif font-bold">Father's Flower Shop</h2>
          </div>

          {/* Mobile Nav Links */}
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                onClick={closeMobileMenu}
                className={`py-3 px-4 text-base font-semibold transition-all duration-300 rounded-lg ${
                  isActive(link.path) 
                    ? 'bg-red-600 text-white shadow-lg' 
                    : 'text-black hover:bg-gray-100 hover:text-red-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Language Toggle */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <p className="text-black text-xs uppercase tracking-wider mb-2 font-semibold">Language</p>
            <button 
              onClick={toggleLanguage}
              className="w-full text-sm font-bold border-2 border-amber-600 text-black rounded-lg px-4 py-2.5 hover:bg-amber-600 hover:text-white active:scale-95 transition-all duration-200"
            >
              {language === 'en' ? 'മലയാളം' : 'English'}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
