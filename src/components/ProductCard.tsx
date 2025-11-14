import { type Product } from '../types';
import './ProductCard.css';
import { Link } from 'react-router-dom'; // 1. Import the Link component

export default function ProductCard({ product }: { product: Product }) {
  
  // 2. Wrap the entire card in a Link component.
  // We link to the route we defined: /product/ followed by the product's unique ID.
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <img 
        src={product.images[0]} 
        alt={product.name}
        className="product-card-image" 
      />
      <div className="product-card-info">
        <h3 className="product-card-name">{product.name}</h3>
        {/* We format the price for India (₹) */}
        <p className="product-card-price">₹{product.price.toLocaleString('en-IN')}</p>
      </div>
    </Link>
  );
}