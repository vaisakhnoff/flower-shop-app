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
    <div className="
      max-w-xl 
      mx-auto 
      p-4 sm:p-6 lg:p-8 
      flex flex-col items-center 
      text-center
    ">
      {/* max-w-xl: A bit narrower for a contact page
        mx-auto: Centers it
        p-4...: Responsive padding
        flex...: Centers all content in the div
      */}
      
      <h2 className="
        text-2xl sm:text-3xl 
        font-bold 
        text-gray-800 
        mb-2
      ">
        Contact Us
      </h2>
      <p className="text-base text-gray-600 mb-8">
        We'd love to hear from you. Here's how you can reach us:
      </p>

      {/* Contact Info Card */}
      <div className="
        w-full 
        bg-white 
        border border-gray-200 
        rounded-lg 
        shadow-sm 
        p-6 
        text-left 
        mb-6
      ">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {BUSINESS_NAME}
        </h3>
        
        <div className="space-y-3">
          {/* space-y-3: Adds vertical space between children */}
          <p className="text-sm text-gray-700">
            <strong className="text-gray-900">Address:</strong> {BUSINESS_ADDRESS}
          </p>
          <p className="text-sm text-gray-700">
            <strong className="text-gray-900">Phone:</strong> {BUSINESS_PHONE}
          </p>
          <p className="text-sm text-gray-700">
            <strong className="text-gray-900">Email:</strong> {BUSINESS_EMAIL}
          </p>
        </div>
      </div>

      {/* WhatsApp Button */}
      <button 
        className="
          w-full 
          bg-green-500 hover:bg-green-600 
          text-white 
          font-bold 
          py-3 px-6 
          rounded-lg 
          transition duration-200
        "
        onClick={handleGeneralInquiry}
      >
        Send a General Inquiry on WhatsApp
      </button>
    </div>
  );
}