import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useFeatured } from '@/hooks/useFeatured';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductGrid } from '@/components/product/ProductGrid';

export function FeaturedSection() {
  const { config, products, isLoading } = useFeatured();

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <SectionHeading
        eyebrow="Destaques"
        title={config?.title ?? 'Os Mais Pedidos'}
        description={config?.subtitle}
        action={
          <Link
            to="/cardapio"
            className="flex shrink-0 items-center gap-1.5 font-body font-semibold text-brand-greenDark hover:text-brand-greenDark/80"
          >
            Ver cardápio completo <ArrowRight size={16} />
          </Link>
        }
      />
      <div className="mt-8">
        <ProductGrid products={products} isLoading={isLoading} skeletonCount={6} />
      </div>
    </section>
  );
}
