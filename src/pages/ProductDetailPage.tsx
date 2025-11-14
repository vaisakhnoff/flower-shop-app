import { useParams } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import './ProductDetailPage.css'; 
// 1. Import our new favorites hook
import { useFavorites } from '../context/FavoritesContext';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading, error } = useProduct(id);
  
  // 2. Get the functions and data from our context
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  // 3. Check if this product is *already* a favorite
  // We use `product.id` to check.
  const isAlreadyFavorite = product ? isFavorite(product.id) : false;

  const handleWhatsAppContact = () => {
    // ... (this function is unchanged)
    if (!product) return;
    if (!WHATSAPP_NUMBER) {
      console.error("VITE_WHATSAPP_NUMBER is not defined in your .env.local file.");
      alert("Sorry, the contact feature is not set up correctly.");
      return;
    }
    const productUrl = window.location.href;
    const message = `Hi, I'm interested in this product:
    \n${product.name}
    \nYou can see it here: ${productUrl}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // 4. Create the function for our new button
  const handleFavoriteClick = () => {
    if (!product) return; // Safety check

    if (isAlreadyFavorite) {
      // If it's already a favorite, remove it
      removeFavorite(product.id);
    } else {
      // If it's not, add it
      addFavorite(product);
    }
  };

  if (isLoading) {
    return <div className="page-status">Loading product...</div>;
  }
  if (error) {
    return <div className="page-status error">Error: {error}</div>;
  }
  if (!product) {
    return <div className="page-status">Product not found.</div>;
  }

  return (
    <div className="product-detail-page">
      <div className="product-gallery">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="product-detail-image"
        />
      </div>

      <div className="product-detail-info">
        <h1 className="product-detail-name">{product.name}</h1>
        <p className="product-detail-price">
          ₹{product.price.toLocaleString('en-IN')}
        </p>
        <p className="product-detail-description">{product.description}</p>
        
        <div className="product-detail-specs">
          {/* ... (specifications list is unchanged) ... */}
          <h3>Specifications</h3>
          <ul>
            {Object.entries(product.specifications).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
        
        {/* 5. Add the button group */}
        <div className="product-button-group">
          <button 
            className="whatsapp-button" 
            onClick={handleWhatsAppContact}
          >
            Contact on WhatsApp
          </button>
          
          {/* 6. Our new Favorites button */}
          <button 
            className={`favorite-button ${isAlreadyFavorite ? 'active' : ''}`}
            onClick={handleFavoriteClick}
          >
            {/* The text changes based on if it's a favorite or not */}
            {isAlreadyFavorite ? 'Added to Favorites' : 'Add to Favorites'}
          </button>
        </div>
      </div>
    </div>
  );
}