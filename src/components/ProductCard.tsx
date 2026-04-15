import { type Product } from '../types';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function ProductCard({ product }: { product: Product }) {
  const { language } = useLanguage();
  const displayName = (language === 'ml' && product.name_ml) ? product.name_ml : product.name;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block bg-white overflow-hidden"
      style={{
        borderRadius: '20px',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid rgba(243, 232, 224, 0.8)',
        transition: 'all 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card-hover)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Image Container */}
      <div
        className="relative overflow-hidden img-zoom"
        style={{ aspectRatio: '3/4', background: 'linear-gradient(135deg, #fce4ec, #fff3e0)' }}
      >
        {product.images && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={displayName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🌸
          </div>
        )}

        {/* Subtle top vignette */}
        <div
          className="absolute inset-x-0 top-0 h-16 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.08), transparent)' }}
        />

        {/* Quick View overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400"
          style={{ background: 'rgba(44,24,16,0.15)' }}
        >
          <span
            className="px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase backdrop-blur-sm"
            style={{
              background: 'rgba(255,253,249,0.92)',
              color: '#4a3728',
              border: '1px solid rgba(255,255,255,0.6)',
              transform: 'translateY(6px)',
              transition: 'transform 0.3s ease',
            }}
          >
            View Details
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-4">
        {/* Name */}
        <h3
          className="font-medium text-[0.875rem] sm:text-[0.9375rem] leading-snug mb-2 line-clamp-2 transition-colors duration-200 group-hover:text-[#c9922c]"
          style={{
            color: '#2c1810',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {displayName}
        </h3>

        {/* Price row */}
        <div className="flex items-center justify-between">
          <p
            className="font-bold text-base sm:text-lg"
            style={{
              color: '#c9922c',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ₹{product.price.toLocaleString('en-IN')}
          </p>

          {/* Arrow indicator */}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
            style={{ background: 'linear-gradient(135deg, #fce4ec, #fff3e0)', color: '#c9922c' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
