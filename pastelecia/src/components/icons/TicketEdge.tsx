import { cn } from '@/utils/cn';

/**
 * Borda serrilhada de "comanda" (ticket de pedido) — o elemento de
 * assinatura visual do site: cada superfície de pedido (carrinho, resumo,
 * confirmação) é desenhada como se fosse uma nota de pedido de verdade.
 */
export function TicketEdge({
  flip = false,
  className,
  color = 'currentColor',
}: {
  flip?: boolean;
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 240 16"
      preserveAspectRatio="none"
      className={cn('h-4 w-full', flip && 'rotate-180', className)}
      aria-hidden="true"
    >
      <path
        d="M0 16 L0 6 L10 14 L20 4 L30 14 L40 4 L50 14 L60 4 L70 14 L80 4 L90 14 L100 4 L110 14 L120 4 L130 14 L140 4 L150 14 L160 4 L170 14 L180 4 L190 14 L200 4 L210 14 L220 4 L230 14 L240 6 L240 16 Z"
        fill={color}
      />
    </svg>
  );
}