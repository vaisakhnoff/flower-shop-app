import { Link } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import CategoryCard from '../components/CategoryCard';
import { useLanguage } from '../context/LanguageContext';

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

export default function HomePage() {
  const { categories, isLoading, error } = useCategories();
  const { t } = useLanguage();

  const handleWhatsApp = () => {
    if (!WHATSAPP_NUMBER) return;
    const msg = encodeURIComponent("Hi! I'd like to inquire about your floral arrangements for my special occasion.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fffdf9' }}>
        <div className="text-center animate-fade-in">
          <div
            className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-t-[#c9922c] border-[#f3e8e0] animate-spin"
          />
          <p className="text-sm font-medium" style={{ color: '#8b7060', letterSpacing: '0.06em' }}>
            {t.loading}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-red-500 text-center">{t.error}: {error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden" style={{ background: '#fffdf9' }}>

      {/* ════════════════════════════════
          HERO SECTION
          ════════════════════════════════ */}
      <section
        className="relative min-h-[88vh] sm:min-h-[82vh] flex flex-col items-center justify-center px-6 sm:px-8 py-16 sm:py-20 overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #fff5f7 0%, #fffdf5 35%, #fef5e4 65%, #fff0f5 100%)',
        }}
      >
        {/* Decorative blobs */}
        <div className="hero-petal w-72 h-72 sm:w-96 sm:h-96 -top-20 -right-20"
          style={{ background: 'radial-gradient(circle, #ffc9d5 0%, transparent 70%)' }} />
        <div className="hero-petal w-64 h-64 sm:w-80 sm:h-80 -bottom-16 -left-16"
          style={{ background: 'radial-gradient(circle, #fdf0c2 0%, transparent 70%)' }} />
        <div className="hero-petal w-48 h-48 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'radial-gradient(circle, rgba(248, 209, 90, 0.2) 0%, transparent 70%)' }} />

        {/* Floating petals decorative elements */}
        <div className="absolute top-16 left-8 sm:left-20 text-2xl sm:text-3xl opacity-30 animate-float" style={{ animationDelay: '0s' }}>🌸</div>
        <div className="absolute top-32 right-8 sm:right-24 text-xl sm:text-2xl opacity-25 animate-float" style={{ animationDelay: '1.5s' }}>🌺</div>
        <div className="absolute bottom-24 left-12 sm:left-32 text-lg sm:text-2xl opacity-20 animate-float" style={{ animationDelay: '3s' }}>🌹</div>
        <div className="absolute bottom-16 right-12 sm:right-20 text-2xl opacity-25 animate-float" style={{ animationDelay: '2s' }}>✿</div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center animate-fade-up">
          {/* Eyebrow tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 sm:mb-8"
            style={{
              background: 'rgba(201,146,44,0.1)',
              border: '1px solid rgba(201,146,44,0.3)',
            }}>
            <span className="text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase" style={{ color: '#c9922c' }}>
              ✦ Premium Floral Design
            </span>
          </div>

          {/* Main headline */}
          <h1
            className="font-display text-[clamp(2.8rem,8vw,5.5rem)] leading-[1.1] font-bold mb-5 sm:mb-6 text-balance"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: '#2c1810',
              letterSpacing: '-0.025em',
            }}
          >
            Where Every Bloom
            <br />
            <span
              className="italic"
              style={{
                background: 'linear-gradient(135deg, #c9922c 0%, #e8c06a 50%, #b87a0e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Tells a Story
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-10 max-w-xl mx-auto"
            style={{ color: '#8b7060', fontWeight: 400 }}
          >
            {t.heroSubtitle || "Exquisite floral arrangements for weddings, celebrations, and life's most precious moments."}
          </p>

          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/shop"
              className="btn-luxury btn-luxury-primary w-full sm:w-auto min-w-[160px]"
            >
              Explore Collection
            </Link>
            <button
              onClick={handleWhatsApp}
              className="btn-luxury btn-luxury-outline w-full sm:w-auto min-w-[160px] flex items-center gap-2"
            >
              <WhatsAppIcon />
              <span>Ask on WhatsApp</span>
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 sm:gap-8 mt-10 sm:mt-12">
            {[
              { icon: '🌹', label: 'Fresh Blooms' },
              { icon: '💍', label: 'Wedding Specialists' },
              { icon: '🚚', label: 'Same-Day Delivery' },
            ].map((badge) => (
              <div key={badge.label} className="flex flex-col items-center gap-1.5">
                <span className="text-xl sm:text-2xl">{badge.icon}</span>
                <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider" style={{ color: '#b0997a' }}>
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #fffdf9)' }} />
      </section>

      {/* ════════════════════════════════
          SECTION: CATEGORIES
          ════════════════════════════════ */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-12 md:mb-14 animate-fade-up">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: '#c9922c' }}>
              ✦ Our Collections ✦
            </p>
            <h2
              className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight mb-4"
              style={{ fontFamily: "'Playfair Display', serif", color: '#2c1810', letterSpacing: '-0.02em' }}
            >
              {t.categories || 'Floral Collections'}
            </h2>
            <p className="text-base sm:text-lg max-w-xl mx-auto" style={{ color: '#8b7060' }}>
              {t.browseCategories || 'Discover our curated arrangements crafted for every occasion'}
            </p>
            {/* Gold rule */}
            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="h-px w-12 sm:w-16" style={{ background: 'linear-gradient(to right, transparent, #c9922c)' }} />
              <span className="text-[#c9922c] text-lg">✦</span>
              <div className="h-px w-12 sm:w-16" style={{ background: 'linear-gradient(to left, transparent, #c9922c)' }} />
            </div>
          </div>

          {/* Category Grid */}
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {categories.map((category, i) => (
                <div
                  key={category.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'both' }}
                >
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 animate-fade-in">
              <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center text-3xl"
                style={{ background: 'linear-gradient(135deg, #fce4ec, #fff3e0)' }}>
                🌺
              </div>
              <p className="text-base" style={{ color: '#8b7060' }}>
                No categories available yet
              </p>
            </div>
          )}

          {/* View All CTA */}
          {categories.length > 0 && (
            <div className="text-center mt-10 sm:mt-12">
              <Link
                to="/shop"
                className="btn-luxury btn-luxury-outline inline-flex"
              >
                View All Collections →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════
          SECTION: VALUE PROPS
          ════════════════════════════════ */}
      <section
        className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2c1810 0%, #3d1e14 100%)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #c9922c 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f43b6a 0%, transparent 50%)' }} />

        <div className="relative max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 text-center">
            {[
              {
                icon: '🌸',
                title: 'Premium Flowers',
                desc: 'Only the finest blooms, sourced fresh every morning',
              },
              {
                icon: '💐',
                title: 'Custom Designs',
                desc: 'Bespoke arrangements tailored to your vision',
              },
              {
                icon: '✨',
                title: 'Expert Craftsmanship',
                desc: 'Decades of experience in floral artistry',
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 0.15}s`, animationFillMode: 'both' }}
              >
                <div className="text-4xl sm:text-5xl mb-4 animate-float" style={{ animationDelay: `${i * 2}s` }}>
                  {item.icon}
                </div>
                <h3
                  className="font-display font-semibold text-lg sm:text-xl mb-2"
                  style={{ fontFamily: "'Playfair Display', serif", color: '#f5e8d0' }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
