import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { useFavorites } from '../context/FavoritesContext';
import Breadcrumbs from '../components/Breadcrumbs'; 
import { useLanguage } from '../context/LanguageContext';
import ZoomableImage from '../components/ZoomableImage';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading, error } = useProduct(id);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { t, language } = useLanguage(); 
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollPosition = e.currentTarget.scrollLeft;
    const width = e.currentTarget.offsetWidth;
    setActiveImageIndex(Math.round(scrollPosition / width));
  };

  const scrollToImage = (index: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ 
        left: scrollContainerRef.current.clientWidth * index, 
        behavior: 'smooth' 
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mb-4"></div>
          <p className="text-base sm:text-lg text-gray-700">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-rose-50 to-white">
        <div className="text-center max-w-md">
          <p className="text-base sm:text-lg text-red-600">{t.error}: {error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-rose-50 to-white">
        <div className="text-center max-w-md">
          <p className="text-base sm:text-lg text-gray-600">{t.noProducts}</p>
        </div>
      </div>
    );
  }

  const isAlreadyFavorite = isFavorite(product.id);
  const displayName = (language === 'ml' && product.name_ml) ? product.name_ml : product.name;

  const handleWhatsAppContact = () => {
    if (!WHATSAPP_NUMBER) { 
      alert("Sorry, contact feature is not configured."); 
      return; 
    }
    const productUrl = window.location.href;
    const message = `Hi, I'm interested in this product:\n\n${displayName}\n\nYou can see it here: ${productUrl}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, 
      '_blank', 
      'noopener,noreferrer'
    );
  };

  const handleFavoriteClick = () => {
    if (isAlreadyFavorite) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  const formatSlug = (str: string) => 
    str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Breadcrumbs Section - Wedding Theme */}
      <div className="bg-white border-b border-rose-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3">
          <Breadcrumbs items={[
            { label: t.home, to: '/' },
            { label: t.shop, to: '/shop' },
            ...(product.categorySlug ? [{ 
              label: formatSlug(product.categorySlug), 
              to: `/shop/${product.categorySlug}` 
            }] : []),
            { label: displayName }
          ]} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
          
          {/* IMAGE CAROUSEL - Mobile Optimized */}
          <div className="w-full relative">
            <div 
              ref={scrollContainerRef} 
              onScroll={handleScroll}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-xl sm:rounded-2xl aspect-square bg-white shadow-md border border-rose-100/50"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                scrollBehavior: 'smooth'
              }} 
            >
              {product.images && product.images.length > 0 ? (
                product.images.map((img, index) => (
                  <div 
                    key={index}
                    className="w-full flex-shrink-0 snap-center h-full"
                  >
                    <ZoomableImage 
                      src={img} 
                      alt={`${displayName} - view ${index + 1}`} 
                    />
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-rose-50 to-champagne-50">
                  <span className="text-5xl">🌸</span>
                </div>
              )}
            </div>

            {/* Stylish Carousel Indicators - Wedding Theme */}
            {product.images && product.images.length > 1 && (
              <div className="flex justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToImage(index)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index === activeImageIndex 
                        ? 'bg-rose-600 w-7 sm:w-8' 
                        : 'bg-rose-200 w-5 sm:w-6 hover:bg-rose-300'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT INFORMATION - Mobile First */}
          <div className="flex flex-col bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-rose-100/50">
            {/* Product Name - Responsive Typography */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              {displayName}
            </h1>
            
            {/* Price - Wedding Rose Color */}
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-rose-700 mb-4 sm:mb-6">
              ₹{product.price.toLocaleString('en-IN')}
            </p>
            
            {/* Description - Mobile Optimized */}
            <div className="mb-6 sm:mb-8">
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
            
            {/* Specifications - Compact Mobile Design */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="border-t border-rose-100 pt-4 sm:pt-6 mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-serif font-bold text-gray-900 mb-3 sm:mb-4">
                  {t.specifications}
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <div 
                      key={key} 
                      className={`flex justify-between items-center py-2 sm:py-3 ${
                        index !== Object.keys(product.specifications).length - 1 
                          ? 'border-b border-rose-50' 
                          : ''
                      }`}
                    >
                      <span className="text-xs sm:text-sm md:text-base font-medium text-gray-700 capitalize">
                        {key}
                      </span>
                      <span className="text-xs sm:text-sm md:text-base text-gray-900 font-semibold text-right ml-4">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* ACTION BAR - Mobile First with Wedding Colors */}
            <div className="flex flex-col gap-2.5 sm:gap-3 mt-auto">
              {/* WhatsApp CTA - Dominant Button */}
              <button 
                className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm sm:text-base md:text-lg py-3 sm:py-3.5 md:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 sm:gap-3"
                onClick={handleWhatsAppContact}
              >
                <svg 
                  className="w-5 h-5 sm:w-6 sm:h-6" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span className="truncate">{t.contactWhatsApp}</span>
              </button>
              
              {/* Favorite - Wedding Rose Theme */}
              <button 
                className={`w-full font-semibold text-sm sm:text-base py-3 sm:py-3.5 md:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 border-2 ${
                  isAlreadyFavorite 
                    ? 'bg-rose-600 border-rose-600 text-white hover:bg-rose-700 hover:border-rose-700' 
                    : 'bg-white border-rose-300 text-rose-700 hover:border-rose-600 hover:bg-rose-50'
                }`}
                onClick={handleFavoriteClick}
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="text-lg sm:text-xl">
                    {isAlreadyFavorite ? '♥' : '♡'}
                  </span>
                  <span className="truncate">
                    {isAlreadyFavorite ? t.saved : t.addToFavorites}
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
