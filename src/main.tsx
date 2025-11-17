import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'

import './index.css'
import App from './App.tsx'

import { FavoritesProvider } from './context/FavoritesContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx' // <-- NEW

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. Wrap your entire App in the Router */}
    <BrowserRouter>
    <AuthProvider>
 <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
