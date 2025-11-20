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
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl) {
      alert('Please upload an image first.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // 1. Add product to Firestore
      await addDoc(collection(db, 'products'), {
        name,
        price: Number(price),
        description,
        categorySlug,
        images: [imageUrl], // Store as an array
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
      setImageUrl('');
      
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
        
        {/* LOGIC: If we have an image URL, show the image and a remove button.
                   If NOT, show the upload component. */}
        {imageUrl ? (
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden group">
            <img 
              src={imageUrl} 
              alt="Preview" 
              className="w-full h-full object-contain"
            />
            {/* Overlay with Remove Button */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
              >
                Remove Image
              </button>
            </div>
          </div>
        ) : (
          <ImageUpload onUpload={setImageUrl} />
        )}
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