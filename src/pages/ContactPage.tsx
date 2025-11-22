import { useLanguage } from '../context/LanguageContext';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

const BUSINESS_NAME = "My Father's Flower Shop";
const BUSINESS_EMAIL = "info@myflowershop.com";
const BUSINESS_PHONE = "+91 12 3456 7890";
const BUSINESS_ADDRESS = "123 Flower Street, Your City, Kerala";

export default function ContactPage() {
  const { t } = useLanguage(); // Get the translation object

  const handleGeneralInquiry = () => {
    if (!WHATSAPP_NUMBER) {
      console.error("VITE_WHATSAPP_NUMBER is not defined in your .env.local file.");
      alert("Sorry, the contact feature is not set up correctly.");
      return;
    }

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
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
        {t.contactUs}
      </h2>
      <p className="text-base text-gray-600 mb-8">
        {t.contactSubtitle}
      </p>

      <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-left mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {BUSINESS_NAME}
        </h3>
        
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            <strong className="text-gray-900">{t.address}:</strong> {BUSINESS_ADDRESS}
          </p>
          <p className="text-sm text-gray-700">
            <strong className="text-gray-900">{t.phone}:</strong> {BUSINESS_PHONE}
          </p>
          <p className="text-sm text-gray-700">
            <strong className="text-gray-900">{t.email}:</strong> {BUSINESS_EMAIL}
          </p>
        </div>
      </div>

      <button 
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
        onClick={handleGeneralInquiry}
      >
        {t.sendInquiry}
      </button>
    </div>
  );
}