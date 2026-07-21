import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Plus, Check } from 'lucide-react';
import type { Product } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { ProductImage } from '@/components/product/ProductImage';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/Rating';
import { cn } from '@/utils/cn';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [justAdded, setJustAdded] = useState(false);
  const favorite = isFavorite(product.id);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!product.available) return;
    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  function handleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id, product.name);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl2 border border-ink/10 bg-paper shadow-soft transition-shadow hover:shadow-ticket"
    >
      <Link
        to={`/produto/${product.id}`}
        className="flex h-full flex-col focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-green/40"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-dim">
          <ProductImage
            src={product.image}
            alt={product.name}
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.promotion && <Badge tone="orange">Promoção</Badge>}
            {!product.available && <Badge tone="ink">Indisponível</Badge>}
          </div>
          <button
            onClick={handleFavorite}
            aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            aria-pressed={favorite}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-ink shadow-soft backdrop-blur transition hover:scale-110 active:scale-95"
          >
            <Heart
              size={17}
              className={cn('transition-colors', favorite ? 'fill-brand-orange text-brand-orange' : 'text-ink/50')}
            />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[0.7rem] font-bold uppercase tracking-wide text-brand-greenDark">
              {product.category}
            </span>
            <Rating value={product.rating} />
          </div>
          <h3 className="font-display text-lg font-semibold leading-snug text-ink">{product.name}</h3>
          <p className="line-clamp-2 text-sm text-ink/60">{product.description}</p>

          <div className="mt-auto flex items-center justify-between pt-3">
            <span className="font-mono text-lg font-bold text-ink">{formatCurrency(product.price)}</span>
            <button
              onClick={handleAdd}
              disabled={!product.available}
              aria-label={`Adicionar ${product.name} ao carrinho`}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full transition-all active:scale-90',
                'disabled:cursor-not-allowed disabled:bg-ink/10 disabled:text-ink/30',
                justAdded ? 'bg-brand-greenDark text-paper' : 'bg-brand-green text-ink hover:bg-brand-greenDark hover:text-paper',
              )}
            >
              {justAdded ? <Check size={18} /> : <Plus size={18} />}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}