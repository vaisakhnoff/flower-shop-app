import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { useFavorites } from '../context/FavoritesContext';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading, error } = useProduct(id);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // 1. Create a "Ref" to access the scroll container directly
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 2. Auto-Scroll Logic (5 Seconds)
  useEffect(() => {
    // Only run if we have images and more than one
    if (!product?.images || product.images.length <= 1) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, clientWidth, scrollWidth } = scrollContainerRef.current;
        
        // Check if we are at the end of the scroll
        // We use a small buffer (10px) to be safe
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;

        // If at end, go back to 0. Otherwise, scroll one "page" (clientWidth) to the right.
        const nextPosition = isAtEnd ? 0 : scrollLeft + clientWidth;

        scrollContainerRef.current.scrollTo({
          left: nextPosition,
          behavior: 'smooth'
        });
      }
    }, 5000); // 5000ms = 5 seconds

    // Cleanup function to stop the timer when component unmounts
    return () => clearInterval(interval);
  }, [product]); // Re-run if product loads/changes

  if (isLoading) {
    return <div className="p-10 text-center text-lg">Loading product...</div>;
  }
  if (error) {
    return <div className="p-10 text-center text-lg text-red-600">Error: {error}</div>;
  }
  if (!product) {
    return <div className="p-10 text-center text-lg">Product not found.</div>;
  }

  const isAlreadyFavorite = isFavorite(product.id);

  const handleWhatsAppContact = () => {
    if (!WHATSAPP_NUMBER) {
      alert("Sorry, contact feature is not configured.");
      return;
    }
    const productUrl = window.location.href;
    const message = `Hi, I'm interested in this product:\n\n${product.name}\n\nYou can see it here: ${productUrl}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
  };

  const handleFavoriteClick = () => {
    isAlreadyFavorite ? removeFavorite(product.id) : addFavorite(product);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollPosition = e.currentTarget.scrollLeft;
    const width = e.currentTarget.offsetWidth;
    const index = Math.round(scrollPosition / width);
    setActiveImageIndex(index);
  };

  // Helper to scroll when clicking a dot
  const scrollToImage = (index: number) => {
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: width * index,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:grid md:grid-cols-2 md:gap-8 md:py-12">
      
      {/* === IMAGE CAROUSEL === */}
      <div className="w-full mb-6 md:mb-0 relative group">
        <div 
          ref={scrollContainerRef} // Attach the ref here
          onScroll={handleScroll}
          className="
            flex 
            overflow-x-auto 
            snap-x snap-mandatory 
            scrollbar-hide 
            rounded-xl 
            aspect-square 
            bg-gray-100
          "
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
        >
          {product.images && product.images.length > 0 ? (
            product.images.map((img, index) => (
              <img 
                key={index}
                src={img} 
                alt={`${product.name} - view ${index + 1}`} 
                className="
                  w-full 
                  flex-shrink-0 
                  snap-center 
                  object-cover
                "
              />
            ))
          ) : (
             <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image Available
             </div>
          )}
        </div>

        {/* Dots Indicator */}
        {product.images && product.images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10 pointer-events-none">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToImage(index)} // Make dots clickable
                className={`
                  w-2 h-2 rounded-full transition-all duration-300 pointer-events-auto cursor-pointer
                  ${index === activeImageIndex ? 'bg-white w-4 shadow-md scale-110' : 'bg-white/60 hover:bg-white/80'}
                `}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* === PRODUCT INFO === */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 md:text-4xl">
          {product.name}
        </h1>
        
        <p className="text-2xl font-light text-gray-700 mb-4 md:text-3xl">
          ₹{product.price.toLocaleString('en-IN')}
        </p>
        
        <p className="text-base text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
          {product.description}
        </p>
        
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="border-t border-gray-200 pt-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Specifications</h3>
            <ul className="list-none p-0">
              {Object.entries(product.specifications).map(([key, value]) => (
                <li key={key} className="text-sm text-gray-600 mb-1 capitalize">
                  <span className="font-medium text-gray-800">{key}:</span> {value}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex flex-col gap-3 w-full md:flex-row md:items-center mt-auto">
          <button 
            className="w-full md:w-auto flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 shadow-sm"
            onClick={handleWhatsAppContact}
          >
            Contact on WhatsApp
          </button>
          
          <button 
            className={`
              w-full md:w-auto font-bold py-3 px-6 rounded-lg transition duration-200 border-2
              ${isAlreadyFavorite 
                ? 'bg-yellow-100 border-yellow-400 text-yellow-800' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            `}
            onClick={handleFavoriteClick}
          >
            {isAlreadyFavorite ? '♥ Saved' : '♡ Save'}
          </button>
        </div>
      </div>
    </div>
  );
}