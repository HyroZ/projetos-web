import { useEffect, useState } from 'react';
import type { PromoConfig } from '@/types';
import { getPromo } from '@/services/dataService';

export function usePromo() {
  const [promo, setPromo] = useState<PromoConfig | null>(null);

  useEffect(() => {
    let active = true;

    getPromo().then((data) => {
      if (active) setPromo(data);
    });

    return () => {
      active = false;
    };
  }, []);

  return promo;
}