import { Minus, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 20,
  size = 'md',
}: QuantitySelectorProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-ink/15 bg-paper',
        size === 'sm' ? 'h-8' : 'h-11',
      )}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Diminuir quantidade"
        className={cn(
          'flex items-center justify-center rounded-full text-ink transition hover:bg-ink/8 disabled:opacity-30',
          size === 'sm' ? 'h-8 w-8' : 'h-11 w-11',
        )}
      >
        <Minus size={size === 'sm' ? 14 : 16} />
      </button>

      <span
        className={cn(
          'select-none text-center font-mono font-bold tabular-nums text-ink',
          size === 'sm' ? 'w-6 text-sm' : 'w-8 text-base',
        )}
        aria-live="polite"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Aumentar quantidade"
        className={cn(
          'flex items-center justify-center rounded-full text-ink transition hover:bg-ink/8 disabled:opacity-30',
          size === 'sm' ? 'h-8 w-8' : 'h-11 w-11',
        )}
      >
        <Plus size={size === 'sm' ? 14 : 16} />
      </button>
    </div>
  );
}