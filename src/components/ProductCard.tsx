import { Link } from 'react-router-dom';
import { type Product } from '../types'; // Use type-only import
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Use the first image as the main image, or a placeholder
  const imageUrl = product.images[0] || 'https://via.placeholder.com/300';
  
  // Link to the product's detail page (which we'll build next)
  const productLink = `/product/${product.id}`;

  return (
    <Link to={productLink} className="product-card">
      <div className="product-card-image">
        <img src={imageUrl} alt={product.name} loading="lazy" />
      </div>
      <div className="product-card-info">
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-price">₹{product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}
