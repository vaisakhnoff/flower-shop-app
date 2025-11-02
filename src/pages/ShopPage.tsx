import { useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import './ShopPage.css';

export default function ShopPage() {
  // 1. Get the 'slug' from the URL. e.g., "/shop/:slug"
  // We defined :slug in our App.tsx routes
  const { slug } = useParams<{ slug: string }>();

  // 2. Pass the slug to our hook. It will be 'undefined'
  // if we're on the main /shop page, which is fine!
  const { products, isLoading, error } = useProducts(slug);

  // 3. Handle loading state
  if (isLoading) {
    return <div>Loading products...</div>;
  }

  // 4. Handle error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="shop-page">
      {/* We can add a dynamic title later */}
      <h2>{slug ? `Category: ${slug}` : 'All Products'}</h2>
      
      <div className="product-grid">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No products found in this category.</p>
        )}
      </div>
    </div>
  );
}
