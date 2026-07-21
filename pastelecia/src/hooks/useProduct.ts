import { useEffect, useState } from 'react';
import type { Product } from '@/types';
import { getProductById, getRelatedProducts } from '@/services/dataService';

export function useProduct(id: number | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id === undefined) return;

    let active = true;
    setIsLoading(true);
    setNotFound(false);

    getProductById(id).then((data) => {
      if (!active) return;

      if (!data) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setProduct(data);

      getRelatedProducts(data).then((related) => {
        if (active) {
          setRelatedProducts(related);
          setIsLoading(false);
        }
      });
    });

    return () => {
      active = false;
    };
  }, [id]);

  return { product, relatedProducts, isLoading, notFound };
}