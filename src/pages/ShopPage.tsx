import { useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
// We no longer need to import './ShopPage.css'

export default function ShopPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products, isLoading, error } = useProducts(slug);

  // We can use Tailwind classes for the loading/error states too
  if (isLoading) {
    return <div className="p-10 text-center text-lg">Loading products...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-lg text-red-600">Error: {error}</div>;
  }

  return (
    <div className="
      max-w-6xl 
      mx-auto 
      p-4 sm:p-6 lg:p-8
    ">
      {/* max-w-6xl: Sets a max-width for the content
        mx-auto: Centers the content
        p-4 sm:p-6 lg:p-8: Responsive padding (mobile, small, large)
      */}
      
      <h2 className="
        text-2xl sm:text-3xl 
        font-bold 
        text-gray-800 
        mb-6 
        capitalize
      ">
        {/* We use a dynamic title:
          - If 'slug' exists, show "Category: [Slug]"
          - Otherwise, show "All Products"
        */}
        {slug ? `Category: ${slug.replace('-', ' ')}` : 'All Products'}
      </h2>
      
      <div className="
        grid 
        grid-cols-2 
        gap-4 
        sm:grid-cols-3 
        md:grid-cols-4 
        sm:gap-6
      ">
        {/* grid: Enables grid layout
          grid-cols-2 sm:grid-cols-3...: Responsive grid columns
            - 2 columns on mobile (default)
            - 3 columns on small screens (sm)
            - 4 columns on medium screens (md)
          gap-4 sm:gap-6: Responsive gaps between cards
        */}
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found in this category.
          </p>
        )}
      </div>
    </div>
  );
}