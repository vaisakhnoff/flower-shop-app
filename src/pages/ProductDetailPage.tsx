import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { useFavorites } from '../context/FavoritesContext';
import Breadcrumbs from '../components/Breadcrumbs';
import { useLanguage } from '../context/LanguageContext';
import ImageGallery from '../components/ImageGallery';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

// ─── Spec-key groups ────────────────────────────────────────────────────────
// Keys that match these patterns are shown as interactive option pickers
const OPTION_KEYS = ['type', 'length', 'size', 'color', 'style', 'variant', 'finish'];

// ─── Icons ──────────────────────────────────────────────────────────────────
const WhatsAppIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill={filled ? '#f43b6a' : 'none'} stroke={filled ? '#f43b6a' : '#4a3728'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7l4 4 6-6" stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TagIcon = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <path d="M8.5 1.5h3v3L5 11a1.414 1.414 0 01-2 0L1.5 9.5a1.414 1.414 0 010-2L8.5 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="10.5" cy="3.5" r="0.5" fill="currentColor"/>
  </svg>
);

// ─── Separator ──────────────────────────────────────────────────────────────
function Divider() {
  return (
    <div
      style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(201,146,44,0.2), rgba(243,232,224,0.8), transparent)',
      }}
    />
  );
}

// ─── Section label ──────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
      style={{ color: '#c9922c' }}
    >
      {children}
    </p>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading, error } = useProduct(id);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { t, language } = useLanguage();

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [shareToast, setShareToast] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [stickyCtaVisible, setStickyCtaVisible] = useState(false);

  // Show sticky CTA when the inline CTA scrolls out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setStickyCtaVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (ctaRef.current) observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fffdf9' }}>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-t-[#c9922c] border-[#f3e8e0] animate-spin" />
          <p className="text-sm font-medium" style={{ color: '#8b7060' }}>{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-4" style={{ background: '#fffdf9' }}>
        <div className="text-5xl">🌸</div>
        <p className="text-base font-medium text-center" style={{ color: '#4a3728' }}>
          {error ? `${t.error}: ${error}` : t.noProducts}
        </p>
        <Link to="/shop" className="btn-luxury btn-luxury-primary text-sm">
          Back to Shop
        </Link>
      </div>
    );
  }

  const isAlreadyFavorite = isFavorite(product.id);
  const displayName = (language === 'ml' && product.name_ml) ? product.name_ml : product.name;
  const formatSlug = (s: string) => s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

  // Split specs into interactive options vs display-only details
  const specs = product.specifications ?? {};
  const specEntries = Object.entries(specs);

  const optionEntries = specEntries.filter(([k]) =>
    OPTION_KEYS.some(ok => k.toLowerCase().includes(ok))
  );
  const detailEntries = specEntries.filter(([k]) =>
    !OPTION_KEYS.some(ok => k.toLowerCase().includes(ok))
  );

  // Initialize selected options on first render
  if (optionEntries.length > 0 && Object.keys(selectedOptions).length === 0) {
    const initial: Record<string, string> = {};
    optionEntries.forEach(([k, v]) => {
      initial[k] = v.split(',')[0].trim();
    });
    setSelectedOptions(initial);
  }

  // Build WhatsApp message
  const buildWhatsAppMessage = () => {
    const url = window.location.href;
    const optionLines = Object.entries(selectedOptions)
      .map(([k, v]) => `• ${k.charAt(0).toUpperCase() + k.slice(1)}: *${v}*`)
      .join('\n');
    return `Hi! I'm interested in placing an order for:\n\n*${displayName}*\nPrice: ₹${product.price.toLocaleString('en-IN')}\n${optionLines ? '\nCustomization:\n' + optionLines : ''}\n\nProduct link: ${url}\n\nCould you please share more details?`;
  };

  const handleWhatsApp = () => {
    if (!WHATSAPP_NUMBER) { alert('Contact feature not configured.'); return; }
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage())}`,
      '_blank', 'noopener,noreferrer'
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: displayName, url: window.location.href }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(window.location.href).catch(() => {});
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  const handleFavorite = () => {
    isAlreadyFavorite ? removeFavorite(product.id) : addFavorite(product);
  };

  // Tags derived from categorySlug + spec values (first values of each)
  const tags = [
    formatSlug(product.categorySlug),
    ...specEntries.slice(0, 3).map(([, v]) => v.split(',')[0].trim()),
  ].filter(Boolean);

  return (
    <div className="min-h-screen pb-24 lg:pb-0" style={{ background: '#fffdf9' }}>

      {/* ── Breadcrumb bar ── */}
      <div style={{ borderBottom: '1px solid rgba(243,232,224,0.7)', background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
          <Breadcrumbs items={[
            { label: t.home, to: '/' },
            { label: t.shop, to: '/shop' },
            ...(product.categorySlug ? [{ label: formatSlug(product.categorySlug), to: `/shop/${product.categorySlug}` }] : []),
            { label: displayName },
          ]} />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-6 sm:gap-8 lg:gap-14 xl:gap-20 items-start">

          {/* ════════════════════════════
              LEFT: Image Gallery
              ════════════════════════════ */}
          <div className="lg:sticky lg:top-24">
            <ImageGallery images={product.images} alt={displayName} />
          </div>

          {/* ════════════════════════════
              RIGHT: Product Info
              ════════════════════════════ */}
          <div className="flex flex-col gap-0">

            {/* ── Tags ── */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                    style={{
                      background: 'rgba(201,146,44,0.08)',
                      color: '#9a6f1e',
                      border: '1px solid rgba(201,146,44,0.2)',
                    }}
                  >
                    <TagIcon />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* ── Name ── */}
            <h1
              className="font-display font-bold leading-[1.12] mb-3"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: '#1e0f08',
                fontSize: 'clamp(1.65rem, 3.5vw, 2.8rem)',
                letterSpacing: '-0.025em',
              }}
            >
              {displayName}
            </h1>

            {/* ── Price + actions row ── */}
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p
                  className="font-bold leading-none"
                  style={{
                    color: '#c9922c',
                    fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: '-0.03em',
                  }}
                >
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] mt-1 font-medium" style={{ color: '#b0997a' }}>
                  Inclusive of all taxes
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Favorite */}
                <button
                  onClick={handleFavorite}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                  style={{
                    background: isAlreadyFavorite ? '#fff0f3' : 'rgba(243,232,224,0.5)',
                    border: `1.5px solid ${isAlreadyFavorite ? '#f9b8c8' : 'rgba(243,232,224,1)'}`,
                  }}
                  aria-label={isAlreadyFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <HeartIcon filled={isAlreadyFavorite} />
                </button>

                {/* Share */}
                <div className="relative">
                  <button
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                    style={{
                      background: 'rgba(243,232,224,0.5)',
                      border: '1.5px solid rgba(243,232,224,1)',
                      color: '#4a3728',
                    }}
                    aria-label="Share"
                  >
                    <ShareIcon />
                  </button>
                  {shareToast && (
                    <div
                      className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap animate-fade-in"
                      style={{ background: '#2c1810', color: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}
                    >
                      Link copied!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Divider ── */}
            <Divider />

            {/* ── Description ── */}
            <div className="py-5">
              <SectionLabel>About this piece</SectionLabel>
              <p
                className="text-[0.9375rem] leading-[1.75] whitespace-pre-line"
                style={{ color: '#4a3728' }}
              >
                {product.description}
              </p>
            </div>

            <Divider />

            {/* ── Customization Options ── */}
            {optionEntries.length > 0 && (
              <>
                <div className="py-5">
                  <SectionLabel>Customization</SectionLabel>
                  <div className="flex flex-col gap-5">
                    {optionEntries.map(([key, raw]) => {
                      const choices = raw.split(',').map(s => s.trim()).filter(Boolean);
                      const selected = selectedOptions[key] ?? choices[0];
                      const isSingle = choices.length === 1;

                      return (
                        <div key={key}>
                          {/* Key + selected value */}
                          <div className="flex items-center justify-between mb-2.5">
                            <span
                              className="text-sm font-semibold capitalize"
                              style={{ color: '#2c1810' }}
                            >
                              {key}
                            </span>
                            <span
                              className="text-xs font-medium px-2 py-0.5 rounded-full"
                              style={{ background: 'rgba(201,146,44,0.1)', color: '#9a6f1e' }}
                            >
                              {selected}
                            </span>
                          </div>

                          {/* Option chips */}
                          {isSingle ? (
                            <span
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold"
                              style={{
                                background: 'rgba(201,146,44,0.1)',
                                border: '1.5px solid rgba(201,146,44,0.4)',
                                color: '#9a6f1e',
                              }}
                            >
                              <CheckIcon />
                              {selected}
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {choices.map(c => {
                                const isSelected = selected === c;
                                return (
                                  <button
                                    key={c}
                                    onClick={() => setSelectedOptions(prev => ({ ...prev, [key]: c }))}
                                    className="px-3.5 py-2 rounded-xl text-[0.8125rem] font-semibold capitalize transition-all duration-200 hover:scale-105 active:scale-95"
                                    style={{
                                      background: isSelected ? 'rgba(201,146,44,0.12)' : 'transparent',
                                      border: `1.5px solid ${isSelected ? '#c9922c' : 'rgba(243,232,224,1)'}`,
                                      color: isSelected ? '#9a6f1e' : '#6b5444',
                                      boxShadow: isSelected ? '0 2px 10px rgba(201,146,44,0.18)' : 'none',
                                    }}
                                  >
                                    {c}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <Divider />
              </>
            )}

            {/* ── Specifications Table ── */}
            {detailEntries.length > 0 && (
              <>
                <div className="py-5">
                  <SectionLabel>{t.specifications || 'Specifications'}</SectionLabel>
                  <div
                    className="overflow-hidden"
                    style={{
                      borderRadius: '16px',
                      border: '1px solid rgba(243,232,224,0.9)',
                    }}
                  >
                    {detailEntries.map(([k, v], i) => (
                      <div
                        key={k}
                        className="flex items-center justify-between px-4 py-3"
                        style={{
                          background: i % 2 === 0 ? '#fffdf9' : '#fff',
                          borderBottom: i < detailEntries.length - 1 ? '1px solid rgba(243,232,224,0.6)' : 'none',
                        }}
                      >
                        <span
                          className="text-xs sm:text-sm font-medium capitalize"
                          style={{ color: '#8b7060' }}
                        >
                          {k}
                        </span>
                        <span
                          className="text-xs sm:text-sm font-semibold text-right ml-4"
                          style={{ color: '#2c1810' }}
                        >
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <Divider />
              </>
            )}

            {/* ── Why Choose Us ── */}
            <div className="py-5">
              <SectionLabel>Why choose us</SectionLabel>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { icon: '🌸', label: 'Fresh every day', sub: 'Sourced same morning' },
                  { icon: '🎁', label: 'Gift wrapping', sub: 'Premium packaging' },
                  { icon: '✂️', label: 'Custom sizing', sub: 'Made to your spec' },
                  { icon: '⚡', label: 'Quick response', sub: 'Within 2 hours' },
                ].map(item => (
                  <div
                    key={item.label}
                    className="flex items-start gap-2.5 p-3 rounded-2xl"
                    style={{ background: 'rgba(251,242,234,0.6)', border: '1px solid rgba(243,232,224,0.6)' }}
                  >
                    <span className="text-lg leading-none mt-0.5 flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: '#2c1810' }}>{item.label}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: '#8b7060' }}>{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Divider />

            {/* ── CTA Block (inline — desktop always visible; mobile, this gets IntersectionObserver'd) ── */}
            <div ref={ctaRef} className="pt-5 pb-2 flex flex-col gap-2.5">
              {/* Primary: WhatsApp Enquire */}
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-[1rem] tracking-wide text-white transition-all duration-300 active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #25D366 0%, #1fbe5a 100%)',
                  boxShadow: '0 6px 24px rgba(37,211,102,0.32)',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(-2px)';
                  el.style.boxShadow = '0 10px 32px rgba(37,211,102,0.42)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = '0 6px 24px rgba(37,211,102,0.32)';
                }}
              >
                <WhatsAppIcon />
                <span>Enquire Now on WhatsApp</span>
              </button>

              {/* Secondary: Save to Wishlist */}
              <button
                onClick={handleFavorite}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-semibold text-sm transition-all duration-300 active:scale-[0.98]"
                style={{
                  background: isAlreadyFavorite ? 'rgba(244,59,106,0.06)' : 'transparent',
                  border: `1.5px solid ${isAlreadyFavorite ? '#f9b8c8' : 'rgba(243,232,224,1)'}`,
                  color: isAlreadyFavorite ? '#e0385f' : '#4a3728',
                }}
              >
                <HeartIcon filled={isAlreadyFavorite} />
                <span>{isAlreadyFavorite ? (t.saved || 'Saved to Wishlist') : (t.addToFavorites || 'Save to Wishlist')}</span>
              </button>

              {/* Reassurance note */}
              <p
                className="text-center text-[11px] pt-1"
                style={{ color: '#b0997a' }}
              >
                🔒 No payment required to enquire · Respond within 2 hours
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ════════════════════════════════
          STICKY MOBILE CTA BAR
          (appears when inline CTA scrolls out of view)
          ════════════════════════════════ */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-all duration-400 ${
          stickyCtaVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        style={{
          background: 'rgba(255,253,249,0.97)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(243,232,224,0.9)',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Price pill */}
          <div className="flex-shrink-0">
            <p className="text-[10px] font-medium" style={{ color: '#b0997a' }}>Price</p>
            <p className="font-bold text-base leading-tight" style={{ color: '#c9922c', fontFamily: "'DM Sans', sans-serif" }}>
              ₹{product.price.toLocaleString('en-IN')}
            </p>
          </div>

          {/* Divider */}
          <div className="w-px h-8 flex-shrink-0" style={{ background: 'rgba(243,232,224,0.9)' }} />

          {/* WhatsApp CTA */}
          <button
            onClick={handleWhatsApp}
            className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200 active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #25D366, #1fbe5a)',
              boxShadow: '0 4px 16px rgba(37,211,102,0.3)',
            }}
          >
            <WhatsAppIcon />
            <span>Enquire Now</span>
          </button>

          {/* Heart button */}
          <button
            onClick={handleFavorite}
            className="w-11 h-11 flex-shrink-0 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95"
            style={{
              background: isAlreadyFavorite ? '#fff0f3' : 'rgba(243,232,224,0.5)',
              border: `1.5px solid ${isAlreadyFavorite ? '#f9b8c8' : 'rgba(243,232,224,1)'}`,
            }}
            aria-label="Toggle wishlist"
          >
            <HeartIcon filled={isAlreadyFavorite} />
          </button>
        </div>
      </div>

    </div>
  );
}
