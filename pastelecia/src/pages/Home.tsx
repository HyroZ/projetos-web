import { useNavigate } from 'react-router-dom';
import { Hero } from '@/components/home/Hero';
import { InfoStrip } from '@/components/home/InfoStrip';
import { PromoBanner } from '@/components/home/Promobanner';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { AboutSection } from '@/components/home/AboutSection';
import { CategoryStrip } from '@/components/category/CategoryStrip';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useCategories } from '@/hooks/useCategories';
import { useSettings } from '@/hooks/useSettings';
import { useSEO } from '@/hooks/useSEO';

export function Home() {
  const settings = useSettings();
  const { categories, isLoading } = useCategories();
  const navigate = useNavigate();

  useSEO(
    'Pastéis, Hambúrguer e Caldo de Cana em Montes Claros',
    settings?.seo.description,
  );

  function handleSelectCategory(name: string | null) {
    navigate(name ? `/cardapio?categoria=${encodeURIComponent(name)}` : '/cardapio');
  }

  return (
    <div>
      <Hero settings={settings} />
      <InfoStrip settings={settings} />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading
          eyebrow="Cardápio"
          title="Escolha por categoria"
          description="Do salgadinho da tarde à sobremesa. Selecione uma categoria e monte seu pedido."
        />
        <div className="mt-8">
          <CategoryStrip
            categories={categories}
            isLoading={isLoading}
            activeCategory={null}
            onSelect={handleSelectCategory}
          />
        </div>
      </section>

      <div className="py-2">
        <PromoBanner />
      </div>

      <FeaturedSection />
      <AboutSection />
    </div>
  );
}