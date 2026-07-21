import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { ProductFiltersState } from '@/types';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { usePromo } from '@/hooks/usePromo';
import { useDebounce } from '@/hooks/useDebounce';
import { useSEO } from '@/hooks/useSEO';
import { ProductFilters } from '@/components/product/ProductFilters';
import { ProductGrid } from '@/components/product/ProductGrid';
import { normalizeText } from '@/utils/validators';

const DEFAULT_FILTERS: ProductFiltersState = {
  search: '',
  category: null,
  sort: 'relevance',
  onlyPromotions: false,
  onlyAvailable: false,
};

export function Menu() {
  useSEO('Cardápio', 'Pastéis, hambúrgueres, caldo de cana, bebidas, porções e sobremesas da Pastelecia.');

  const { products, isLoading } = useProducts();
  const { categories } = useCategories();
  const promo = usePromo();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<ProductFiltersState>(() => ({
    ...DEFAULT_FILTERS,
    category: searchParams.get('categoria'),
    onlyPromotions: searchParams.get('promo') === '1',
  }));

  const debouncedSearch = useDebounce(filters.search, 250);

  // Mantém a categoria selecionada refletida na URL (compartilhável, funciona com voltar/avançar do navegador)
  useEffect(() => {
    const next = new URLSearchParams();
    if (filters.category) next.set('categoria', filters.category);
    if (filters.onlyPromotions) next.set('promo', '1');
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.onlyPromotions]);

  function handleFilterChange(next: Partial<ProductFiltersState>) {
    setFilters((prev) => ({ ...prev, ...next }));
  }

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (debouncedSearch.trim()) {
      const query = normalizeText(debouncedSearch);
      result = result.filter(
        (p) => normalizeText(p.name).includes(query) || normalizeText(p.description).includes(query),
      );
    }

    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters.onlyPromotions) {
      result = result.filter((p) => p.promotion);
    }

    if (filters.onlyAvailable) {
      result = result.filter((p) => p.available);
    }

    switch (filters.sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'alpha-asc':
        result.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
        break;
      case 'alpha-desc':
        result.sort((a, b) => b.name.localeCompare(a.name, 'pt-BR'));
        break;
      default:
        result.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return result;
  }, [products, debouncedSearch, filters.category, filters.onlyPromotions, filters.onlyAvailable, filters.sort]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8"
      >
        <span className="mb-2 inline-block font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-greenDark">
          Cardápio completo
        </span>
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
          {filters.category ?? 'Todos os produtos'}
        </h1>
        {promo?.active && filters.onlyPromotions && (
          <p className="mt-2 text-ink/60">{promo.description}</p>
        )}
      </motion.div>

      <div className="rounded-xl2 border border-ink/10 bg-paper-dim p-5 sm:p-6">
        <ProductFilters
          filters={filters}
          onChange={handleFilterChange}
          categories={categories}
          resultCount={filteredProducts.length}
        />
      </div>

      <div className="mt-8">
        <ProductGrid products={filteredProducts} isLoading={isLoading} />
      </div>
    </div>
  );
}