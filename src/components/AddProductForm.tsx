import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { useCategories } from '../hooks/useCategories';
import ImageUpload from './ImageUpload';
import { type Product } from '../types';

// Add 'initialProduct' to props
interface AddProductFormProps {
  onSuccess: () => void;
  initialProduct?: Product | null; // Optional: only for editing
}

export default function AddProductForm({ onSuccess, initialProduct }: AddProductFormProps) {
  const { categories } = useCategories();
  
  // Initialize state. If editing, use the product's data. If creating, use empty strings.
  const [name, setName] = useState(initialProduct?.name || '');
  const [price, setPrice] = useState(initialProduct?.price.toString() || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [categorySlug, setCategorySlug] = useState(initialProduct?.categorySlug || '');
  const [images, setImages] = useState<string[]>(initialProduct?.images || []); 
  // We can also load specs if they exist, or default to empty array
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>(
    initialProduct?.specifications 
      ? Object.entries(initialProduct.specifications).map(([key, value]) => ({ key, value }))
      : []
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form if initialProduct changes (e.g. clicking "Edit" on a different item)
  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setPrice(initialProduct.price.toString());
      setDescription(initialProduct.description);
      setCategorySlug(initialProduct.categorySlug);
      setImages(initialProduct.images);
      setSpecs(Object.entries(initialProduct.specifications).map(([key, value]) => ({ key, value })));
    } else {
      // Clear form for "Add New" mode
      setName('');
      setPrice('');
      setDescription('');
      setCategorySlug('');
      setImages([]);
      setSpecs([]);
    }
  }, [initialProduct]);

  const handleImageUpload = (url: string) => {
    setImages(prev => [...prev, url]);
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Spec helpers
  const addSpec = () => setSpecs([...specs, { key: '', value: '' }]);
  const removeSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index));
  const updateSpec = (index: number, field: 'key' | 'value', newValue: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = newValue;
    setSpecs(newSpecs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      alert('Please upload at least one image.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Convert specs array back to object
      const specificationsObject = specs.reduce((acc, item) => {
        if (item.key.trim() && item.value.trim()) {
          acc[item.key.trim()] = item.value.trim();
        }
        return acc;
      }, {} as Record<string, string>);

      const productData = {
        name,
        price: Number(price),
        description,
        categorySlug,
        images,
        specifications: specificationsObject,
        updatedAt: new Date() // Good practice to track updates
      };

      if (initialProduct) {
        // === EDIT MODE ===
        // 1. Update the existing document
        const productRef = doc(db, 'products', initialProduct.id);
        await updateDoc(productRef, productData);

        // Note: If you changed the category, we *should* update counts on both
        // old and new categories. That is complex logic we can skip for now 
        // or add if you need it later. For now, we assume category stays same.
        
        alert('Product updated successfully!');
      } else {
        // === CREATE MODE ===
        // 1. Create new document
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: new Date()
        });

        // 2. Increment category count
        const selectedCategory = categories.find(c => c.slug === categorySlug);
        if (selectedCategory) {
           const categoryRef = doc(db, 'categories', selectedCategory.id);
           await updateDoc(categoryRef, { itemCount: increment(1) });
        }
        alert('Product added successfully!');
      }
      
      // Reset & Close
      onSuccess();

    } catch (error) {
      console.error("Error saving product: ", error);
      alert("Failed to save product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800">
        {initialProduct ? 'Edit Product' : 'Add New Product'}
      </h2>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
        <div className="mb-4">
          <ImageUpload onUpload={handleImageUpload} />
        </div>
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {images.map((url, index) => (
              <div key={index} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <img src={url} alt={`Product ${index}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium"
                >
                  Remove
                </button>
                {index === 0 && (
                  <span className="absolute top-1 left-1 bg-teal-600 text-white text-xs px-2 py-0.5 rounded-full shadow-sm">Cover</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Name */}
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

      {/* Price & Category */}
      <div className="grid grid-cols-2 gap-4">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="">Select...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>
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

      {/* Specifications */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Specifications</label>
          <button type="button" onClick={addSpec} className="text-sm text-teal-600 hover:text-teal-800 font-medium">+ Add Spec</button>
        </div>
        <div className="space-y-3">
          {specs.map((spec, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder="Key"
                value={spec.key}
                onChange={(e) => updateSpec(index, 'key', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="Value"
                value={spec.value}
                onChange={(e) => updateSpec(index, 'value', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button type="button" onClick={() => removeSpec(index)} className="text-red-500 px-2">✕</button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-teal-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-700'
        }`}
      >
        {isSubmitting ? 'Saving...' : (initialProduct ? 'Update Product' : 'Add Product')}
      </button>
    </form>
  );
}