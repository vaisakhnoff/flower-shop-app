import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  to?: string; // FIX: Added '?' to make it optional
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="inline-flex items-center">
              {index > 0 && (
                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                </svg>
              )}
              
              {item.to && !isLast ? (
                <Link to={item.to} className="inline-flex items-center text-gray-700 hover:text-teal-600 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={`ml-1 md:ml-2 ${isLast ? 'text-gray-500 font-medium' : 'text-gray-700'}`}>
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