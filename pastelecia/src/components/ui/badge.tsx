import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Tone = 'green' | 'orange' | 'yellow' | 'ink' | 'outline';

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

export function Badge({
  children,
  tone = 'green',
  className,
}: BadgeProps) {
  const toneClasses: Record<Tone, string> = {
    green: 'bg-brand-green text-ink',
    orange: 'bg-brand-orange text-ink',
    yellow: 'bg-brand-yellow text-ink',
    ink: 'bg-ink text-paper',
    outline: 'border border-ink/20 text-ink/80',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide',
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}