import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ml' : 'en');
  };

  const isActive = (path: string) => location.pathname === path;

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  // Track scroll position for nav style
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  // Close on route change
  useEffect(() => { closeMobileMenu(); }, [location.pathname, closeMobileMenu]);

  const navLinks = [
    { path: '/', label: t.home },
    { path: '/shop', label: t.shop },
    { path: '/favorites', label: t.favorites },
    { path: '/contact', label: t.contact },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? 'nav-glass shadow-[0_1px_0_rgba(0,0,0,0.06),0_4px_24px_rgba(0,0,0,0.06)]' : 'bg-transparent'
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
              {/* Petal icon */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blush-200 to-cream-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <span className="text-base sm:text-lg leading-none">🌸</span>
              </div>
              <div className="leading-none">
                <span
                  className="block font-display font-bold text-lg sm:text-xl text-[#2c1810] tracking-tight group-hover:text-[#c9922c] transition-colors duration-300"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Anjali Flowers
                </span>
                <span className="block text-[10px] sm:text-xs font-sans text-[#c9922c] tracking-[0.18em] uppercase font-medium">
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

            {/* ── Mobile Hamburger ── */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden z-50 relative p-2 rounded-xl hover:bg-[#fef3e2] transition-all duration-200"
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
      </header>

      {/* ── Mobile Menu Backdrop ── */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-400 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          background: 'rgba(44, 24, 16, 0.5)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
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
            <p className="font-display font-bold text-[#2c1810] text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
              Anjali Flowers
            </p>
            <p className="text-[10px] text-[#c9922c] tracking-[0.2em] uppercase font-medium">Floral Design Studio</p>
          </div>
          <button
            onClick={closeMobileMenu}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-[#f9f0e7] text-[#8b7060] hover:bg-[#fce4ec] hover:text-[#c9922c] transition-all duration-200"
            aria-label="Close menu"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
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
              {isActive(link.path) && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9922c] flex-shrink-0" />
              )}
              <span className={isActive(link.path) ? 'ml-0' : 'ml-[18px]'}>
                {link.label}
              </span>
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
