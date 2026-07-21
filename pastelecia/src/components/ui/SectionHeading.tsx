
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' ? 'items-center text-center' : 'items-start text-left sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div>
        {eyebrow && (
          <span className="mb-2 inline-block font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-greenDark">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          {title}
        </h2>
        {description && <p className="mt-2 max-w-xl text-ink/60">{description}</p>}
      </div>
      {action}
    </div>
  );
}