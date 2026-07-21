import { useEffect, useState } from 'react';
import type { FeaturedConfig, Product } from '@/types';
import { getFeatured, getProducts } from '@/services/dataService';

export function useFeatured() {
  const [config, setConfig] = useState<FeaturedConfig | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([getFeatured(), getProducts()] as const).then(
      ([featured, allProducts]) => {
        if (!active) return;

        setConfig(featured);

        const byId = new Map(allProducts.map((p) => [p.id, p]));

        setProducts(
          featured.productIds
            .map((id) => byId.get(id))
            .filter(Boolean) as Product[],
        );

        setIsLoading(false);
      },
    );

    return () => {
      active = false;
    };
  }, []);

  return { config, products, isLoading };
}