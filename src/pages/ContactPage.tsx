import { useLanguage } from '../context/LanguageContext';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

const BUSINESS_NAME = "Shanmughan , Anjali Flowers";
const BUSINESS_EMAIL = "anjaliflowerworks@gmail.com";
const BUSINESS_PHONE = "+91 9388121197";

export default function ContactPage() {
  const { t } = useLanguage();

  const handleGeneralInquiry = () => {
    if (!WHATSAPP_NUMBER) {
      console.error("VITE_WHATSAPP_NUMBER is not defined in your .env.local file.");
      alert("Sorry, the contact feature is not set up correctly.");
      return;
    }

    const message = `Hi, നിങ്ങളുടെ സേവനങ്ങളിൽ എന്തെല്ലാം ഉൾപ്പെടുന്നു ?.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">
            {t.contactUs}
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            {t.contactSubtitle}
          </p>
        </div>

        {/* Floating Contact Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-6 text-center">
            {BUSINESS_NAME}
          </h2>
          
          <div className="space-y-5">
            

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-xl">
                📞
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {t.phone}
                </p>
                <a 
                  href={`tel:${BUSINESS_PHONE}`}
                  className="text-sm md:text-base text-emerald-600 hover:text-emerald-700 transition-colors font-medium"
                >
                  {BUSINESS_PHONE}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-xl">
                ✉️
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {t.email}
                </p>
                <a 
                  href={`mailto:${BUSINESS_EMAIL}`}
                  className="text-sm md:text-base text-emerald-600 hover:text-emerald-700 transition-colors font-medium"
                >
                  {BUSINESS_EMAIL}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button - Full Width and Prominent */}
        <button 
          className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-base md:text-lg py-4 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-3"
          onClick={handleGeneralInquiry}
        >
          <svg 
            className="w-6 h-6" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          {t.sendInquiry}
        </button>
      </div>
    </div>
  );
}
