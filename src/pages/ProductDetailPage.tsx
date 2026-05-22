import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { useProducts } from '../hooks/useProducts';
import { useFavorites } from '../context/FavoritesContext';
import Breadcrumbs from '../components/Breadcrumbs';
import { useLanguage } from '../context/LanguageContext';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;
const OPTION_KEYS = ['type', 'length', 'size', 'color', 'style', 'variant', 'finish', 'occasion'];

// ─── Icons ───────────────────────────────────────────────────────────────────
const WhatsAppIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);
const HeartIcon = ({ filled, size = 20 }: { filled: boolean; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill={filled ? '#f43b6a' : 'none'} stroke={filled ? '#f43b6a' : 'currentColor'}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const ShareIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);
const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);
const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);
const ZoomIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /><path d="M8 11h6M11 8v6" />
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);
const TagIcon = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
    <path d="M8.5 1.5h3v3L5 11a1.414 1.414 0 01-2 0L1.5 9.5a1.414 1.414 0 010-2L8.5 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="10.5" cy="3.5" r="0.6" fill="currentColor" />
  </svg>
);

// ─── Image Gallery ─────────────────────────────────────────────────────────────
function PhotoGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoom, setZoom] = useState(1);
  const touchStart = useRef(0);
  const total = images?.length ?? 0;

  const goto = useCallback((i: number) => {
    setActive(((i % total) + total) % total);
    setZoom(1);
  }, [total]);
  const prev = useCallback(() => goto(active - 1), [active, goto]);
  const next = useCallback(() => goto(active + 1), [active, goto]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') setLightbox(false);
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [prev, next]);

  if (!images || total === 0) {
    return (
      <div
        className="w-full flex items-center justify-center text-6xl"
        style={{ aspectRatio: '1/1', borderRadius: 24, background: 'linear-gradient(135deg, #fce4ec, #fff3e0)' }}
      >
        🌸
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main image */}
        <div
          className="relative overflow-hidden select-none"
          style={{
            borderRadius: 20,
            aspectRatio: '1/1',
            background: 'linear-gradient(135deg, #fef5f7, #fffaf0)',
            boxShadow: '0 4px 32px rgba(44,24,16,0.09)',
            cursor: 'zoom-in',
          }}
          onTouchStart={e => { touchStart.current = e.touches[0].clientX; }}
          onTouchEnd={e => {
            const diff = touchStart.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
          }}
          onClick={() => { setLightbox(true); setZoom(1); }}
        >
          <img
            key={active}
            src={images[active]}
            alt={`${alt} ${active + 1}`}
            className="w-full h-full object-cover"
            style={{ animation: 'galleryFadeIn 0.3s ease-out' }}
            draggable={false}
          />

          {/* Gradient bottom */}
          <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(44,24,16,0.15), transparent)' }} />

          {/* Nav arrows */}
          {total > 1 && (
            <>
              {(['prev', 'next'] as const).map(dir => (
                <button
                  key={dir}
                  onClick={e => { e.stopPropagation(); dir === 'prev' ? prev() : next(); }}
                  className={`absolute top-1/2 -translate-y-1/2 ${dir === 'prev' ? 'left-3' : 'right-3'} w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95`}
                  style={{ background: 'rgba(255,253,249,0.93)', backdropFilter: 'blur(8px)', boxShadow: '0 2px 10px rgba(0,0,0,0.12)', color: '#4a3728' }}
                  aria-label={dir}
                >
                  {dir === 'prev' ? <ChevronLeft /> : <ChevronRight />}
                </button>
              ))}
            </>
          )}

          {/* Counter */}
          {total > 1 && (
            <div
              className="absolute bottom-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(255,253,249,0.9)', backdropFilter: 'blur(6px)', color: '#4a3728', boxShadow: '0 1px 6px rgba(0,0,0,0.1)' }}
            >
              {active + 1} / {total}
            </div>
          )}

          {/* Zoom hint */}
          <div
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,253,249,0.85)', backdropFilter: 'blur(6px)', color: '#8b7060', boxShadow: '0 1px 6px rgba(0,0,0,0.1)' }}
          >
            <ZoomIcon />
          </div>
        </div>

        {/* Thumbnail strip */}
        {total > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => goto(i)}
                className="flex-shrink-0 overflow-hidden transition-all duration-300"
                style={{
                  width: 64, height: 64, borderRadius: 12,
                  border: i === active ? '2.5px solid #c9922c' : '2px solid transparent',
                  opacity: i === active ? 1 : 0.55,
                  transform: i === active ? 'scale(1.04)' : 'scale(1)',
                  boxShadow: i === active ? '0 2px 12px rgba(201,146,44,0.25)' : 'none',
                  background: 'linear-gradient(135deg, #fce4ec, #fff3e0)',
                }}
                aria-label={`Photo ${i + 1}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" draggable={false} />
              </button>
            ))}
          </div>
        )}

        {/* Dot indicators */}
        {total > 1 && (
          <div className="flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goto(i)}
                style={{
                  height: 5,
                  width: i === active ? 20 : 5,
                  borderRadius: 3,
                  background: i === active ? '#c9922c' : 'rgba(201,146,44,0.22)',
                  transition: 'all 0.3s ease',
                }}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: 'rgba(18,8,4,0.97)', backdropFilter: 'blur(16px)' }}
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center z-10 text-white/80 hover:text-white transition-all"
            style={{ background: 'rgba(255,255,255,0.1)' }}
            onClick={() => setLightbox(false)}
          >
            <CloseIcon />
          </button>
          {total > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all z-10"
                style={{ background: 'rgba(255,255,255,0.1)' }}
                onClick={e => { e.stopPropagation(); prev(); }}
              >
                <ChevronLeft />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all z-10"
                style={{ background: 'rgba(255,255,255,0.1)' }}
                onClick={e => { e.stopPropagation(); next(); }}
              >
                <ChevronRight />
              </button>
            </>
          )}
          <img
            src={images[active]}
            alt={`${alt} ${active + 1}`}
            style={{
              maxWidth: '90vw', maxHeight: '88vh', objectFit: 'contain',
              borderRadius: 12, transform: `scale(${zoom})`,
              transition: 'transform 0.25s ease',
              cursor: zoom > 1 ? 'zoom-out' : 'zoom-in',
            }}
            draggable={false}
            onClick={e => { e.stopPropagation(); setZoom(z => z > 1 ? 1 : 2); }}
          />
          {total > 1 && (
            <div
              className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
            >
              {active + 1} / {total} · Tap to zoom
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes galleryFadeIn { from{opacity:0;transform:scale(1.02)} to{opacity:1;transform:scale(1)} }
      `}</style>
    </>
  );
}

// ─── Related products strip ───────────────────────────────────────────────────
function RelatedProductStrip({ categorySlug, currentId }: { categorySlug: string; currentId: string }) {
  const { products } = useProducts(categorySlug);
  const related = products.filter(p => p.id !== currentId).slice(0, 6);
  const { language } = useLanguage();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  if (related.length === 0) return null;

  return (
    <section className="mt-12 sm:mt-16 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-0.5" style={{ color: '#c9922c' }}>
              ✦ From the same collection
            </p>
            <h2
              className="font-bold"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', color: '#2c1810', letterSpacing: '-0.02em' }}
            >
              Similar Arrangements
            </h2>
          </div>
          <Link
            to={`/shop/${categorySlug}`}
            className="ml-auto flex-shrink-0 text-sm font-semibold flex items-center gap-1 transition-all duration-200 hover:gap-2"
            style={{ color: '#c9922c' }}
          >
            See All →
          </Link>
        </div>

        <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2">
          {related.map((p, i) => {
            const name = (language === 'ml' && p.name_ml) ? p.name_ml : p.name;
            const liked = isFavorite(p.id);
            const handleFav = (e: React.MouseEvent) => {
              e.preventDefault(); e.stopPropagation();
              liked ? removeFavorite(p.id) : addFavorite(p);
            };
            const handleWA = (e: React.MouseEvent) => {
              e.preventDefault(); e.stopPropagation();
              if (!WHATSAPP_NUMBER) return;
              const url = `${window.location.origin}/product/${p.id}`;
              const msg = encodeURIComponent(`Hi! I'm interested in:\n\n*${name}*\n\n${url}\n\nCould you share price and availability?`);
              window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer');
            };
            return (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="group flex-shrink-0 block"
                style={{ width: 'clamp(140px, 38vw, 200px)' }}
              >
                <div
                  className="relative overflow-hidden rounded-2xl mb-2 img-zoom"
                  style={{
                    aspectRatio: '3/4',
                    background: 'linear-gradient(135deg, #fce4ec, #fff3e0)',
                    boxShadow: '0 2px 16px rgba(180,100,120,0.1)',
                    border: '1px solid rgba(243,232,224,0.8)',
                    animationDelay: `${i * 0.07}s`,
                    animationFillMode: 'both',
                  }}
                >
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🌸</div>
                  )}
                  {/* hover overlay */}
                  <div
                    className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pb-2 px-2"
                    style={{ background: 'linear-gradient(to top, rgba(44,24,16,0.85), transparent)', paddingTop: 24 }}
                  >
                    <button
                      onClick={handleWA}
                      className="w-full flex items-center justify-center gap-1 py-1.5 rounded-xl text-[11px] font-bold text-white"
                      style={{ background: 'rgba(37,211,102,0.92)' }}
                    >
                      <WhatsAppIcon size={12} /> Ask
                    </button>
                  </div>
                  {/* fav */}
                  <button
                    onClick={handleFav}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', border: `1px solid ${liked ? '#f9b8c8' : 'rgba(255,255,255,0.5)'}` }}
                  >
                    <HeartIcon filled={liked} size={13} />
                  </button>
                </div>
                <p className="text-[0.8125rem] font-semibold line-clamp-2 leading-snug group-hover:text-[#c9922c] transition-colors px-0.5" style={{ color: '#2c1810' }}>
                  {name}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Quick inquiry panel ──────────────────────────────────────────────────────
function QuickInquiryPanel({ productName, options, onClose }: {
  productName: string;
  options: Record<string, string>;
  onClose: () => void;
}) {
  const [inquiry, setInquiry] = useState('price');
  const [note, setNote] = useState('');

  const INQUIRY_TYPES = [
    { key: 'price', label: 'Price', icon: '💰' },
    { key: 'availability', label: 'Availability', icon: '📅' },
    { key: 'custom', label: 'Customisation', icon: '✂️' },
    { key: 'general', label: 'General Query', icon: '💬' },
  ];

  const inquiryLabels: Record<string, string> = {
    price: 'asking for the price',
    availability: 'checking availability for my event',
    custom: 'requesting a custom design',
    general: 'with a general question',
  };

  const handleSend = () => {
    if (!WHATSAPP_NUMBER) return;
    const url = window.location.href;
    const optionLines = Object.entries(options).map(([k, v]) => `• ${k}: *${v}*`).join('\n');
    const noteText = note.trim() ? `\n\nNote: ${note}` : '';
    const msg = encodeURIComponent(
      `Hi! I'm ${inquiryLabels[inquiry] || 'inquiring'} about:\n\n*${productName}*\n${optionLines ? '\nSelected options:\n' + optionLines : ''}\n\nProduct: ${url}${noteText}\n\nCould you please assist me?`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(44,24,16,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden animate-fade-up"
        style={{ background: '#fff', boxShadow: '0 -8px 40px rgba(0,0,0,0.15)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle + header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(243,232,224,0.8)' }}>
          <div className="sm:hidden w-10 h-1 rounded-full bg-[#e8d5b7] mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#c9922c' }}>Quick Inquiry</p>
            <p className="font-semibold text-base mt-0.5 line-clamp-1" style={{ color: '#2c1810', fontFamily: "'Playfair Display', serif" }}>{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-[#fef3e2]"
            style={{ color: '#8b7060' }}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="px-5 pt-4 pb-5">
          {/* Inquiry type */}
          <p className="text-xs font-bold uppercase tracking-[0.15em] mb-2.5" style={{ color: '#8b7060' }}>What do you want to know?</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {INQUIRY_TYPES.map(type => (
              <button
                key={type.key}
                onClick={() => setInquiry(type.key)}
                className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 text-left"
                style={{
                  background: inquiry === type.key ? 'rgba(201,146,44,0.1)' : 'rgba(243,232,224,0.3)',
                  border: `1.5px solid ${inquiry === type.key ? '#c9922c' : 'rgba(243,232,224,0.8)'}`,
                  color: inquiry === type.key ? '#9a6f1e' : '#6b5444',
                }}
              >
                <span className="text-base">{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>

          {/* Optional note */}
          <p className="text-xs font-bold uppercase tracking-[0.15em] mb-2" style={{ color: '#8b7060' }}>Add a note (optional)</p>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="e.g. For a wedding on 15th May, approx 200 guests…"
            rows={2}
            className="w-full resize-none text-sm rounded-2xl px-4 py-3 outline-none transition-all duration-200"
            style={{
              border: '1.5px solid rgba(243,232,224,1)',
              background: '#fffdf9',
              color: '#2c1810',
              fontFamily: 'inherit',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = '#c9922c'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201,146,44,0.1)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(243,232,224,1)'; e.currentTarget.style.boxShadow = 'none'; }}
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            className="w-full mt-4 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-white text-[1rem] transition-all duration-300 active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #25D366, #1fbe5a)', boxShadow: '0 6px 24px rgba(37,211,102,0.3)' }}
          >
            <WhatsAppIcon size={20} />
            Send Inquiry on WhatsApp
          </button>
          <p className="text-center text-[11px] mt-2.5" style={{ color: '#b0997a' }}>
            🔒 No payment • Enquire freely • Response within 2 hours
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading, error } = useProduct(id);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { t, language } = useLanguage();

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [shareToast, setShareToast] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [stickyVisible, setStickyVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (ctaRef.current) obs.observe(ctaRef.current);
    return () => obs.disconnect();
  }, [product]);

  // ─ Loading ─
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#fffdf9' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
          <div className="skeleton h-4 w-40 rounded mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="skeleton rounded-2xl" style={{ aspectRatio: '1/1' }} />
            <div className="flex flex-col gap-4 pt-2">
              <div className="skeleton h-6 w-24 rounded-full" />
              <div className="skeleton h-10 w-3/4 rounded" />
              <div className="skeleton h-4 w-1/2 rounded" />
              <div className="skeleton h-px w-full rounded mt-2" />
              <div className="skeleton h-14 w-full rounded-2xl mt-4" />
              <div className="skeleton h-12 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-5" style={{ background: '#fffdf9' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
          style={{ background: 'linear-gradient(135deg, #fce4ec, #fff3e0)' }}>🌸</div>
        <p className="text-base font-semibold text-center" style={{ color: '#4a3728' }}>
          {error ? `${t.error}: ${error}` : 'Arrangement not found'}
        </p>
        <Link to="/shop" className="btn-luxury btn-luxury-primary text-sm">Browse Collections</Link>
      </div>
    );
  }

  const isLiked = isFavorite(product.id);
  const displayName = (language === 'ml' && product.name_ml) ? product.name_ml : product.name;
  const formatSlug = (s: string) => s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

  const specs = product.specifications ?? {};
  const specEntries = Object.entries(specs);
  const optionEntries = specEntries.filter(([k]) => OPTION_KEYS.some(ok => k.toLowerCase().includes(ok)));
  const detailEntries = specEntries.filter(([k]) => !OPTION_KEYS.some(ok => k.toLowerCase().includes(ok)));

  // Init options once
  if (optionEntries.length > 0 && Object.keys(selectedOptions).length === 0) {
    const init: Record<string, string> = {};
    optionEntries.forEach(([k, v]) => { init[k] = v.split(',')[0].trim(); });
    setSelectedOptions(init);
  }

  const tags = [
    formatSlug(product.categorySlug),
    ...specEntries.slice(0, 3).map(([, v]) => v.split(',')[0].trim()),
  ].filter(Boolean);

  const buildWAMessage = () => {
    const url = window.location.href;
    const optLines = Object.entries(selectedOptions).map(([k, v]) => `• ${k}: *${v}*`).join('\n');
    return `Hi! I'm interested in:\n\n*${displayName}*\n${optLines ? '\nCustomization:\n' + optLines : ''}\n\nProduct: ${url}\n\nCould you please share more details, pricing, and availability?`;
  };

  const handleWhatsApp = () => {
    if (!WHATSAPP_NUMBER) { alert('WhatsApp not configured.'); return; }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWAMessage())}`, '_blank', 'noopener,noreferrer');
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

  const handleFav = () => isLiked ? removeFavorite(product.id) : addFavorite(product);

  return (
    <div className="min-h-screen pb-24 lg:pb-0" style={{ background: '#fffdf9' }}>

      {/* ──── Breadcrumb bar ──── */}
      <div style={{ borderBottom: '1px solid rgba(243,232,224,0.7)', background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            <Link
              to={product.categorySlug ? `/shop/${product.categorySlug}` : '/shop'}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:text-[#c9922c]"
              style={{ color: '#8b7060' }}
            >
              <BackIcon />
              <span>Back to {product.categorySlug ? formatSlug(product.categorySlug) : 'Catalog'}</span>
            </Link>
            <div className="flex-1 overflow-hidden">
              <Breadcrumbs items={[
                { label: t.home, to: '/' },
                { label: t.shop, to: '/shop' },
                ...(product.categorySlug ? [{ label: formatSlug(product.categorySlug), to: `/shop/${product.categorySlug}` }] : []),
                { label: displayName },
              ]} />
            </div>
          </div>
        </div>
      </div>

      {/* ──── Main content grid ──── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6 sm:gap-8 lg:gap-14 xl:gap-20 items-start">

          {/* ████ LEFT: Photo Gallery ████ */}
          <div className="lg:sticky lg:top-24">
            <PhotoGallery images={product.images} alt={displayName} />
          </div>

          {/* ████ RIGHT: Info Panel ████ */}
          <div className="flex flex-col gap-0 animate-fade-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>

            {/* Category + tags */}
            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              {product.categorySlug && (
                <Link
                  to={`/shop/${product.categorySlug}`}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors hover:text-[#c9922c]"
                  style={{ background: 'rgba(201,146,44,0.08)', color: '#9a6f1e', border: '1px solid rgba(201,146,44,0.2)' }}
                >
                  {formatSlug(product.categorySlug)}
                </Link>
              )}
              {tags.slice(1, 4).map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium"
                  style={{ background: 'rgba(243,232,224,0.6)', color: '#6b5444', border: '1px solid rgba(243,232,224,0.9)' }}
                >
                  <TagIcon /> {tag}
                </span>
              ))}
            </div>

            {/* Name + action row */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <h1
                className="font-bold leading-[1.12]"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: '#1e0f08',
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
                  letterSpacing: '-0.025em',
                }}
              >
                {displayName}
              </h1>

              <div className="flex items-center gap-2 flex-shrink-0 pt-1">
                {/* Favourite */}
                <button
                  onClick={handleFav}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                  style={{
                    background: isLiked ? '#fff0f3' : 'rgba(243,232,224,0.5)',
                    border: `1.5px solid ${isLiked ? '#f9b8c8' : 'rgba(243,232,224,1)'}`,
                    color: isLiked ? '#f43b6a' : '#4a3728',
                  }}
                  aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <HeartIcon filled={isLiked} size={18} />
                </button>

                {/* Share */}
                <div className="relative">
                  <button
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                    style={{ background: 'rgba(243,232,224,0.5)', border: '1.5px solid rgba(243,232,224,1)', color: '#4a3728' }}
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

            {/* Gold divider */}
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,146,44,0.25), rgba(243,232,224,0.8), transparent)', marginBottom: 20 }} />

            {/* ── Description (optional) ── */}
            {product.description && product.description.trim().length > 0 && (
              <div className="mb-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: '#c9922c' }}>About this piece</p>
                <p className="text-[0.9375rem] leading-[1.75] whitespace-pre-line" style={{ color: '#4a3728' }}>
                  {product.description}
                </p>
              </div>
            )}

            {/* ── Customization option pickers ── */}
            {optionEntries.length > 0 && (
              <div className="mb-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#c9922c' }}>Customization Options</p>
                <div className="flex flex-col gap-4">
                  {optionEntries.map(([key, raw]) => {
                    const choices = raw.split(',').map(s => s.trim()).filter(Boolean);
                    const selected = selectedOptions[key] ?? choices[0];
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold capitalize" style={{ color: '#2c1810' }}>{key}</span>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,146,44,0.1)', color: '#9a6f1e' }}>
                            {selected}
                          </span>
                        </div>
                        {choices.length === 1 ? (
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold"
                            style={{ background: 'rgba(201,146,44,0.1)', border: '1.5px solid rgba(201,146,44,0.4)', color: '#9a6f1e' }}
                          >
                            ✓ {selected}
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {choices.map(c => {
                              const sel = selected === c;
                              return (
                                <button
                                  key={c}
                                  onClick={() => setSelectedOptions(p => ({ ...p, [key]: c }))}
                                  className="px-3.5 py-2 rounded-xl text-[0.8125rem] font-semibold capitalize transition-all duration-200 hover:scale-105 active:scale-95"
                                  style={{
                                    background: sel ? 'rgba(201,146,44,0.12)' : 'transparent',
                                    border: `1.5px solid ${sel ? '#c9922c' : 'rgba(243,232,224,1)'}`,
                                    color: sel ? '#9a6f1e' : '#6b5444',
                                    boxShadow: sel ? '0 2px 10px rgba(201,146,44,0.18)' : 'none',
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
                <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,146,44,0.2), transparent)', margin: '20px 0' }} />
              </div>
            )}

            {/* ── Specifications table ── */}
            {detailEntries.length > 0 && (
              <div className="mb-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#c9922c' }}>{t.specifications || 'Specifications'}</p>
                <div className="overflow-hidden" style={{ borderRadius: 16, border: '1px solid rgba(243,232,224,0.9)' }}>
                  {detailEntries.map(([k, v], i) => (
                    <div
                      key={k}
                      className="flex items-center justify-between px-4 py-3"
                      style={{ background: i % 2 === 0 ? '#fffdf9' : '#fff', borderBottom: i < detailEntries.length - 1 ? '1px solid rgba(243,232,224,0.6)' : 'none' }}
                    >
                      <span className="text-xs sm:text-sm font-medium capitalize" style={{ color: '#8b7060' }}>{k}</span>
                      <span className="text-xs sm:text-sm font-semibold text-right ml-4" style={{ color: '#2c1810' }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,146,44,0.2), transparent)', margin: '20px 0' }} />
              </div>
            )}

            {/* ── Why Choose Us ── */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              {[
                { icon: '🌸', label: 'Fresh Daily', sub: 'Sourced every morning' },
                { icon: '✂️', label: 'Custom Sizing', sub: 'Made to your specs' },
                { icon: '⚡', label: 'Fast Reply', sub: 'Within 2 hours' },
                { icon: '🎁', label: 'Gift Packing', sub: 'Premium packaging' },
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

            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,146,44,0.2), transparent)', marginBottom: 20 }} />

            {/* ── CTA Block ── */}
            <div ref={ctaRef} className="flex flex-col gap-2.5">
              {/* WhatsApp primary */}
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-white text-[1rem] transition-all duration-300 active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #25D366, #1fbe5a)', boxShadow: '0 6px 24px rgba(37,211,102,0.32)' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 10px 32px rgba(37,211,102,0.42)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.boxShadow = '0 6px 24px rgba(37,211,102,0.32)'; }}
              >
                <WhatsAppIcon size={22} />
                Enquire Now on WhatsApp
              </button>

              {/* Quick inquiry panel trigger */}
              <button
                onClick={() => setInquiryOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl font-semibold text-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.98]"
                style={{ background: 'rgba(201,146,44,0.07)', border: '1.5px solid rgba(201,146,44,0.3)', color: '#9a6f1e' }}
              >
                💬 Ask price / availability / custom options
              </button>

              {/* Save to wishlist */}
              <button
                onClick={handleFav}
                className="w-full flex items-center justify-center gap-2.5 py-3 px-6 rounded-2xl font-semibold text-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.98]"
                style={{
                  background: isLiked ? 'rgba(244,59,106,0.06)' : 'transparent',
                  border: `1.5px solid ${isLiked ? '#f9b8c8' : 'rgba(243,232,224,1)'}`,
                  color: isLiked ? '#e0385f' : '#4a3728',
                }}
              >
                <HeartIcon filled={isLiked} size={17} />
                {isLiked ? (t.saved || 'Saved to Wishlist') : (t.addToFavorites || 'Save to Wishlist')}
              </button>

              {/* Reassurance */}
              <p className="text-center text-[11px] pt-0.5" style={{ color: '#b0997a' }}>
                🔒 No payment required · Enquire freely · We respond within 2 hours
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ──── Related Products ──── */}
      {product.categorySlug && (
        <RelatedProductStrip categorySlug={product.categorySlug} currentId={product.id} />
      )}

      {/* ──── Sticky Mobile CTA Bar ──── */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-all duration-400 ${
          stickyVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        style={{
          background: 'rgba(255,253,249,0.97)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(243,232,224,0.9)',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div className="flex items-center gap-2.5 px-4 py-3">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200 active:scale-[0.97]"
            style={{ background: 'linear-gradient(135deg, #25D366, #1fbe5a)', boxShadow: '0 4px 16px rgba(37,211,102,0.3)' }}
          >
            <WhatsAppIcon size={18} /> Enquire
          </button>
          {/* Quick inquiry */}
          <button
            onClick={() => setInquiryOpen(true)}
            className="flex items-center justify-center px-3 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95"
            style={{ background: 'rgba(201,146,44,0.1)', border: '1.5px solid rgba(201,146,44,0.3)', color: '#9a6f1e' }}
          >
            💬
          </button>
          {/* Fav */}
          <button
            onClick={handleFav}
            className="w-12 flex-shrink-0 flex items-center justify-center h-full rounded-xl py-3.5 transition-all duration-200 active:scale-95"
            style={{
              background: isLiked ? '#fff0f3' : 'rgba(243,232,224,0.5)',
              border: `1.5px solid ${isLiked ? '#f9b8c8' : 'rgba(243,232,224,1)'}`,
            }}
            aria-label="Toggle wishlist"
          >
            <HeartIcon filled={isLiked} size={18} />
          </button>
        </div>
      </div>

      {/* Quick Inquiry Panel */}
      {inquiryOpen && (
        <QuickInquiryPanel
          productName={displayName}
          options={selectedOptions}
          onClose={() => setInquiryOpen(false)}
        />
      )}

    </div>
  );
}
