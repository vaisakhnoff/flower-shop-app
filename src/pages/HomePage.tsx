import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

// ─── Icons ───────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
  </svg>
);

const WhatsAppIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Quick filter badges for homepage
const QUICK_FILTERS = [
  { label: 'All', slug: '' },
  { label: 'Garlands', slug: 'garlands' },
  { label: 'Bouquets', slug: 'bouquets' },
  { label: 'Hand Bouquets', slug: 'hand-bouquets' },
  { label: 'Car Bouquets', slug: 'car-bouquets' },
  { label: 'Stage Decor', slug: 'stage-decorations' },
];

// ─── Skeleton Card ─────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '3/4' }}>
      <div className="skeleton w-full h-full" />
    </div>
  );
}

// ─── Section Header ─────────────────────────────────────────────────────────
function SectionHeading({
  eyebrow,
  title,
  subtitle,
  linkTo,
  linkLabel,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  linkTo?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-5 sm:mb-7">
      <div>
        {eyebrow && (
          <p className="text-xs font-bold tracking-[0.18em] uppercase mb-1" style={{ color: '#c9922c' }}>
            {eyebrow}
          </p>
        )}
        <h2
          className="font-bold leading-tight"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.4rem, 4vw, 2.2rem)',
            color: '#2c1810',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm mt-1" style={{ color: '#8b7060' }}>{subtitle}</p>
        )}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="flex items-center gap-1.5 text-sm font-semibold flex-shrink-0 ml-4 transition-all duration-200 hover:gap-2.5"
          style={{ color: '#c9922c' }}
        >
          <span className="hidden sm:inline">{linkLabel || 'See All'}</span>
          <span className="sm:hidden">All</span>
          <ArrowRight />
        </Link>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function HomePage() {
  const { categories, isLoading: catLoading } = useCategories();
  const { products: allProducts, isLoading: prodLoading } = useProducts(undefined);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  // Derived data
  const featuredProducts = allProducts.slice(0, 8);
  const newProducts = [...allProducts].reverse().slice(0, 6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleWhatsApp = () => {
    if (!WHATSAPP_NUMBER) return;
    const msg = encodeURIComponent("Hi! I'd like to inquire about your flower arrangements for my occasion.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  const isLoading = catLoading || prodLoading;

  if (isLoading && categories.length === 0 && allProducts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fffdf9' }}>
        <div className="text-center animate-fade-in">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full border-2 border-t-[#c9922c] border-[#f3e8e0] animate-spin" />
          <p className="text-sm font-medium" style={{ color: '#8b7060', letterSpacing: '0.06em' }}>
            {t.loading}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden" style={{ background: '#fffdf9' }}>

      {/* ════════════════════════════════════════════════
          1. HERO SECTION
          ════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[85vh] sm:min-h-[78vh] flex flex-col items-center justify-center px-5 sm:px-8 py-14 sm:py-20 overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #fff5f7 0%, #fffdf5 30%, #fef5e4 65%, #fff0f8 100%)',
        }}
      >
        {/* Decorative soft blobs */}
        <div className="hero-petal w-80 h-80 sm:w-[28rem] sm:h-[28rem] -top-24 -right-24"
          style={{ background: 'radial-gradient(circle, rgba(255,150,180,0.35) 0%, transparent 70%)' }} />
        <div className="hero-petal w-72 h-72 sm:w-96 sm:h-96 -bottom-20 -left-20"
          style={{ background: 'radial-gradient(circle, rgba(253,230,170,0.4) 0%, transparent 70%)' }} />
        <div className="hero-petal w-56 h-56 top-1/3 right-1/4"
          style={{ background: 'radial-gradient(circle, rgba(201,146,44,0.12) 0%, transparent 70%)' }} />

        {/* Floating emojis */}
        {[
          { emoji: '🌸', top: '12%', left: '6%', delay: '0s', size: '1.6rem' },
          { emoji: '🌺', top: '20%', right: '8%', delay: '2s', size: '1.4rem' },
          { emoji: '💐', bottom: '28%', left: '10%', delay: '1s', size: '1.3rem' },
          { emoji: '🌹', bottom: '20%', right: '12%', delay: '3s', size: '1.5rem' },
          { emoji: '✨', top: '38%', right: '5%', delay: '1.5s', size: '1rem' },
        ].map((f, i) => (
          <div
            key={i}
            className="absolute pointer-events-none animate-float"
            style={{ top: f.top, bottom: (f as any).bottom, left: (f as any).left, right: (f as any).right, animationDelay: f.delay, fontSize: f.size, opacity: 0.35 }}
          >
            {f.emoji}
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center">

          {/* Eyebrow tag */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 animate-fade-in"
            style={{
              background: 'rgba(201,146,44,0.09)',
              border: '1px solid rgba(201,146,44,0.28)',
              animationDelay: '0.1s',
            }}
          >
            <span className="text-xs sm:text-sm font-bold tracking-[0.14em] uppercase" style={{ color: '#c9922c' }}>
              ✦ Wedding Flower Specialists
            </span>
          </div>

          {/* Main headline */}
          <h1
            className="font-bold mb-4 sm:mb-5 text-balance animate-fade-up"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.6rem, 8vw, 5.5rem)',
              lineHeight: 1.1,
              color: '#2c1810',
              letterSpacing: '-0.025em',
              animationDelay: '0.2s',
            }}
          >
            Browse. Choose.{' '}
            <span
              className="italic"
              style={{
                background: 'linear-gradient(135deg, #c9922c 0%, #e8c06a 50%, #b87a0e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Inquire.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-lg mx-auto animate-fade-up"
            style={{ color: '#8b7060', fontWeight: 400, animationDelay: '0.3s' }}
          >
            Browse our floral catalog, shortlist your favourites, and send a quick WhatsApp message to enquire — no checkout, no fuss.
          </p>

          {/* ── Search Bar ── */}
          <form
            onSubmit={handleSearch}
            className="search-bar mx-auto max-w-md mb-6 animate-fade-up"
            style={{ animationDelay: '0.4s' }}
          >
            <span style={{ color: '#b0997a', flexShrink: 0 }}><SearchIcon /></span>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search garlands, bouquets, stage decor…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="submit"
                className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #c9922c, #e8b84b)' }}
              >
                Go
              </button>
            )}
          </form>

          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <Link
              to="/shop"
              className="btn-luxury btn-luxury-primary w-full sm:w-auto min-w-[170px]"
            >
              Browse Catalog
            </Link>
            <button
              onClick={handleWhatsApp}
              className="btn-luxury btn-luxury-outline w-full sm:w-auto min-w-[170px] flex items-center gap-2"
            >
              <WhatsAppIcon size={17} />
              <span>Chat on WhatsApp</span>
            </button>
          </div>

          {/* Trust pill row */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 animate-fade-up" style={{ animationDelay: '0.6s' }}>
            {[
              { icon: '🌺', label: 'Wedding Specialists' },
              { icon: '💐', label: 'Custom Designs' },
              { icon: '⚡', label: 'Quick Response' },
              { icon: '💚', label: 'No Payment Needed' },
            ].map(p => (
              <span key={p.label} className="feature-pill">
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #fffdf9)' }}
        />
      </section>

      {/* ════════════════════════════════════════════════
          2. QUICK FILTER CHIPS + CATEGORIES
          ════════════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-4">
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <SectionHeading
            eyebrow="✦ Our Collections"
            title="Shop by Category"
            subtitle="Tap a category to browse all arrangements"
            linkTo="/shop"
            linkLabel="View All"
          />

          {/* Quick filter chips */}
          <div className="h-scroll mb-6">
            {QUICK_FILTERS.map(f => (
              <button
                key={f.slug}
                className={`filter-chip ${activeFilter === f.slug ? 'active' : ''}`}
                onClick={() => {
                  setActiveFilter(f.slug);
                  if (f.slug) navigate(`/shop/${f.slug}`);
                  else navigate('/shop');
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Category Grid */}
          {catLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
              {categories.map((category, i) => (
                <div
                  key={category.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 0.07}s`, animationFillMode: 'both' }}
                >
                  <CategoryCard category={category} index={i} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl"
                style={{ background: 'linear-gradient(135deg, #fce4ec, #fff3e0)' }}>
                🌺
              </div>
              <p className="text-sm" style={{ color: '#8b7060' }}>No categories yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          3. FEATURED / POPULAR PRODUCTS
          ════════════════════════════════════════════════ */}
      {(allProducts.length > 0 || prodLoading) && (
        <section className="relative px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-4">
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              eyebrow="🔥 Most Loved"
              title="Popular Arrangements"
              subtitle="Customer favourites — browse and inquire instantly"
              linkTo="/shop"
              linkLabel="See All"
            />

            {prodLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {featuredProducts.map((product, i) => (
                  <div
                    key={product.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${Math.min(i * 0.05, 0.4)}s`, animationFillMode: 'both' }}
                  >
                    <ProductCard product={product} badge={i < 3 ? 'popular' : null} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════
          4. NEWLY ADDED PRODUCTS
          ════════════════════════════════════════════════ */}
      {newProducts.length > 0 && (
        <section className="relative px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-4">
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              eyebrow="✨ Just Arrived"
              title="Newly Added"
              subtitle="Our latest blooms, hot off the arrangement table"
              linkTo="/shop"
              linkLabel="View All New"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {newProducts.map((product, i) => (
                <div
                  key={product.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 0.06}s`, animationFillMode: 'both' }}
                >
                  <ProductCard product={product} badge="new" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════
          5. HOW IT WORKS BANNER
          ════════════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ color: '#c9922c' }}>✦ Simple Process</p>
            <h2
              className="font-bold mb-3"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: '#2c1810', letterSpacing: '-0.02em' }}
            >
              How It Works
            </h2>
            <p className="text-sm sm:text-base max-w-md mx-auto" style={{ color: '#8b7060' }}>
              No registration. No payment. Just browse, pick, and WhatsApp us.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center relative">
            {/* Connector line (desktop) */}
            <div
              className="hidden sm:block absolute top-8 left-[20%] right-[20%] h-px pointer-events-none"
              style={{ background: 'linear-gradient(to right, rgba(201,146,44,0.3), rgba(201,146,44,0.6), rgba(201,146,44,0.3))' }}
            />

            {[
              { step: '01', icon: '🔍', title: 'Browse the Catalog', desc: 'Scroll through categories, search by name, or filter by type.' },
              { step: '02', icon: '❤️', title: 'Shortlist Favourites', desc: 'Save items you like using the heart button — they\'ll be in your Wishlist.' },
              { step: '03', icon: '💬', title: 'Inquire on WhatsApp', desc: 'Tap "Ask on WhatsApp" on any product to send us a direct message with details.' },
            ].map((item, i) => (
              <div
                key={item.step}
                className="relative animate-fade-up flex flex-col items-center"
                style={{ animationDelay: `${i * 0.15}s`, animationFillMode: 'both' }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 relative z-10"
                  style={{
                    background: 'linear-gradient(135deg, #fff5f7, #fef5e4)',
                    border: '2px solid rgba(201,146,44,0.2)',
                    boxShadow: '0 4px 20px rgba(201,146,44,0.12)',
                  }}
                >
                  {item.icon}
                </div>
                <span
                  className="text-xs font-black tracking-widest uppercase mb-2"
                  style={{ color: 'rgba(201,146,44,0.6)' }}
                >
                  Step {item.step}
                </span>
                <h3
                  className="font-bold text-base sm:text-lg mb-2"
                  style={{ fontFamily: "'Playfair Display', serif", color: '#2c1810' }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed max-w-[15rem] mx-auto" style={{ color: '#8b7060' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10 sm:mt-12">
            <Link to="/shop" className="btn-luxury btn-luxury-primary w-full sm:w-auto min-w-[180px]">
              Start Browsing
            </Link>
            <Link to="/favorites" className="btn-luxury btn-luxury-outline w-full sm:w-auto min-w-[180px] flex items-center gap-2">
              <HeartIcon />
              <span>Your Wishlist</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          6. VALUE PROPS (DARK BAND)
          ════════════════════════════════════════════════ */}
      <section
        className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2c1810 0%, #3d1e14 100%)' }}
      >
        {/* Decorative radials */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 15% 85%, #c9922c 0%, transparent 50%), radial-gradient(circle at 85% 15%, #f43b6a 0%, transparent 50%)' }}
        />

        <div className="relative max-w-5xl mx-auto">
          {/* Scrolling marquee text */}
          <div className="overflow-hidden mb-10 sm:mb-12 opacity-20">
            <div className="marquee-track">
              {[...Array(6)].map((_, i) => (
                <span key={i} className="text-white font-bold text-5xl tracking-widest opacity-50 uppercase" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.3em' }}>
                  Garlands · Bouquets · Decorations · Arrangements ·&nbsp;
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 text-center">
            {[
              { icon: '🌸', title: 'Premium Fresh Flowers', desc: 'Only the finest seasonal blooms, sourced daily for quality you can see.' },
              { icon: '💐', title: 'Custom Arrangements', desc: 'Tell us your theme and we\'ll craft the perfect floral design for your event.' },
              { icon: '⚡', title: 'Fast WhatsApp Replies', desc: 'Message us and get a response with pricing within 2 hours.' },
            ].map((item, i) => (
              <div
                key={item.title}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 0.12}s`, animationFillMode: 'both' }}
              >
                <div className="text-4xl sm:text-5xl mb-4 animate-float" style={{ animationDelay: `${i * 1.8}s` }}>
                  {item.icon}
                </div>
                <h3
                  className="font-semibold text-lg sm:text-xl mb-2"
                  style={{ fontFamily: "'Playfair Display', serif", color: '#f5e8d0' }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Large WhatsApp CTA */}
          <div className="text-center mt-12 sm:mt-16">
            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-3 py-4 px-8 rounded-2xl font-bold text-white text-base transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #25D366, #1fbe5a)',
                boxShadow: '0 6px 28px rgba(37,211,102,0.35)',
              }}
            >
              <WhatsAppIcon size={22} />
              Chat with Us on WhatsApp
            </button>
            <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
              No payment needed · Just enquire freely
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
