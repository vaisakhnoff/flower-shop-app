import { useState, useCallback, useEffect, useRef } from 'react';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

const ChevronIcon = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    {dir === 'left'
      ? <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      : <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    }
  </svg>
);

const ZoomIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M5 7h4M7 5v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxScale, setLightboxScale] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const total = images.length;

  const goto = useCallback((idx: number) => {
    if (isAnimating || idx === active) return;
    setIsAnimating(true);
    setActive(((idx % total) + total) % total);
    setTimeout(() => setIsAnimating(false), 350);
  }, [active, total, isAnimating]);

  const prev = useCallback(() => goto(active - 1), [active, goto]);
  const next = useCallback(() => goto(active + 1), [active, goto]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
        if (e.key === 'Escape') { setLightboxOpen(false); setLightboxScale(1); }
      } else {
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next, lightboxOpen]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
  };

  if (!images || images.length === 0) {
    return (
      <div
        className="w-full flex items-center justify-center text-5xl"
        style={{
          aspectRatio: '1 / 1',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #fce4ec, #fff3e0)',
        }}
      >
        🌸
      </div>
    );
  }

  return (
    <>
      {/* ── Main Gallery ── */}
      <div className="flex flex-col gap-3">

        {/* Primary Image */}
        <div
          className="relative overflow-hidden select-none"
          style={{
            borderRadius: '20px',
            aspectRatio: '1 / 1',
            background: 'linear-gradient(135deg, #fef5f7, #fffaf0)',
            boxShadow: '0 4px 32px rgba(44,24,16,0.09), 0 1px 6px rgba(0,0,0,0.05)',
            cursor: 'zoom-in',
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => { setLightboxOpen(true); setLightboxScale(1); }}
        >
          {/* Image */}
          <img
            key={active}
            src={images[active]}
            alt={`${alt} ${active + 1}`}
            className="w-full h-full object-cover"
            style={{
              animation: 'galleryFadeIn 0.35s ease-out',
            }}
            draggable={false}
          />

          {/* Subtle gradient at bottom */}
          <div
            className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(44,24,16,0.12), transparent)' }}
          />

          {/* Arrow buttons — only when multiple images */}
          {total > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-[#4a3728] transition-all duration-200 hover:scale-110 active:scale-95"
                style={{
                  background: 'rgba(255,253,249,0.92)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
                }}
                aria-label="Previous image"
              >
                <ChevronIcon dir="left" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-[#4a3728] transition-all duration-200 hover:scale-110 active:scale-95"
                style={{
                  background: 'rgba(255,253,249,0.92)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
                }}
                aria-label="Next image"
              >
                <ChevronIcon dir="right" />
              </button>
            </>
          )}

          {/* Counter badge */}
          {total > 1 && (
            <div
              className="absolute bottom-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(255,253,249,0.9)',
                backdropFilter: 'blur(6px)',
                color: '#4a3728',
                boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
              }}
            >
              {active + 1} / {total}
            </div>
          )}

          {/* Zoom hint */}
          <div
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255,253,249,0.85)',
              backdropFilter: 'blur(6px)',
              color: '#8b7060',
              boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
            }}
          >
            <ZoomIcon />
          </div>
        </div>

        {/* Thumbnail Strip */}
        {total > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => goto(i)}
                className="flex-shrink-0 transition-all duration-300 overflow-hidden"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '12px',
                  border: i === active
                    ? '2.5px solid #c9922c'
                    : '2.5px solid transparent',
                  outline: i === active ? '1px solid rgba(201,146,44,0.2)' : 'none',
                  outlineOffset: '1px',
                  opacity: i === active ? 1 : 0.55,
                  transform: i === active ? 'scale(1.04)' : 'scale(1)',
                  background: 'linear-gradient(135deg, #fce4ec, #fff3e0)',
                  boxShadow: i === active ? '0 2px 12px rgba(201,146,44,0.25)' : 'none',
                }}
                aria-label={`View image ${i + 1}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" draggable={false} />
              </button>
            ))}
          </div>
        )}

        {/* Dot indicators (mobile-friendly, shown below thumbnails too) */}
        {total > 1 && (
          <div className="flex justify-center gap-1.5 mt-0.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goto(i)}
                style={{
                  height: '5px',
                  width: i === active ? '20px' : '5px',
                  borderRadius: '3px',
                  background: i === active ? '#c9922c' : 'rgba(201,146,44,0.22)',
                  transition: 'all 0.3s ease',
                }}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox Modal ── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: 'rgba(20,10,5,0.96)', backdropFilter: 'blur(12px)' }}
          onClick={() => { setLightboxOpen(false); setLightboxScale(1); }}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors z-10"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(6px)' }}
            onClick={() => { setLightboxOpen(false); setLightboxScale(1); }}
            aria-label="Close lightbox"
          >
            <CloseIcon />
          </button>

          {/* Arrows */}
          {total > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all hover:scale-110 z-10"
                style={{ background: 'rgba(255,255,255,0.1)' }}
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Previous"
              >
                <ChevronIcon dir="left" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all hover:scale-110 z-10"
                style={{ background: 'rgba(255,255,255,0.1)' }}
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Next"
              >
                <ChevronIcon dir="right" />
              </button>
            </>
          )}

          {/* Image */}
          <img
            src={images[active]}
            alt={`${alt} ${active + 1}`}
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '88vh',
              objectFit: 'contain',
              borderRadius: '12px',
              transform: `scale(${lightboxScale})`,
              transition: 'transform 0.25s ease',
              cursor: lightboxScale > 1 ? 'zoom-out' : 'zoom-in',
            }}
            draggable={false}
            onClick={e => {
              e.stopPropagation();
              setLightboxScale(s => s > 1 ? 1 : 2);
            }}
          />

          {/* Counter */}
          {total > 1 && (
            <div
              className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}
            >
              {active + 1} / {total} · Click to zoom
            </div>
          )}
        </div>
      )}

      {/* Gallery animation keyframes */}
      <style>{`
        @keyframes galleryFadeIn {
          from { opacity: 0; transform: scale(1.02); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
