import { Link } from 'react-router-dom';
import { type Category } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const categoryLink = `/shop/${category.slug}`;
  const { language } = useLanguage();

  const displayName = (language === 'ml' && category.name_ml) ? category.name_ml : category.name;

  return (
    <Link
      to={categoryLink}
      className="group block relative rounded-2xl sm:rounded-3xl overflow-hidden"
      style={{
        aspectRatio: '3 / 4',
        boxShadow: 'var(--shadow-card)',
        transition: 'all 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Image layer */}
      <div className="absolute inset-0 img-zoom">
        {category.imageUrl ? (
          <img
            src={category.imageUrl}
            alt={displayName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-5xl"
            style={{ background: 'linear-gradient(135deg, #fce4ec, #fff3e0, #fce8f0)' }}
          >
            🌸
          </div>
        )}
      </div>

      {/* Gradient overlay — base */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(to top, rgba(44,24,16,0.82) 0%, rgba(44,24,16,0.18) 55%, transparent 100%)',
        }}
      />

      {/* Gradient overlay — hover intensify */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(to top, rgba(44,24,16,0.92) 0%, rgba(44,24,16,0.35) 60%, rgba(201,146,44,0.08) 100%)',
        }}
      />

      {/* Item count badge - top right */}
      <div className="absolute top-3 right-3 z-10">
        <span
          className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm"
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)',
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: '0.05em',
          }}
        >
          {category.itemCount} {category.itemCount === 1 ? 'piece' : 'pieces'}
        </span>
      </div>

      {/* Content at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10 transform transition-transform duration-500 group-hover:translate-y-0">
        {/* Name */}
        <h3
          className="font-display font-bold text-white leading-tight mb-1.5 line-clamp-2"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1rem, 3vw, 1.25rem)',
            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          {displayName}
        </h3>

        {/* Explore link - appears on hover */}
        <div
          className="flex items-center gap-1.5 overflow-hidden transition-all duration-400 group-hover:max-h-8 max-h-0"
        >
          <span
            className="text-[11px] font-semibold tracking-[0.15em] uppercase"
            style={{ color: '#e8c06a' }}
          >
            Explore
          </span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#e8c06a]">
            <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Gold border on hover */}
      <div
        className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ border: '1.5px solid rgba(201,146,44,0.4)' }}
      />
    </Link>
  );
}
