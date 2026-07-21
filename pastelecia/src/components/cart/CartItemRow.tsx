import { useState } from 'react';
import { Trash2, MessageSquarePlus } from 'lucide-react';
import type { CartItem } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { useCart } from '@/contexts/CartContext';
import { ProductImage } from '@/components/product/ProductImage';
import { QuantitySelector } from '@/components/ui/quantitySelector';

export function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem, updateNotes } = useCart();
  const [showNotes, setShowNotes] = useState(Boolean(item.notes));

  return (
    <div className="flex gap-3 py-4">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-paper-dim">
        <ProductImage src={item.product.image} alt={item.product.name} className="h-full w-full" />
      </div>

      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-display text-[0.95rem] font-semibold leading-tight text-ink">
            {item.product.name}
          </h4>
          <button
            onClick={() => removeItem(item.product.id)}
            aria-label={`Remover ${item.product.name} da comanda`}
            className="shrink-0 text-ink/35 transition hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <span className="font-mono text-sm font-bold text-ink/80">
          {formatCurrency(item.product.price)}
        </span>

        <div className="mt-1 flex items-center justify-between gap-2">
          <QuantitySelector
            size="sm"
            value={item.quantity}
            onChange={(qty) => updateQuantity(item.product.id, qty)}
          />
          {!showNotes && (
            <button
              onClick={() => setShowNotes(true)}
              className="flex items-center gap-1 text-xs font-semibold text-ink/45 hover:text-brand-greenDark"
            >
              <MessageSquarePlus size={13} /> Observação
            </button>
          )}
        </div>

        {showNotes && (
          <input
            type="text"
            value={item.notes ?? ''}
            onChange={(e) => updateNotes(item.product.id, e.target.value)}
            placeholder="Ex: sem cebola, ponto da carne..."
            className="mt-1 w-full rounded-lg border border-ink/15 bg-paper px-2.5 py-1.5 text-xs text-ink placeholder:text-ink/35 focus:border-brand-greenDark focus:outline-none"
          />
        )}
      </div>
    </div>
  );
}