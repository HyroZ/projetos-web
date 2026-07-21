import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { CartItemRow } from '@/components/cart/CartItemRow';
import { CouponInput } from '@/components/cart/CouponInput';
import { TicketEdge } from '@/components/icons/TicketEdge';
import { PerforatedDivider } from '@/components/icons/PerforatedDivider';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency } from '@/utils/formatCurrency';

export function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, discount, total, itemCount } = useCart();
  const navigate = useNavigate();

  function handleCheckout() {
    closeCart();
    navigate('/finalizar');
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label="Sua comanda"
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-paper shadow-ticket"
          >
            {/* Cabeçalho estilo comanda */}
            <div className="bg-ink px-6 pb-5 pt-6 text-paper">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} className="text-brand-yellow" />
                  <div>
                    <h2 className="font-display text-xl font-semibold">Sua Comanda</h2>
                    <p className="font-mono text-xs text-paper/60">
                      {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeCart}
                  aria-label="Fechar comanda"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-paper/10 transition hover:bg-paper/20"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <TicketEdge className="text-paper" color="currentColor" />

            <div className="flex-1 overflow-y-auto px-6">
              {items.length === 0 ? (
                <div className="pt-8">
                  <EmptyState
                    icon={<ShoppingBag size={24} />}
                    title="Sua comanda está vazia"
                    description="Adicione pastéis, hambúrgueres ou um caldo de cana geladinho para começar."
                    action={
                      <Button variant="dark" size="sm" onClick={closeCart}>
                        Ver cardápio
                      </Button>
                    }
                  />
                </div>
              ) : (
                <div className="divide-y divide-ink/8">
                  {items.map((item) => (
                    <CartItemRow key={item.product.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="space-y-4 border-t border-ink/10 bg-paper-dim px-6 pb-6 pt-5">
                <CouponInput />

                <PerforatedDivider className="mx-6" />

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-sm text-ink/60">
                    <span>Subtotal</span>
                    <span className="font-mono">{formatCurrency(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-sm text-brand-greenDark">
                      <span>Desconto</span>
                      <span className="font-mono">-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1 font-display text-lg font-bold text-ink">
                    <span>Total</span>
                    <span className="font-mono">{formatCurrency(total)}</span>
                  </div>
                </div>

                <Button fullWidth size="lg" onClick={handleCheckout}>
                  Finalizar Pedido
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}