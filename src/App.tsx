import { Routes, Route, useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import ContactPage from './pages/ContactPage';
import AdminPanelPage from './pages/AdminPanelPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

import Footer from './components/Footer.tsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    // Synchronous scroll reset before browser paint — works reliably on mobile
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0; // Safari fallback
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#fffdf9' }}>
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:slug" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route index element={<AdminPanelPage />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}