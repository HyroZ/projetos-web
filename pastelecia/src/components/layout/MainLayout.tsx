import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/footer';
import { WhatsAppFloatButton } from '@/components/layout/WhatsappFloatButton';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export function MainLayout() {
  useScrollToTop();

  return (
    <div className="flex min-h-screen flex-col bg-paper font-body text-ink antialiased">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloatButton />
      <CartDrawer />
    </div>
  );
}