import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { Category, ProductFiltersState, SortOption } from '@/types';
import { cn } from '@/utils/cn';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevância' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
  { value: 'alpha-asc', label: 'A - Z' },
  { value: 'alpha-desc', label: 'Z - A' },
];

export function ProductFilters({
  filters,
  onChange,
  categories,
  resultCount,
}: {
  filters: ProductFiltersState;
  onChange: (next: Partial<ProductFiltersState>) => void;
  categories: Category[];
  resultCount: number;
}) {
  const hasActiveFilters =
    filters.category !== null || filters.onlyPromotions || filters.onlyAvailable || filters.search !== '';

  return (
    <div className="flex flex-col gap-4">
      {/* Busca */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
        <input
          type="search"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Buscar por pastel, hambúrguer, caldo de cana..."
          aria-label="Buscar produtos"
          className="w-full rounded-full border border-ink/15 bg-paper py-3.5 pl-11 pr-11 font-body text-ink placeholder:text-ink/40 focus:border-brand-greenDark focus:outline-none focus:ring-4 focus:ring-brand-green/20"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ search: '' })}
            aria-label="Limpar busca"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Categorias (chips) */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
        <button
          onClick={() => onChange({ category: null })}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-semibold transition',
            filters.category === null
              ? 'bg-ink text-paper'
              : 'bg-paper-dim text-ink/70 hover:bg-ink/10',
          )}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onChange({ category: cat.name })}
            aria-pressed={filters.category === cat.name}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-semibold transition',
              filters.category === cat.name
                ? 'bg-ink text-paper'
                : 'bg-paper-dim text-ink/70 hover:bg-ink/10',
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Ordenação + toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 rounded-full bg-paper-dim px-3 py-2 text-sm font-medium text-ink/70">
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">Ordenar:</span>
            <select
              value={filters.sort}
              onChange={(e) => onChange({ sort: e.target.value as SortOption })}
              className="bg-transparent font-semibold text-ink focus:outline-none"
              aria-label="Ordenar produtos"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <button
            onClick={() => onChange({ onlyPromotions: !filters.onlyPromotions })}
            aria-pressed={filters.onlyPromotions}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition',
              filters.onlyPromotions ? 'bg-brand-orange text-ink' : 'bg-paper-dim text-ink/70 hover:bg-ink/10',
            )}
          >
            Só promoções
          </button>

          <button
            onClick={() => onChange({ onlyAvailable: !filters.onlyAvailable })}
            aria-pressed={filters.onlyAvailable}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition',
              filters.onlyAvailable ? 'bg-brand-green text-ink' : 'bg-paper-dim text-ink/70 hover:bg-ink/10',
            )}
          >
            Só disponíveis
          </button>

          {hasActiveFilters && (
            <button
              onClick={() => onChange({ search: '', category: null, onlyPromotions: false, onlyAvailable: false })}
              className="flex items-center gap-1 px-2 py-2 text-sm font-semibold text-ink/50 hover:text-ink"
            >
              <X size={14} /> Limpar
            </button>
          )}
        </div>

        <span className="font-mono text-xs text-ink/50">
          {resultCount} {resultCount === 1 ? 'produto' : 'produtos'}
        </span>
      </div>
    </div>
  );
}