import { CategoryCard } from '@/components/category/CategoryCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { Category } from '@/types';

export function CategoryStrip({
  categories,
  isLoading,
  activeCategory,
  onSelect,
}: {
  categories: Category[];
  isLoading: boolean;
  activeCategory: string | null;
  onSelect: (name: string | null) => void;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl2" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {categories.map((cat, i) => (
        <CategoryCard
          key={cat.id}
          category={cat}
          index={i}
          active={activeCategory === cat.name}
          onClick={() => onSelect(activeCategory === cat.name ? null : cat.name)}
        />
      ))}
    </div>
  );
}