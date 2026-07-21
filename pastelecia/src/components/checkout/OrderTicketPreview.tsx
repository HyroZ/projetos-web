import { motion } from 'framer-motion';
import type { CartItem, CheckoutData } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { TicketEdge } from '@/components/icons/TicketEdge';
import { PerforatedDivider } from '@/components/icons/PerforatedDivider';

/**
 * Pré-visualização do pedido no formato de comanda impressa — a mesma
 * informação que será enviada ao WhatsApp, mas exibida de um jeito que o
 * cliente reconhece: como a notinha que sai na cozinha.
 */
export function OrderTicketPreview({
  items,
  checkout,
  subtotal,
  discount,
  total,
}: {
  items: CartItem[];
  checkout: CheckoutData;
  subtotal: number;
  discount: number;
  total: number;
}) {
  const now = new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, rotate: -0.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto w-full max-w-sm"
    >
      <div className="overflow-hidden rounded-sm bg-paper shadow-ticket">
        <TicketEdge color="#FFFCF5" className="text-paper" />
        <div className="bg-paper px-6 py-5 font-mono text-ink">
          <div className="text-center">
            <p className="font-display text-lg font-bold tracking-tight">PASTELECIA</p>
            <p className="text-[0.65rem] uppercase tracking-widest text-ink/50">
              Comanda de Pedido
            </p>
            <p className="mt-1 text-[0.65rem] text-ink/40">
              {now.toLocaleDateString('pt-BR')} às {now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <PerforatedDivider className="my-4" />

          <div className="space-y-1 text-xs">
            <p className="font-bold uppercase tracking-wide text-ink/50">Cliente</p>
            <p>{checkout.name || '—'}</p>
            <p className="text-ink/60">{checkout.phone}</p>
          </div>

          <PerforatedDivider className="my-4" />

          <div className="space-y-2 text-xs">
            <p className="font-bold uppercase tracking-wide text-ink/50">Itens</p>
            {items.map((item) => (
              <div key={item.product.id}>
                <div className="flex justify-between gap-2">
                  <span>
                    {item.quantity}x {item.product.name}
                  </span>
                  <span>{formatCurrency(item.product.price * item.quantity)}</span>
                </div>
                {item.notes && <p className="pl-3 text-[0.7rem] italic text-ink/45">obs: {item.notes}</p>}
              </div>
            ))}
          </div>

          <PerforatedDivider className="my-4" />

          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-brand-greenDark">
                <span>Desconto</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-1 text-sm font-bold">
              <span>TOTAL</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <PerforatedDivider className="my-4" />

          <div className="space-y-1 text-xs">
            <p className="font-bold uppercase tracking-wide text-ink/50">Pagamento</p>
            <p>{checkout.paymentMethod || '—'}</p>
            {checkout.paymentMethod === 'Dinheiro' && checkout.changeFor && (
              <p className="text-ink/60">Troco para R$ {checkout.changeFor}</p>
            )}
          </div>

          <div className="mt-4 space-y-1 text-xs">
            <p className="font-bold uppercase tracking-wide text-ink/50">Entrega</p>
            <p>
              {checkout.address}, {checkout.number}
              {checkout.complement ? ` — ${checkout.complement}` : ''}
            </p>
          </div>

          {checkout.notes && (
            <div className="mt-4 space-y-1 text-xs">
              <p className="font-bold uppercase tracking-wide text-ink/50">Observações</p>
              <p className="text-ink/70">{checkout.notes}</p>
            </div>
          )}

          <p className="mt-5 text-center text-[0.65rem] uppercase tracking-widest text-ink/30">
            Obrigado pela preferência!
          </p>
        </div>
        <TicketEdge flip color="#FFFCF5" className="text-paper" />
      </div>
    </motion.div>
  );
}