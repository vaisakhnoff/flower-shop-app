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
