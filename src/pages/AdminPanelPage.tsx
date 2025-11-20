import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
// Import our new form
import AddProductForm from '../components/AddProductForm';

export default function AdminPanelPage() {
  const navigate = useNavigate();
  // State to track which tab is active
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  
  // State to toggle the "Add Product" form
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  // Fetch data
  const { products, isLoading: productsLoading } = useProducts(undefined);
  const { categories, isLoading: categoriesLoading } = useCategories();

  // This runs when a product is successfully added
  const handleProductAdded = () => {
    setShowAddProduct(false); // Close the form
    // Reload page to see new data (simplest way to refresh for now)
    window.location.reload(); 
  };

  const handleCategoryAdded = () => {
    setShowAddCategory(false);
    window.location.reload();
  };

  const switchTab = (tab: 'products' | 'categories') => {
    setActiveTab(tab);
    setShowAddProduct(false);
    setShowAddCategory(false);
  };

  // Logout Function
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await signOut(auth);
        navigate('/');
      } catch (err) {
        console.error("Error signing out:", err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Section with Logout */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="text-sm font-medium text-red-600 hover:text-red-800 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`py-3 px-6 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'products'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => switchTab('products')}
        >
          Products
        </button>
        <button
          className={`py-3 px-6 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'categories'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => switchTab('categories')}
        >
          Categories
        </button>
      </div>

      {/* === PRODUCTS TAB === */}
      {activeTab === 'products' && (
        <div>
          {/* Toggle between List and Form */}
          {!showAddProduct ? (
            <>
              {/* Product List View */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Product List</h2>
                <button 
                  onClick={() => setShowAddProduct(true)}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  + Add New Product
                </button>
              </div>

              {productsLoading ? (
                <p>Loading products...</p>
              ) : (
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
                              {product.images && product.images[0] && (
                                <img 
                                  src={product.images[0]} 
                                  alt={product.name} 
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                            </td>
                            <td className="p-4 font-medium text-gray-900">{product.name}</td>
                            <td className="p-4">₹{product.price.toLocaleString('en-IN')}</td>
                            <td className="p-4 text-gray-500">{product.categorySlug}</td>
                            <td className="p-4 text-right space-x-2">
                              <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                              <button className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {products.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      No products found. Click "Add New Product" to start.
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Add Product Form View */
            <div>
              <button 
                onClick={() => setShowAddProduct(false)}
                className="mb-4 text-gray-600 hover:text-gray-800 flex items-center"
              >
                ← Back to List
              </button>
              {/* This is where our new form lives */}
              <AddProductForm onSuccess={handleProductAdded} />
            </div>
          )}
        </div>
      )}

      {/* === CATEGORIES TAB (Placeholder for now) === */}
      {activeTab === 'categories' && (
        <div>
           <p className="text-gray-500">Categories functionality coming next...</p>
        </div>
      )}
    </div>
  );
}