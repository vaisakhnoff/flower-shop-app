// src/pages/ContactPage.tsx
import './ContactPage.css'; // We will create this file next

// Get the number from Vite's "environment variables"
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

// === IMPORTANT ===
// Change these details to your father's business info
const BUSINESS_NAME = "My Father's Flower Shop";
const BUSINESS_EMAIL = "info@myflowershop.com";
const BUSINESS_PHONE = "+91 12 3456 7890";
const BUSINESS_ADDRESS = "123 Flower Street, Your City, Kerala";

export default function ContactPage() {

  const handleGeneralInquiry = () => {
    if (!WHATSAPP_NUMBER) {
      console.error("VITE_WHATSAPP_NUMBER is not defined in your .env.local file.");
      alert("Sorry, the contact feature is not set up correctly.");
      return;
    }

    // A general message, not specific to a product
    const message = `Hi, I have a general question about your services.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="contact-page">
      <h2>Contact Us</h2>
      <p>We'd love to hear from you. Here's how you can reach us:</p>

      <div className="contact-card">
        <h3>{BUSINESS_NAME}</h3>
        <p className="contact-info-item">
          <strong>Address:</strong> {BUSINESS_ADDRESS}
        </p>
        <p className="contact-info-item">
          <strong>Phone:</strong> {BUSINESS_PHONE}
        </p>
        <p className="contact-info-item">
          <strong>Email:</strong> {BUSINESS_EMAIL}
        </p>
      </div>

      <button 
        className="whatsapp-button"
        onClick={handleGeneralInquiry}
      >
        Send a General Inquiry on WhatsApp
      </button>
    </div>
  );
}