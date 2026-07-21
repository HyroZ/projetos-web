import { useEffect, useState } from 'react';
import type { BrandSettings } from '@/types';
import { getSettings } from '@/services/dataService';

export function useSettings() {
  const [settings, setSettings] = useState<BrandSettings | null>(null);

  useEffect(() => {
    let active = true;

    getSettings().then((data) => {
      if (active) setSettings(data);
    });

    return () => {
      active = false;
    };
  }, []);

  return settings;
}