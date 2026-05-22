import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../context/FavoritesContext';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { favorites } = useFavorites();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const favCount = favorites.length;

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ml' : 'en');
  };

  const isActive = (path: string) => location.pathname === path;

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  useEffect(() => { closeMobileMenu(); }, [location.pathname, closeMobileMenu]);

  const navLinks = [
    { path: '/', label: t.home, icon: '🏠' },
    { path: '/shop', label: t.shop, icon: '🌺' },
    { path: '/favorites', label: t.favorites, icon: '❤️' },
    { path: '/contact', label: t.contact, icon: '📞' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? 'nav-glass' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">

            {/* ── Logo ── */}
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="flex items-center gap-2.5 group z-50 relative"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-pink-100 to-yellow-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <span className="text-base sm:text-lg leading-none">🌸</span>
              </div>
              <div className="leading-none">
                <span
                  className="block font-bold text-lg sm:text-xl text-[#2c1810] tracking-tight group-hover:text-[#c9922c] transition-colors duration-300"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Anjali Flowers
                </span>
                <span className="block text-[10px] sm:text-xs text-[#c9922c] tracking-[0.18em] uppercase font-semibold">
                  Floral Design Studio
                </span>
              </div>
            </Link>

            {/* ── Desktop Navigation ── */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? 'text-[#c9922c] bg-[#fef3e2]'
                      : 'text-[#4a3728] hover:text-[#c9922c] hover:bg-[#fef3e2]'
                  }`}
                >
                  {link.label}
                  {link.path === '/favorites' && favCount > 0 && (
                    <span className="fav-count-badge">{favCount > 9 ? '9+' : favCount}</span>
                  )}
                  {isActive(link.path) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#c9922c]" />
                  )}
                </Link>
              ))}

              {/* Divider */}
              <div className="w-px h-5 bg-[#f3e8e0] mx-2" />

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="px-4 py-2 text-xs font-semibold rounded-full border border-[#e8d5b7] text-[#c9922c] hover:bg-[#fef3e2] transition-all duration-200 tracking-wide"
              >
                {language === 'en' ? 'മലയാളം' : 'ENG'}
              </button>
            </nav>

            {/* ── Mobile: Fav icon + Hamburger ── */}
            <div className="flex items-center gap-2 md:hidden">
              <Link
                to="/favorites"
                className="relative p-2 rounded-xl transition-all duration-200 hover:bg-[#fef3e2]"
                aria-label="Favorites"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={favCount > 0 ? '#f43b6a' : 'none'} stroke={favCount > 0 ? '#f43b6a' : '#4a3728'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {favCount > 0 && (
                  <span className="fav-count-badge">{favCount > 9 ? '9+' : favCount}</span>
                )}
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="z-50 relative p-2 rounded-xl hover:bg-[#fef3e2] transition-all duration-200"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span className={`block w-full h-0.5 rounded-full bg-[#4a3728] transition-all duration-300 origin-center ${isMobileMenuOpen ? 'rotate-45 translate-y-[7.5px]' : ''}`} />
                  <span className={`block w-4/5 h-0.5 rounded-full bg-[#4a3728] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 translate-x-2' : ''}`} />
                  <span className={`block w-full h-0.5 rounded-full bg-[#4a3728] transition-all duration-300 origin-center ${isMobileMenuOpen ? '-rotate-45 -translate-y-[7.5px]' : ''}`} />
                </div>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ── Mobile Menu Backdrop ── */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-400 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(44, 24, 16, 0.55)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
        onClick={closeMobileMenu}
      />

      {/* ── Mobile Slide-in Menu ── */}
      <nav
        className={`fixed top-0 right-0 h-full w-72 max-w-[85vw] z-50 md:hidden transform transition-transform duration-400 ease-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ background: '#fffdf9' }}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#f3e8e0]">
          <div>
            <p className="font-bold text-[#2c1810] text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
              Anjali Flowers
            </p>
            <p className="text-[10px] text-[#c9922c] tracking-[0.2em] uppercase font-semibold">Floral Design Studio</p>
          </div>
          <button
            onClick={closeMobileMenu}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-[#f9f0e7] text-[#8b7060] hover:bg-[#fce4ec] hover:text-[#c9922c] transition-all duration-200"
            aria-label="Close menu"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Nav Links */}
        <div className="px-4 py-5 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[0.95rem] font-medium transition-all duration-200 ${
                isActive(link.path)
                  ? 'bg-gradient-to-r from-[#fef3e2] to-[#fce9f3] text-[#c9922c] shadow-sm'
                  : 'text-[#4a3728] hover:bg-[#fef9f0] hover:text-[#c9922c]'
              }`}
            >
              <span className="text-base">{link.icon}</span>
              <span>{link.label}</span>
              {link.path === '/favorites' && favCount > 0 && (
                <span
                  className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ background: '#f43b6a' }}
                >
                  {favCount}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Language + Bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-6 border-t border-[#f3e8e0]">
          <p className="text-[10px] text-[#b0997a] uppercase tracking-[0.2em] font-semibold mb-3 px-2">Language</p>
          <button
            onClick={() => { toggleLanguage(); closeMobileMenu(); }}
            className="w-full py-3 px-4 rounded-2xl text-sm font-semibold border border-[#e8d5b7] text-[#c9922c] hover:bg-[#fef3e2] transition-all duration-200"
          >
            {language === 'en' ? 'Switch to മലയാളം' : 'Switch to English'}
          </button>
        </div>
      </nav>
    </>
  );
}
