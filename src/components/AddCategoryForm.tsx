import { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import ImageUpload from './ImageUpload';
import { type Category } from '../types';

// Define the props interface including initialCategory
interface AddCategoryFormProps {
  onSuccess: () => void;
  initialCategory?: Category | null; 
}

export default function AddCategoryForm({ onSuccess, initialCategory }: AddCategoryFormProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data if editing
  useEffect(() => {
    if (initialCategory) {
      setName(initialCategory.name);
      setSlug(initialCategory.slug);
      setImageUrl(initialCategory.imageUrl || '');
    } else {
      setName('');
      setSlug('');
      setImageUrl('');
    }
  }, [initialCategory]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!initialCategory) {
      setSlug(val.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl) {
      alert('Please upload a category image.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (initialCategory) {
        // Edit Mode
        const categoryRef = doc(db, 'categories', initialCategory.id);
        await updateDoc(categoryRef, {
          name,
          slug,
          imageUrl,
          updatedAt: new Date()
        });
        alert('Category updated successfully!');
      } else {
        // Create Mode
        await addDoc(collection(db, 'categories'), {
          name,
          slug,
          imageUrl,
          itemCount: 0,
          createdAt: new Date()
        });
        alert('Category added successfully!');
      }

      setName('');
      setSlug('');
      setImageUrl('');
      onSuccess();

    } catch (error) {
      console.error("Error saving category: ", error);
      alert("Failed to save category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-lg">
      <h2 className="text-xl font-semibold text-gray-800">
        {initialCategory ? 'Edit Category' : 'Add New Category'}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
        {imageUrl ? (
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden group">
            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button type="button" onClick={() => setImageUrl('')} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">Remove Image</button>
            </div>
          </div>
        ) : (
          <ImageUpload onUpload={setImageUrl} />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
        <input type="text" value={name} onChange={handleNameChange} placeholder="e.g. Wedding Bouquets" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL Identifier)</label>
        <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-600 focus:outline-none" />
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full bg-teal-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 hover:bg-teal-700 disabled:opacity-50">
        {isSubmitting ? 'Saving...' : (initialCategory ? 'Update Category' : 'Add Category')}
      </button>
    </form>
  );
}