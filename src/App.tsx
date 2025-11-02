import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Homepage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import ContactPage from "./pages/ContactPage";
import AdminPanelPage from "./pages/AdminPanelPage";


function App(){
  return(
    <div className="app-container">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Homepage/>}/>
          <Route path="/shop" element={<ShopPage/>}/>
          <Route path="/shop/:slug" element={<ShopPage/>}/>
          <Route path="/product/:id" element={<ProductDetailPage/>}/>
          <Route path="/favorites" element={<FavoritesPage/>}/>
          <Route path="/contact" element={<ContactPage/>}/>

          
          <Route path="/admin" element={<AdminPanelPage />} />
        </Routes>
      </main>
    </div>
    
  )
}

export default App;
