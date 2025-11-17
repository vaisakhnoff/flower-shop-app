import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import ContactPage from './pages/ContactPage';

// 1. Import our new components
import AdminPanelPage from './pages/AdminPanelPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:slug" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* 2. Add the new Login Page route */}
          <Route path="/login" element={<LoginPage />} />

          {/* 3. Add the Protected Admin Route
            This <Route> element wraps our Admin page.
            The `ProtectedRoute` will automatically check for a user.
            If they are logged in, it shows `AdminPanelPage`.
            If not, it redirects to `/login`.
          */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route index element={<AdminPanelPage />} />
            {/* We can add more admin-only routes here later, like /admin/orders */}
          </Route>

        </Routes>
      </main>
    </>
  );
}