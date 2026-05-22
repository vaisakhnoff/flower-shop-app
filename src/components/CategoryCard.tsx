import { Link } from 'react-router-dom';
import { type Category } from '../types';
import { useLanguage } from '../context/LanguageContext';

// Static emoji map for common flower category slugs
const CATEGORY_ICONS: Record<string, string> = {
  'garlands': '🌼',
  'bouquets': '💐',
  'car-bouquets': '🚗',
  'hand-bouquets': '👐',
  'stage-decorations': '✨',
  'wedding-decorations': '💍',
  'table-arrangements': '🌺',
  'flower-baskets': '🧺',
  'wreaths': '🌿',
  'centerpieces': '🌸',
  'corsages': '🌹',
  'door-hangings': '🎋',
};

function getCategoryIcon(slug: string): string {
  // Normalize slug and do best-match
  const normalized = slug.toLowerCase().replace(/\s+/g, '-');
  for (const key of Object.keys(CATEGORY_ICONS)) {
    if (normalized.includes(key.replace(/-/g, '')) || normalized.includes(key)) {
      return CATEGORY_ICONS[key];
    }
  }
  return '🌸';
}

interface CategoryCardProps {
  category: Category;
  index?: number;
}

export default function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const categoryLink = `/shop/${category.slug}`;
  const { language } = useLanguage();
  const displayName = (language === 'ml' && category.name_ml) ? category.name_ml : category.name;
  const icon = getCategoryIcon(category.slug);

  return (
    <Link
      to={categoryLink}
      className="group block relative rounded-2xl sm:rounded-3xl overflow-hidden"
      style={{
        aspectRatio: '3 / 4',
        boxShadow: 'var(--shadow-card)',
        transition: 'all 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px) scale(1.01)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card-hover)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)';
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
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, 
                hsl(${(index * 37 + 340) % 360}, 60%, 95%) 0%, 
                hsl(${(index * 37 + 20) % 360}, 50%, 92%) 100%)`,
            }}
          >
            <span style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', opacity: 0.7 }}>{icon}</span>
          </div>
        )}
      </div>

      {/* Base gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(30,12,6,0.88) 0%, rgba(30,12,6,0.25) 55%, transparent 100%)',
        }}
      />

      {/* Hover intensity overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(to top, rgba(30,12,6,0.94) 0%, rgba(30,12,6,0.4) 60%, rgba(201,146,44,0.1) 100%)',
        }}
      />

      {/* Item count badge */}
      <div className="absolute top-3 right-3 z-10">
        <span
          className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: '0.04em',
          }}
        >
          {category.itemCount} {category.itemCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* No image icon badge */}
      {!category.imageUrl && (
        <div className="absolute top-3 left-3 z-10">
          <span className="text-2xl">{icon}</span>
        </div>
      )}

      {/* Content bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10">
        <h3
          className="font-bold text-white leading-tight mb-2 line-clamp-2"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1rem, 3vw, 1.2rem)',
            textShadow: '0 2px 12px rgba(0,0,0,0.4)',
          }}
        >
          {displayName}
        </h3>

        {/* Explore CTA — slides in on hover */}
        <div
          className="flex items-center gap-2 overflow-hidden transition-all duration-400 ease-out"
          style={{ maxHeight: 0, opacity: 0, transition: 'max-height 0.35s ease, opacity 0.35s ease' }}
          ref={el => {
            if (!el) return;
            const parent = el.closest('.group');
            if (!parent) return;
            parent.addEventListener('mouseenter', () => {
              el.style.maxHeight = '32px';
              el.style.opacity = '1';
            });
            parent.addEventListener('mouseleave', () => {
              el.style.maxHeight = '0';
              el.style.opacity = '0';
            });
          }}
        >
          <span className="text-[11px] font-bold tracking-[0.16em] uppercase" style={{ color: '#e8c06a' }}>
            Browse
          </span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: '#e8c06a' }}>
            <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Gold border on hover */}
      <div
        className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ border: '1.5px solid rgba(201,146,44,0.5)' }}
      />
    </Link>
  );
}
