import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from '@/contexts/ToastContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { CartProvider } from '@/contexts/CartContext';
import { MainLayout } from '@/layouts/MainLayout';
import { Home } from '@/pages/Home';
import { Menu } from '@/pages/Menu';
import { ProductDetail } from '@/pages/ProductDetail';
import { Checkout } from '@/pages/Checkout';
import { NotFound } from '@/pages/NotFound';

// A ordem dos providers importa: Toast é a base (Cart e Favorites disparam
// toasts), por isso envolve os demais.
export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <FavoritesProvider>
          <CartProvider>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/cardapio" element={<Menu />} />
                <Route path="/produto/:id" element={<ProductDetail />} />
                <Route path="/finalizar" element={<Checkout />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </CartProvider>
        </FavoritesProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}