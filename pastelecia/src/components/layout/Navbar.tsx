import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, Sandwich } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/utils/cn';

const NAV_LINKS = [
  { to: '/', label: 'Início' },
  { to: '/cardapio', label: 'Cardápio' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, toggleCart } = useCart();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-30 transition-all duration-300',
        scrolled ? 'bg-paper/90 shadow-soft backdrop-blur-md' : 'bg-paper/0',
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label="Navegação principal">
        <Link to="/" className="flex items-center gap-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-green/30 rounded-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-green to-brand-orange">
            <Sandwich size={18} className="text-ink" strokeWidth={2} />
          </span>
          <span className="font-display text-xl font-bold text-ink">Pastelecia</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'font-body font-semibold text-ink/70 transition hover:text-ink',
                  isActive && 'text-ink',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleCart}
            aria-label={`Abrir comanda, ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`}
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper transition hover:bg-ink/85 active:scale-95"
          >
            <ShoppingBag size={19} />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-orange px-1 font-mono text-[0.65rem] font-bold text-ink"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:bg-ink/8 md:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-ink/8 bg-paper md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'rounded-lg px-3 py-2.5 font-body font-semibold text-ink/70 transition hover:bg-ink/5',
                      isActive && 'bg-ink/5 text-ink',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}