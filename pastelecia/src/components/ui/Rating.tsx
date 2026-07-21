import { Star } from 'lucide-react';

export function Rating({ value, className }: { value: number; className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className ?? ''}`} aria-label={`Avaliação ${value.toFixed(1)} de 5`}>
      <Star size={14} className="fill-brand-yellow text-brand-yellow" />
      <span className="font-mono text-xs font-bold text-ink/80">{value.toFixed(1)}</span>
    </div>
  );
}