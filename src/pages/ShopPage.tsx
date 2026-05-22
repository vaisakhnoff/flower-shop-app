import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';
import { useLanguage } from '../context/LanguageContext';

// ─── Icons ───────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
  </svg>
);
const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);
const Grid3Icon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="5" height="5" /><rect x="10" y="3" width="5" height="5" /><rect x="17" y="3" width="5" height="5" />
    <rect x="3" y="10" width="5" height="5" /><rect x="10" y="10" width="5" height="5" /><rect x="17" y="10" width="5" height="5" />
    <rect x="3" y="17" width="5" height="5" /><rect x="10" y="17" width="5" height="5" /><rect x="17" y="17" width="5" height="5" />
  </svg>
);
const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);
const FilterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
  </svg>
);
const SortIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M6 12h12M10 18h4" />
  </svg>
);
const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

// ─── Sort options ─────────────────────────────────────────────────────────────
type SortKey = 'default' | 'name-az' | 'name-za' | 'newest' | 'popular';
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'default', label: 'Default' },
  { key: 'newest', label: 'Newest First' },
  { key: 'popular', label: 'Most Popular' },
  { key: 'name-az', label: 'Name A → Z' },
  { key: 'name-za', label: 'Name Z → A' },
];

// ─── Badge map for categories ─────────────────────────────────────────────────
const CATEGORY_ICONS: Record<string, string> = {
  garlands: '🌼',
  bouquets: '💐',
  'car-bouquets': '🚗',
  'hand-bouquets': '🤲',
  'stage-decorations': '✨',
  'wedding-decorations': '💍',
  'table-arrangements': '🌺',
  'flower-baskets': '🧺',
  wreaths: '🌿',
  centerpieces: '🌸',
};

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard({ layout }: { layout: 'grid' | 'grid-dense' | 'list' }) {
  if (layout === 'list') {
    return (
      <div className="flex gap-3 p-3 rounded-2xl" style={{ border: '1px solid rgba(243,232,224,0.8)', background: '#fff' }}>
        <div className="skeleton rounded-xl flex-shrink-0" style={{ width: 96, height: 96 }} />
        <div className="flex-1 py-1">
          <div className="skeleton h-4 w-3/4 mb-2 rounded" />
          <div className="skeleton h-3 w-1/3 mb-4 rounded" />
          <div className="flex gap-2">
            <div className="skeleton h-7 w-24 rounded-full" />
            <div className="skeleton h-7 w-8 rounded-full" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '3/4' }}>
      <div className="skeleton w-full h-full" />
    </div>
  );
}

// ─── Active sort chip label ────────────────────────────────────────────────────
function SortDropdown({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const label = SORT_OPTIONS.find(o => o.key === value)?.label ?? 'Default';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
        style={{
          background: value !== 'default' ? 'rgba(201,146,44,0.08)' : 'rgba(243,232,224,0.5)',
          border: `1px solid ${value !== 'default' ? 'rgba(201,146,44,0.4)' : 'rgba(243,232,224,1)'}`,
          color: value !== 'default' ? '#9a6f1e' : '#6b5444',
        }}
      >
        <SortIcon />
        <span className="hidden sm:inline">{label}</span>
        <ChevronDown />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-40 rounded-2xl overflow-hidden animate-scale-in"
          style={{
            background: '#fff',
            border: '1px solid rgba(243,232,224,0.9)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            minWidth: 170,
          }}
        >
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.key}
              className="w-full text-left px-4 py-2.5 text-sm font-medium transition-colors duration-150 hover:bg-[#fef9f5]"
              style={{ color: opt.key === value ? '#c9922c' : '#4a3728' }}
              onClick={() => { onChange(opt.key); setOpen(false); }}
            >
              {opt.key === value && <span className="mr-1.5 text-[#c9922c]">✓</span>}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ShopPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const { products, isLoading, error, hasMore, loadMore } = useProducts(slug);
  const { categories } = useCategories();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<SortKey>('default');
  const [showFilters, setShowFilters] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'grid-dense' | 'list'>('grid');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialQuery) setSearchQuery(initialQuery);
  }, [initialQuery]);

  // Always reset to top of list when slug changes
  useEffect(() => {
    setSearchQuery('');
    setSortBy('default');
    window.scrollTo(0, 0);
  }, [slug]);

  const formatSlug = (str: string) =>
    str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const categoryIcon = slug
    ? (Object.entries(CATEGORY_ICONS).find(([k]) => slug.includes(k))?.[1] ?? '🌸')
    : '🌺';

  // Filter + sort in memory
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.name_en && p.name_en.toLowerCase().includes(q)) ||
        (p.name_ml && p.name_ml.toLowerCase().includes(q)) ||
        p.categorySlug.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'name-az': list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-za': list.sort((a, b) => b.name.localeCompare(a.name)); break;
      /* newest / popular: Firebase already returns in insertion order; we just reverse for newest */
      case 'newest': list.reverse(); break;
    }

    return list;
  }, [products, searchQuery, sortBy]);

  const breadcrumbItems = [
    { label: t.home, to: '/' },
    { label: t.shop, to: '/shop' },
  ];
  if (slug) breadcrumbItems.push({ label: formatSlug(slug), to: `/shop/${slug}` });

  const isInitialLoading = isLoading && products.length === 0;
  const activeFiltersCount = (sortBy !== 'default' ? 1 : 0) + (searchQuery ? 1 : 0);

  // Grid class by layout
  const gridClass =
    layout === 'grid-dense'
      ? 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3'
      : layout === 'list'
      ? 'flex flex-col gap-2.5'
      : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5';

  const currentCategory = categories.find(c => c.slug === slug);

  return (
    <div className="min-h-screen" style={{ background: '#fffdf9' }}>

      {/* ══════════════════ PAGE BANNER ══════════════════ */}
      <div
        className="relative px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-8 sm:pb-10 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #fff5f7 0%, #fffdf5 50%, #fef5e4 100%)' }}
      >
        {/* decorative blobs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #ffc9d5, transparent)' }} />
        <div className="absolute -bottom-8 left-0 w-32 h-32 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #fdf0c2, transparent)' }} />

        <div className="relative max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="mb-4">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div className="flex items-start gap-4">
              {/* Category icon */}
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 animate-scale-in"
                style={{
                  background: 'linear-gradient(135deg, #fff5f7, #fef5e4)',
                  border: '1.5px solid rgba(201,146,44,0.15)',
                  boxShadow: '0 4px 16px rgba(201,146,44,0.1)',
                }}
              >
                {categoryIcon}
              </div>
              <div>
                {slug && (
                  <p className="text-xs font-bold tracking-[0.18em] uppercase mb-1" style={{ color: '#c9922c' }}>
                    ✦ Category
                  </p>
                )}
                <h1
                  className="font-bold leading-tight"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: '#2c1810',
                    fontSize: 'clamp(1.6rem, 5vw, 2.8rem)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {slug ? formatSlug(slug) : (t.allProducts || 'All Collections')}
                </h1>
                <p className="text-sm font-medium mt-0.5" style={{ color: '#8b7060' }}>
                  {isInitialLoading
                    ? 'Loading arrangements…'
                    : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'arrangement' : 'arrangements'} available`}
                </p>
              </div>
            </div>

            {/* Category description if available */}
            {currentCategory && currentCategory.itemCount > 0 && (
              <div
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium"
                style={{ background: 'rgba(201,146,44,0.07)', border: '1px solid rgba(201,146,44,0.15)', color: '#9a6f1e' }}
              >
                <span>💐</span>
                <span>{currentCategory.itemCount} items in this collection</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════ STICKY FILTER BAR ══════════════════ */}
      <div
        className="sticky z-30 px-4 sm:px-6 lg:px-8 py-2.5"
        style={{
          top: 64,
          background: 'rgba(255,253,249,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(243,232,224,0.8)',
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Row 1: search + controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <div className="search-bar flex-1 min-w-0">
              <span style={{ color: '#b0997a', flexShrink: 0 }}><SearchIcon /></span>
              <input
                ref={searchInputRef}
                type="text"
                placeholder={`Search ${slug ? formatSlug(slug) : 'all arrangements'}…`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="flex-shrink-0 text-[#b0997a] hover:text-[#2c1810] transition-colors text-sm leading-none"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort dropdown */}
            <SortDropdown value={sortBy} onChange={setSortBy} />

            {/* Filter toggle (badge shows active count) */}
            <button
              onClick={() => setShowFilters(p => !p)}
              className="relative flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex-shrink-0"
              style={{
                background: showFilters || activeFiltersCount > 0 ? 'rgba(201,146,44,0.08)' : 'rgba(243,232,224,0.5)',
                border: `1px solid ${showFilters || activeFiltersCount > 0 ? 'rgba(201,146,44,0.4)' : 'rgba(243,232,224,1)'}`,
                color: showFilters || activeFiltersCount > 0 ? '#9a6f1e' : '#6b5444',
              }}
            >
              <FilterIcon />
              <span className="hidden sm:inline">Filter</span>
              {activeFiltersCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center text-white"
                  style={{ background: '#c9922c' }}
                >
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Layout toggle */}
            <div
              className="flex items-center rounded-xl p-1 flex-shrink-0"
              style={{ background: 'rgba(243,232,224,0.5)', border: '1px solid rgba(243,232,224,1)' }}
            >
              {(['grid', 'grid-dense', 'list'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setLayout(l)}
                  className="relative p-1.5 sm:p-2 rounded-lg transition-all duration-200"
                  style={{
                    background: layout === l ? '#fff' : 'transparent',
                    color: layout === l ? '#c9922c' : '#8b7060',
                    boxShadow: layout === l ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  }}
                  aria-label={l === 'grid' ? 'Grid view' : l === 'grid-dense' ? 'Dense grid' : 'List view'}
                >
                  {l === 'grid' ? <GridIcon /> : l === 'grid-dense' ? <Grid3Icon /> : <ListIcon />}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Category chips */}
          {categories.length > 0 && (
            <div className="h-scroll mt-2">
              <Link
                to="/shop"
                className={`filter-chip ${!slug ? 'active' : ''}`}
              >
                🌺 All
              </Link>
              {categories.map(cat => {
                const icon = Object.entries(CATEGORY_ICONS).find(([k]) => cat.slug.includes(k))?.[1] ?? '🌸';
                return (
                  <Link
                    key={cat.id}
                    to={`/shop/${cat.slug}`}
                    className={`filter-chip ${slug === cat.slug ? 'active' : ''}`}
                  >
                    <span>{icon}</span>
                    <span>{cat.name}</span>
                    {cat.itemCount > 0 && (
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-0.5"
                        style={{ background: slug === cat.slug ? 'rgba(201,146,44,0.2)' : 'rgba(243,232,224,0.8)', color: slug === cat.slug ? '#9a6f1e' : '#8b7060' }}
                      >
                        {cat.itemCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Row 3: Active filter pills */}
          {showFilters && (
            <div
              className="mt-3 p-3 rounded-2xl flex flex-wrap gap-2 items-center animate-fade-in"
              style={{ background: 'rgba(243,232,224,0.3)', border: '1px solid rgba(243,232,224,0.8)' }}
            >
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9a6f1e' }}>Active filters:</span>
              {sortBy !== 'default' && (
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(201,146,44,0.1)', color: '#9a6f1e', border: '1px solid rgba(201,146,44,0.25)' }}
                >
                  Sort: {SORT_OPTIONS.find(o => o.key === sortBy)?.label}
                  <button onClick={() => setSortBy('default')} className="ml-1 hover:text-red-500 transition-colors">✕</button>
                </span>
              )}
              {searchQuery && (
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(201,146,44,0.1)', color: '#9a6f1e', border: '1px solid rgba(201,146,44,0.25)' }}
                >
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-red-500 transition-colors">✕</button>
                </span>
              )}
              {activeFiltersCount > 0 && (
                <button
                  onClick={() => { setSearchQuery(''); setSortBy('default'); }}
                  className="text-xs font-semibold text-red-400 hover:text-red-600 transition-colors ml-auto"
                >
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════ PRODUCT GRID ══════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {error ? (
          /* ─ Error ─ */
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4"
              style={{ background: 'linear-gradient(135deg, #ffe0e0, #ffeee0)' }}>
              ⚠️
            </div>
            <p className="text-base font-semibold mb-1" style={{ color: '#4a3728' }}>Something went wrong</p>
            <p className="text-sm mb-5" style={{ color: '#8b7060' }}>{error}</p>
            <button onClick={() => window.location.reload()} className="btn-luxury btn-luxury-outline text-sm">
              Try Again
            </button>
          </div>
        ) : isInitialLoading ? (
          /* ─ Skeleton ─ */
          <div className={gridClass}>
            {[...Array(layout === 'grid-dense' ? 18 : layout === 'grid' ? 10 : 8)].map((_, i) => (
              <SkeletonCard key={i} layout={layout} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            {/* Result count + sort hint */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium" style={{ color: '#8b7060' }}>
                {searchQuery
                  ? `${filteredProducts.length} result${filteredProducts.length !== 1 ? 's' : ''} for "${searchQuery}"`
                  : `Showing ${filteredProducts.length} arrangement${filteredProducts.length !== 1 ? 's' : ''}`}
              </p>
            </div>

            <div className={`${gridClass} mb-10`}>
              {filteredProducts.map((product, i) => (
                <div
                  key={product.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${Math.min(i * 0.035, 0.35)}s`, animationFillMode: 'both' }}
                >
                  <ProductCard
                    product={product}
                    layout={layout === 'list' ? 'list' : 'grid'}
                    badge={i === 0 && !searchQuery ? 'popular' : i < 2 && !searchQuery ? 'new' : null}
                  />
                </div>
              ))}
            </div>

            {/* Load More */}
            {hasMore && !searchQuery && (
              <div className="flex justify-center pb-6">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="group relative flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden"
                  style={{ border: '1.5px solid rgba(201,146,44,0.5)', color: '#c9922c', background: 'transparent' }}
                >
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                    style={{ background: 'rgba(201,146,44,0.06)' }} />
                  {isLoading ? (
                    <span className="relative flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Loading…
                    </span>
                  ) : (
                    <span className="relative">Load More Arrangements</span>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          /* ─ Empty state ─ */
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-5 animate-float"
              style={{ background: 'linear-gradient(135deg, #fce4ec, #fff3e0)' }}
            >
              {searchQuery ? '🔍' : '🌺'}
            </div>
            <h3
              className="font-bold text-xl mb-2 text-center"
              style={{ fontFamily: "'Playfair Display', serif", color: '#2c1810' }}
            >
              {searchQuery ? `No results for "${searchQuery}"` : 'No arrangements found'}
            </h3>
            <p className="text-sm text-center mb-7 max-w-xs" style={{ color: '#8b7060' }}>
              {searchQuery
                ? 'Try a different keyword or browse our other collections.'
                : 'Check back soon — new blooms are added regularly.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="btn-luxury btn-luxury-outline text-sm">
                  Clear Search
                </button>
              )}
              <Link to="/shop" className="btn-luxury btn-luxury-primary text-sm">
                Browse All Collections
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
