import { useParams } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import './ProductDetailPage.css'; 

// === IMPORTANT ===
// Change this to your father's business WhatsApp number.
// It MUST include the country code without the '+' or '00'.
// For example, for an Indian number 1234567890, it should be '911234567890'.
const WHATSAPP_NUMBER = '911234567890'; // <-- *** PUT YOUR NUMBER HERE ***

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading, error } = useProduct(id);

  // This function will run when the button is clicked
  const handleWhatsAppContact = () => {
    // We only proceed if the product data has loaded
    if (!product) {
      return; 
    }

    // 1. Create the pre-filled message.
    // This message "tags" the product the customer is looking at.
    const message = `Hi, I'm interested in your product: "${product.name}".`;

    // 2. Encode the message for a URL.
    // This is a critical step! It converts spaces and special characters
    // (like " & ?") into a format that is safe to use in a web link.
    // For example, "Hi, I'm..." becomes "Hi%2C%20I'm..."
    const encodedMessage = encodeURIComponent(message);

    // 3. Create the final WhatsApp URL.
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // 4. Open the URL in a new browser tab.
    // This will open the user's WhatsApp app (on mobile) or
    // WhatsApp Web (on desktop).
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
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
          <h3>Specifications</h3>
          <ul>
            {Object.entries(product.specifications).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
        
        {/* We attach our new function to the button's onClick event.
        */}
        <button 
          className="whatsapp-button" 
          onClick={handleWhatsAppContact}
        >
          Contact on WhatsApp
        </button>
      </div>
    </div>
  );
}