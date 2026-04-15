import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative mt-16 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #2c1810 0%, #3d1e14 60%, #2c2218 100%)' }}
    >
      {/* Decorative top border */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,146,44,0.5), transparent)' }} />

      {/* Decorative orbs */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #c9922c, transparent)', transform: 'translate(-40%, -40%)' }} />
      <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #f43b6a, transparent)', transform: 'translate(30%, 30%)' }} />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">

          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(201,146,44,0.15)', border: '1px solid rgba(201,146,44,0.3)' }}>
                <span className="text-xl">🌸</span>
              </div>
              <div>
                <p className="font-display font-bold text-white text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Anjali Flowers
                </p>
                <p className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: '#c9922c' }}>
                  Floral Design Studio
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Crafting breathtaking floral experiences for weddings, celebrations, and special moments. Every bloom tells your story.
            </p>
            {/* Gold divider */}
            <div className="w-10 h-px mb-4" style={{ background: 'linear-gradient(90deg, #c9922c, transparent)' }} />
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Shanmughan, Anjali Flowers
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold mb-5" style={{ color: '#c9922c' }}>
              Explore
            </h4>
            <ul className="space-y-3.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/shop', label: 'Collections' },
                { to: '/favorites', label: 'Saved Items' },
                { to: '/contact', label: 'Get in Touch' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm transition-colors duration-200 hover:text-[#c9922c] flex items-center gap-2 group"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    <span className="w-0 h-px bg-[#c9922c] transition-all duration-300 group-hover:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold mb-5" style={{ color: '#c9922c' }}>
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+919388121197"
                  className="text-sm flex items-start gap-3 group transition-colors duration-200 hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  <span className="mt-0.5 text-base flex-shrink-0">📞</span>
                  <span>+91 9388121197</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:anjaliflowerworks@gmail.com"
                  className="text-sm flex items-start gap-3 group transition-colors duration-200 hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  <span className="mt-0.5 text-base flex-shrink-0">✉️</span>
                  <span className="break-all">anjaliflowerworks@gmail.com</span>
                </a>
              </li>
              <li className="pt-2">
                <a
                  href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide text-white transition-all duration-300 hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #25D366, #20BA5A)', boxShadow: '0 4px 14px rgba(37,211,102,0.3)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              © {year} Anjali Flowers. All rights reserved.
            </p>
            <p className="text-xs flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Made with <span className="text-[#f43b6a] text-sm">♥</span> for beautiful moments
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
