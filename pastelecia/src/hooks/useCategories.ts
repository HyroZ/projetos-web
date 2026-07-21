import { useEffect, useState } from 'react';
import type { Category } from '@/types';
import { getCategories } from '@/services/dataService';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getCategories().then((data) => {
      if (active) {
        setCategories(data);
        setIsLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return { categories, isLoading };
}