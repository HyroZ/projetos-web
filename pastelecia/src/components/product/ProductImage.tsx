import { useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Renderiza a imagem do produto vinda do JSON. Caso o arquivo ainda não
 * exista em /public/images (comum durante o desenvolvimento, antes das
 * fotos reais serem adicionadas), cai graciosamente para um placeholder
 * de marca — nunca um ícone quebrado de imagem.
 */
export function ProductImage({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gradient-to-br from-brand-yellow/40 via-brand-green/30 to-brand-orange/30',
          className,
        )}
        role="img"
        aria-label={alt}
      >
        <UtensilsCrossed className="h-10 w-10 text-ink/25" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={cn('object-cover', className)}
    />
  );
}