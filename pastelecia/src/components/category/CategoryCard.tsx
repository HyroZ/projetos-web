import { motion } from 'framer-motion';
import type { Category } from '@/types';
import { getIcon } from '@/utils/iconMap';
import { cn } from '@/utils/cn';

export function CategoryCard({
  category,
  active,
  onClick,
  index = 0,
}: {
  category: Category;
  active?: boolean;
  onClick?: () => void;
  index?: number;
}) {
  const Icon = getIcon(category.icon);

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      aria-pressed={active}
      className={cn(
        'group relative flex flex-col items-start gap-3 overflow-hidden rounded-xl2 border p-5 text-left transition-colors',
        active ? 'border-ink bg-ink text-paper' : 'border-ink/10 bg-paper text-ink hover:border-ink/25',
      )}
    >
      <span
        className="flex h-11 w-11 items-center justify-center rounded-full transition-colors"
        style={{ backgroundColor: active ? 'rgba(255,255,255,0.15)' : `${category.color}26` }}
      >
        <Icon size={20} style={{ color: active ? '#FFDE4E' : category.color }} />
      </span>
      <div>
        <h3 className="font-display text-lg font-semibold">{category.name}</h3>
        <p className={cn('mt-0.5 text-sm', active ? 'text-paper/70' : 'text-ink/55')}>
          {category.description}
        </p>
      </div>
      {/* recorte serrilhado decorativo no canto — ecoa a comanda de pedido */}
      <span
        aria-hidden="true"
        className="absolute -right-3 -top-3 h-10 w-10 rotate-45 rounded-sm opacity-[0.06]"
        style={{ backgroundColor: category.color }}
      />
    </motion.button>
  );
}