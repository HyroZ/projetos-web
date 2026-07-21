import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Heart, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { useProduct } from '@/hooks/useProduct';
import { useSEO } from '@/hooks/useSEO';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { ProductImage } from '@/components/product/ProductImage';
import { ProductCard } from '@/components/product/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/Rating';
import { QuantitySelector } from '@/components/ui/quantitySelector';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils/formatCurrency';
import { cn } from '@/utils/cn';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = id ? Number(id) : undefined;
  const { product, relatedProducts, isLoading, notFound } = useProduct(productId);
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [justAdded, setJustAdded] = useState(false);

  useSEO(product?.name ?? 'Produto', product?.description);

  if (notFound) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">Produto não encontrado</h1>
        <p className="text-ink/60">Esse item pode ter saído do cardápio. Que tal ver outras opções?</p>
        <Button onClick={() => navigate('/cardapio')}>Voltar ao cardápio</Button>
      </div>
    );
  }

  if (isLoading || !product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-xl2" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>
    );
  }

  const favorite = isFavorite(product.id);

  function handleAdd() {
    if (!product || !product.available) return;
    addItem(product, quantity, notes || undefined);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Link
        to="/cardapio"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/60 transition hover:text-ink"
      >
        <ChevronLeft size={16} /> Voltar ao cardápio
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="relative aspect-square overflow-hidden rounded-xl2 bg-paper-dim"
        >
          <ProductImage src={product.image} alt={product.name} className="h-full w-full" priority />
          <div className="absolute left-4 top-4 flex flex-col gap-1.5">
            {product.promotion && <Badge tone="orange">Promoção</Badge>}
            {!product.available && <Badge tone="ink">Indisponível</Badge>}
          </div>
          <button
            onClick={() => toggleFavorite(product.id, product.name)}
            aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            aria-pressed={favorite}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-paper/90 shadow-soft backdrop-blur transition hover:scale-110"
          >
            <Heart size={19} className={cn(favorite ? 'fill-brand-orange text-brand-orange' : 'text-ink/50')} />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="flex flex-col"
        >
          <span className="font-mono text-xs font-bold uppercase tracking-wide text-brand-greenDark">
            {product.category}
          </span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">{product.name}</h1>
          <div className="mt-3">
            <Rating value={product.rating} />
          </div>
          <p className="mt-4 text-ink/65">{product.description}</p>

          <div className="mt-5">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-ink/50">Ingredientes</h2>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map((ingredient) => (
                <span
                  key={ingredient}
                  className="rounded-full bg-paper-dim px-3 py-1.5 text-sm text-ink/70"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-ink/50">
            <ShieldCheck size={16} className="text-brand-greenDark" />
            Preparado na hora do seu pedido
          </div>

          <div className="mt-6 flex flex-col gap-1.5">
            <label htmlFor="product-notes" className="text-sm font-semibold text-ink/75">
              Alguma observação?
            </label>
            <input
              id="product-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: sem cebola, bem passado..."
              className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-ink placeholder:text-ink/35 focus:border-brand-greenDark focus:outline-none focus:ring-4 focus:ring-brand-green/20"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-6">
            <span className="font-mono text-3xl font-bold text-ink">{formatCurrency(product.price)}</span>
            <QuantitySelector value={quantity} onChange={setQuantity} />
          </div>

          <Button
            size="lg"
            fullWidth
            className="mt-5"
            disabled={!product.available}
            onClick={handleAdd}
            icon={justAdded ? <Check size={18} /> : <Sparkles size={18} />}
          >
            {!product.available
              ? 'Produto indisponível'
              : justAdded
                ? 'Adicionado à comanda!'
                : `Adicionar — ${formatCurrency(product.price * quantity)}`}
          </Button>
        </motion.div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16 border-t border-ink/10 pt-10">
          <h2 className="mb-6 font-display text-2xl font-semibold text-ink">Combina com</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((related, i) => (
              <ProductCard key={related.id} product={related} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}