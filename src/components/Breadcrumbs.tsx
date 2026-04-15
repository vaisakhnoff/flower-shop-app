import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="inline-flex items-center flex-wrap gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="inline-flex items-center gap-1">
              {index > 0 && (
                <svg
                  width="5" height="9" viewBox="0 0 5 9" fill="none"
                  aria-hidden="true"
                  style={{ color: 'rgba(176,153,122,0.5)' }}
                >
                  <path d="M1 1l3 3.5L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="text-xs sm:text-sm transition-colors duration-200 hover:text-[#c9922c] truncate max-w-[120px] sm:max-w-none"
                  style={{ color: '#8b7060' }}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-xs sm:text-sm font-medium truncate max-w-[120px] sm:max-w-none"
                  style={{ color: isLast ? '#2c1810' : '#8b7060' }}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}