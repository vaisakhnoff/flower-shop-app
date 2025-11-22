import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, deleteDoc, updateDoc, increment } from 'firebase/firestore';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import AddProductForm from '../components/AddProductForm';
import AddCategoryForm from '../components/AddCategoryForm';
import { type Product, type Category } from '../types';

export default function AdminPanelPage() {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  // Fetch data with pagination support
  const { 
    products, 
    isLoading: productsLoading, 
    hasMore: productsHasMore, 
    loadMore: loadMoreProducts 
  } = useProducts(undefined);
  
  const { categories, isLoading: categoriesLoading } = useCategories();

  const handleProductFormClose = () => {
    setShowAddProduct(false);
    setProductToEdit(null);
    window.location.reload(); 
  };

  const handleCategoryFormClose = () => {
    setShowAddCategory(false);
    setCategoryToEdit(null);
    window.location.reload();
  };

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setShowAddProduct(true);
  };

  const handleEditCategory = (category: Category) => {
    setCategoryToEdit(category);
    setShowAddCategory(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) return;
    try {
      await deleteDoc(doc(db, 'products', product.id));
      const productCategory = categories.find(c => c.slug === product.categorySlug);
      if (productCategory) {
        await updateDoc(doc(db, 'categories', productCategory.id), { itemCount: increment(-1) });
      }
      alert('Product deleted.');
      window.location.reload();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (category.itemCount > 0) {
      if (!window.confirm(`Warning: This category contains ${category.itemCount} products. Continue?`)) return;
    } else {
      if (!window.confirm(`Delete category "${category.name}"?`)) return;
    }
    try {
      await deleteDoc(doc(db, 'categories', category.id));
      alert('Category deleted.');
      window.location.reload();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category.");
    }
  };

  const switchTab = (tab: 'products' | 'categories') => {
    setActiveTab(tab);
    setShowAddProduct(false);
    setShowAddCategory(false);
    setProductToEdit(null);
    setCategoryToEdit(null);
  };

  const handleLogout = async () => {
    if (window.confirm('Logout?')) {
      await signOut(auth);
      navigate('/');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <button onClick={handleLogout} className="text-sm font-medium text-red-600 hover:text-red-800 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">Logout</button>
      </div>

      <div className="flex border-b border-gray-200 mb-8">
        <button className={`py-3 px-6 font-medium text-sm transition-colors border-b-2 ${activeTab === 'products' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`} onClick={() => switchTab('products')}>Products</button>
        <button className={`py-3 px-6 font-medium text-sm transition-colors border-b-2 ${activeTab === 'categories' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`} onClick={() => switchTab('categories')}>Categories</button>
      </div>

      {activeTab === 'products' && (
        <div>
          {!showAddProduct ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Product List</h2>
                <button onClick={() => { setProductToEdit(null); setShowAddProduct(true); }} className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">+ Add New Product</button>
              </div>

              <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                      <tr>
                        <th className="p-4">Image</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Category</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            {product.images && product.images[0] && <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded" />}
                          </td>
                          <td className="p-4 font-medium text-gray-900">{product.name}</td>
                          <td className="p-4">₹{product.price.toLocaleString('en-IN')}</td>
                          <td className="p-4 text-gray-500">{product.categorySlug}</td>
                          <td className="p-4 text-right space-x-2">
                            <button onClick={() => handleEditProduct(product)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                            <button onClick={() => handleDeleteProduct(product)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination Button for Admin */}
                {productsHasMore && (
                  <div className="p-4 text-center border-t border-gray-200">
                    <button onClick={loadMoreProducts} disabled={productsLoading} className="text-teal-600 hover:text-teal-800 font-medium text-sm disabled:opacity-50">
                      {productsLoading ? 'Loading...' : 'Load More Products'}
                    </button>
                  </div>
                )}
                
                {products.length === 0 && !productsLoading && <div className="p-8 text-center text-gray-500">No products found.</div>}
              </div>
            </>
          ) : (
            <div>
              <button onClick={() => { setShowAddProduct(false); setProductToEdit(null); }} className="mb-4 text-gray-600 hover:text-gray-800 flex items-center">← Back to List</button>
              <AddProductForm onSuccess={handleProductFormClose} initialProduct={productToEdit} />
            </div>
          )}
        </div>
      )}

      {activeTab === 'categories' && (
        <div>
          {!showAddCategory ? (
             <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Category List</h2>
                <button onClick={() => { setCategoryToEdit(null); setShowAddCategory(true); }} className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">+ Add New Category</button>
              </div>

              <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="p-4">Image</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Slug</th>
                      <th className="p-4">Item Count</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          {category.imageUrl && <img src={category.imageUrl} alt={category.name} className="w-12 h-12 object-cover rounded" />}
                        </td>
                        <td className="p-4 font-medium text-gray-900">{category.name}</td>
                        <td className="p-4 text-gray-500">{category.slug}</td>
                        <td className="p-4"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{category.itemCount} items</span></td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => handleEditCategory(category)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                          <button onClick={() => handleDeleteCategory(category)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {categories.length === 0 && !categoriesLoading && <div className="p-8 text-center text-gray-500">No categories found.</div>}
              </div>
            </>
          ) : (
            <div>
              <button onClick={() => { setShowAddCategory(false); setCategoryToEdit(null); }} className="mb-4 text-gray-600 hover:text-gray-800 flex items-center">← Back to List</button>
              <AddCategoryForm onSuccess={handleCategoryFormClose} initialCategory={categoryToEdit} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}