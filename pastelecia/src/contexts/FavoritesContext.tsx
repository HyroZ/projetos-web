import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { useToast } from '@/contexts/ToastContext';

interface FavoritesContextValue {
  favoriteIds: number[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number, name?: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

const STORAGE_KEY = 'pastelecia:favorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as number[]) : [];
    } catch {
      return [];
    }
  });

  const { showToast } = useToast() as any;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch {
      // localStorage indisponível — favoritos funcionarão apenas nesta sessão.
    }
  }, [favoriteIds]);

  const isFavorite = useCallback(
    (id: number) => favoriteIds.includes(id),
    [favoriteIds],
  );

  const toggleFavorite = useCallback(
    (id: number, name?: string) => {
      setFavoriteIds((prev) => {
        const exists = prev.includes(id);

        if (exists) {
          showToast(
            name ? `${name} removido dos favoritos` : 'Removido dos favoritos',
            'info',
          );
          return prev.filter((favId) => favId !== id);
        }

        showToast(
          name ? `${name} adicionado aos favoritos` : 'Adicionado aos favoritos',
          'success',
        );

        return [...prev, id];
      });
    },
    [showToast],
  );

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);

  if (!ctx) {
    throw new Error(
      'useFavorites deve ser usado dentro de FavoritesProvider',
    );
  }

  return ctx;
}