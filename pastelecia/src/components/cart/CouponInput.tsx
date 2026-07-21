import { useState, type FormEvent } from 'react';
import { Tag, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export function CouponInput() {
  const { coupon, couponError, applyCoupon, removeCoupon } = useCart();
  const [value, setValue] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    applyCoupon(value);
    setValue('');
  }

  if (coupon) {
    return (
      <div className="flex items-center justify-between rounded-xl bg-brand-green/15 px-3.5 py-2.5">
        <div className="flex items-center gap-2 text-sm font-semibold text-brand-greenDark">
          <Tag size={15} />
          Cupom {coupon.code} aplicado (-{coupon.discountPercent}%)
        </div>
        <button
          onClick={removeCoupon}
          aria-label="Remover cupom"
          className="text-ink/40 hover:text-ink"
        >
          <X size={15} />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" size={15} />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Cupom de desconto"
            className="w-full rounded-xl border border-ink/15 bg-paper py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink/40 focus:border-brand-greenDark focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-ink px-4 text-sm font-semibold text-paper transition hover:bg-ink/85"
        >
          Aplicar
        </button>
      </div>
      {couponError && <span className="text-xs font-medium text-red-500">{couponError}</span>}
    </form>
  );
}