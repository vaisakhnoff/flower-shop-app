import { useLanguage } from '../context/LanguageContext';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;
const BUSINESS_NAME = "Shanmughan, Anjali Flowers";
const BUSINESS_EMAIL = "anjaliflowerworks@gmail.com";
const BUSINESS_PHONE = "+91 9388121197";

export default function ContactPage() {
  const { t } = useLanguage();

  const handleGeneralInquiry = () => {
    if (!WHATSAPP_NUMBER) {
      alert("Contact feature is not set up correctly.");
      return;
    }
    const message = encodeURIComponent("Hi, I'd like to know more about your floral arrangements and services.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const contactItems = [
    {
      icon: '📞',
      label: t.phone || 'Phone',
      value: BUSINESS_PHONE,
      href: `tel:${BUSINESS_PHONE}`,
      sublabel: 'Call us anytime',
    },
    {
      icon: '✉️',
      label: t.email || 'Email',
      value: BUSINESS_EMAIL,
      href: `mailto:${BUSINESS_EMAIL}`,
      sublabel: 'We reply within 24 hours',
    },
    {
      icon: '📍',
      label: 'Location',
      value: 'Kerala, India',
      href: undefined,
      sublabel: 'Serving all of Kerala',
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#fffdf9' }}>

      {/* ── Header Banner ── */}
      <div
        className="relative px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-14 sm:pb-18 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #fff5f7 0%, #fffdf5 45%, #fef5e4 100%)' }}
      >
        <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full opacity-40 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #ffc9d5, transparent)' }} />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #fdf0c2, transparent)' }} />

        <div className="relative max-w-3xl mx-auto text-center animate-fade-up">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#c9922c' }}>
            ✦ Get in Touch
          </p>
          <h1
            className="font-display font-bold leading-tight mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: '#2c1810',
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              letterSpacing: '-0.02em',
            }}
          >
            {t.contactUs || 'Let\'s Create Something Beautiful'}
          </h1>
          <p className="text-base sm:text-lg max-w-md mx-auto" style={{ color: '#8b7060' }}>
            {t.contactSubtitle || 'Reach out to discuss your floral vision — every occasion deserves extraordinary blooms.'}
          </p>
        </div>
      </div>

      {/* ── Contact Section ── */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14 -mt-4">

        {/* Business Card */}
        <div
          className="rounded-3xl overflow-hidden mb-5 animate-scale-in"
          style={{
            background: '#fff',
            boxShadow: '0 4px 32px rgba(44,24,16,0.08), 0 1px 6px rgba(0,0,0,0.04)',
            border: '1px solid rgba(243,232,224,0.8)',
          }}
        >
          {/* Card Header */}
          <div
            className="px-6 sm:px-8 py-6 sm:py-7"
            style={{ background: 'linear-gradient(135deg, rgba(201,146,44,0.06), rgba(244,59,106,0.04))' }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #fce4ec, #fff3e0)' }}
              >
                🌸
              </div>
              <div>
                <h2
                  className="font-display font-bold text-xl sm:text-2xl"
                  style={{ fontFamily: "'Playfair Display', serif", color: '#2c1810' }}
                >
                  {BUSINESS_NAME}
                </h2>
                <p className="text-xs mt-1 tracking-wider uppercase font-medium" style={{ color: '#c9922c' }}>
                  Floral Design Studio
                </p>
              </div>
            </div>
          </div>

          {/* Contact Items */}
          <div className="divide-y" style={{ borderColor: 'rgba(243,232,224,0.6)' }}>
            {contactItems.map((item) => (
              <div key={item.label} className="flex items-center gap-4 px-6 sm:px-8 py-5">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: 'rgba(201,146,44,0.08)', border: '1px solid rgba(201,146,44,0.15)' }}
                >
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: '#b0997a' }}>
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm sm:text-base font-medium transition-colors duration-200 hover:text-[#c9922c] block truncate"
                      style={{ color: '#2c1810' }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm sm:text-base font-medium" style={{ color: '#2c1810' }}>
                      {item.value}
                    </p>
                  )}
                  <p className="text-xs mt-0.5" style={{ color: '#b0997a' }}>{item.sublabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp CTA */}
        <button
          onClick={handleGeneralInquiry}
          className="w-full flex items-center justify-center gap-3 py-4 sm:py-5 px-6 rounded-2xl font-semibold text-base sm:text-lg tracking-wide text-white transition-all duration-300 mb-4 active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #25D366, #20BA5A)',
            boxShadow: '0 6px 24px rgba(37,211,102,0.3)',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 32px rgba(37,211,102,0.4)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(37,211,102,0.3)'; }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          {t.sendInquiry || 'Send a WhatsApp Message'}
        </button>

        {/* Timing note */}
        <p className="text-center text-xs" style={{ color: '#b0997a' }}>
          🕐 Typical response time: within 2 hours
        </p>
      </div>
    </div>
  );
}
