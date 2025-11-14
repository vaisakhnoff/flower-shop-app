import { useParams } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import './ProductDetailPage.css'; // We will create this file next

export default function ProductDetailPage() {
  // 1. Get the 'id' from the URL
  // (We defined this route in App.tsx as "/product/:id")
  const { id } = useParams<{ id: string }>();

  // 2. Use our custom hook to fetch the data
  const { product, isLoading, error } = useProduct(id);

  // 3. Handle the loading state
  if (isLoading) {
    return <div className="page-status">Loading product...</div>;
  }

  // 4. Handle the error state
  if (error) {
    return <div className="page-status error">Error: {error}</div>;
  }

  // 5. Handle the "not found" state
  if (!product) {
    return <div className="page-status">Product not found.</div>;
  }

  // 6. If we have data, render it
  return (
    <div className="product-detail-page">
      {/* This is a simple image gallery. 
        We just show the first image for now.
      */}
      <div className="product-gallery">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="product-detail-image"
        />
      </div>

      {/* This holds all the text info */}
      <div className="product-detail-info">
        <h1 className="product-detail-name">{product.name}</h1>
        
        <p className="product-detail-price">
          {/* We format the price for India (₹) */}
          ₹{product.price.toLocaleString('en-IN')}
        </p>
        
        <p className="product-detail-description">{product.description}</p>
        
        <div className="product-detail-specs">
          <h3>Specifications</h3>
          <ul>
            {/* We loop through the 'specifications' object.
              Object.entries() turns { flowers: "12 Red Roses" }
              into [ ["flowers", "12 Red Roses"] ] so we can map it.
            */}
            {Object.entries(product.specifications).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
        
        <button className="whatsapp-button">
          Contact on WhatsApp
        </button>
      </div>
    </div>
  );
}