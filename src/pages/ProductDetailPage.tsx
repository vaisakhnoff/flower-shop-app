import { useParams } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
// We no longer need to import './ProductDetailPage.css'
import { useFavorites } from '../context/FavoritesContext';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading, error } = useProduct(id);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  // We can return early if the product isn't loaded yet
  if (isLoading) {
    return <div className="p-10 text-center text-lg">Loading product...</div>;
  }
  if (error) {
    return <div className="p-10 text-center text-lg text-red-600">Error: {error}</div>;
  }
  if (!product) {
    return <div className="p-10 text-center text-lg">Product not found.</div>;
  }

  // Once the product is loaded, we can use it
  const isAlreadyFavorite = isFavorite(product.id);

  const handleWhatsAppContact = () => {
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

  const handleFavoriteClick = () => {
    if (isAlreadyFavorite) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  return (
    <div className="
      max-w-6xl 
      mx-auto 
      p-4 
      md:grid md:grid-cols-2 md:gap-8 md:py-12
    ">
      {/* Mobile-first: default is single-column flex
        md:grid: On medium screens (tablets) and up, switch to a 2-column grid
        md:gap-8: Add a gap on medium screens
        md:py-12: Add more vertical padding on medium screens
      */}
      
      {/* 1. Image Gallery */}
      <div className="w-full mb-4 md:mb-0">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="
            w-full 
            aspect-square 
            object-cover 
            rounded-lg 
            shadow-md 
            bg-gray-100
          "
        />
        {/* We can add a thumbnail grid here later if product.images.length > 1 */}
      </div>

      {/* 2. Product Info */}
      <div className="flex flex-col">
        <h1 className="
          text-2xl 
          font-bold 
          text-gray-900 
          mb-2 
          md:text-4xl
        ">
          {product.name}
        </h1>
        
        <p className="text-2xl font-light text-gray-700 mb-4 md:text-3xl">
          ₹{product.price.toLocaleString('en-IN')}
        </p>
        
        <p className="text-base text-gray-600 leading-relaxed mb-6">
          {product.description}
        </p>
        
        <div className="border-t border-gray-200 pt-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Specifications
          </h3>
          <ul className="list-none p-0">
            {Object.entries(product.specifications).map(([key, value]) => (
              <li key={key} className="text-sm text-gray-600 mb-1 capitalize">
                <span className="font-medium text-gray-800">{key}:</span> {value}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Button Group */}
        <div className="
          flex flex-col 
          gap-3 
          w-full 
          md:flex-row md:items-center
        ">
          {/* Mobile-first: flex-col (stacked buttons)
            md:flex-row: On medium screens, switch to side-by-side
          */}
          <button 
            className="
              w-full md:w-auto flex-1 
              bg-green-500 hover:bg-green-600 
              text-white 
              font-bold 
              py-3 px-6 
              rounded-lg 
              transition duration-200
            "
            onClick={handleWhatsAppContact}
          >
            Contact on WhatsApp
          </button>
          
          <button 
            className={`
              w-full md:w-auto 
              font-bold 
              py-3 px-6 
              rounded-lg 
              transition duration-200 
              border-2
              ${isAlreadyFavorite 
                ? 'bg-yellow-100 border-yellow-400 text-yellow-800' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            `}
            onClick={handleFavoriteClick}
          >
            {isAlreadyFavorite ? 'Added to Favorites' : 'Add to Favorites'}
          </button>
        </div>
      </div>
    </div>
  );
}