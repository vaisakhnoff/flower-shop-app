import { useState } from 'react';
import { collection, addDoc, updateDoc, doc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { useCategories } from '../hooks/useCategories';
import ImageUpload from './ImageUpload';

export default function AddProductForm({ onSuccess }: { onSuccess: () => void }) {
  const { categories } = useCategories();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  
  // CHANGED: Now storing an ARRAY of strings for multiple images
  const [images, setImages] = useState<string[]>([]); 
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to add a new image to the list
  const handleImageUpload = (url: string) => {
    setImages(prev => [...prev, url]);
  };

  // Helper to remove an image by index
  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      alert('Please upload at least one image.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // 1. Add the new product to the 'products' collection
      await addDoc(collection(db, 'products'), {
        name,
        price: Number(price),
        description,
        categorySlug,
        images: images, // We save the whole array
        // We initialize with an empty object, no hardcoded "Local Farm" data
        specifications: {}, 
        createdAt: new Date()
      });

      // 2. Find the category document ID to update its itemCount
      const selectedCategory = categories.find(c => c.slug === categorySlug);
      
      if (selectedCategory) {
         const categoryRef = doc(db, 'categories', selectedCategory.id);
         // Atomically increment the itemCount by 1
         await updateDoc(categoryRef, {
            itemCount: increment(1)
         });
      }

      alert('Product added successfully!');
      
      // Reset form fields
      setName('');
      setPrice('');
      setDescription('');
      setCategorySlug('');
      setImages([]); // Clear the array
      
      // Notify the parent page that we are done
      onSuccess();

    } catch (error) {
      console.error("Error adding product: ", error);
      alert("Failed to add product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800">Add New Product</h2>

      {/* Image Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
        
        {/* 1. The Upload Component (Always visible now) */}
        <div className="mb-4">
          <ImageUpload onUpload={handleImageUpload} />
        </div>

        {/* 2. The Gallery of Uploaded Images */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {images.map((url, index) => (
              <div key={index} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <img 
                  src={url} 
                  alt={`Product ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                {/* Remove Button (appears on hover) */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium"
                >
                  Remove
                </button>
                {/* 'Cover' badge for the first image */}
                {index === 0 && (
                  <span className="absolute top-1 left-1 bg-teal-600 text-white text-xs px-2 py-0.5 rounded-full shadow-sm">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Upload as many images as you like. The first image will be the main cover.
        </p>
      </div>

      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={categorySlug}
          onChange={(e) => setCategorySlug(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
        >
          <option value="">Select a category</option>
          {/* We map through existing categories to create the dropdown */}
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-teal-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-700'
        }`}
      >
        {isSubmitting ? 'Adding Product...' : 'Add Product'}
      </button>
    </form>
  );
}