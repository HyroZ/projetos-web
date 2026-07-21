import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';

import type { CartItem, Product } from '@/types';
import { useToast } from '@/contexts/ToastContext';

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number, notes?: string) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updateNotes: (productId: number, notes: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  coupon: { code: string; discountPercent: number } | null;
  couponError: string | null;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  discount: number;
  total: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

// Cupons de demonstração — apenas para fins de interface
const DEMO_COUPONS: Record<string, number> = {
  PASTEL10: 10,
  CANA5: 5,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const [coupon, setCoupon] = useState<{
    code: string;
    discountPercent: number;
  } | null>(null);

  const [couponError, setCouponError] = useState<string | null>(null);

  // useToast currently has an imprecise return type; cast to any to access showToast
  const { showToast } = useToast() as any;

  const openCart = useCallback(() => setIsOpen(true), []);

  const closeCart = useCallback(() => setIsOpen(false), []);

  const toggleCart = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const addItem = useCallback(
    (product: Product, quantity = 1, notes?: string) => {
      setItems((prev) => {
        const existing = prev.find(
          (item) => item.product.id === product.id
        );

        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                }
              : item
          );
        }

        return [
          ...prev,
          {
            product,
            quantity,
            notes,
          },
        ];
      });

      showToast(`${product.name} adicionado ao carrinho`, 'success');
    },
    [showToast]
  );

  const removeItem = useCallback((productId: number) => {
    setItems((prev) =>
      prev.filter((item) => item.product.id !== productId)
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }

      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      );
    },
    [removeItem]
  );

  const updateNotes = useCallback(
    (productId: number, notes: string) => {
      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId
            ? { ...item, notes }
            : item
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setCoupon(null);
    setCouponError(null);
  }, []);

  const applyCoupon = useCallback(
    (code: string) => {
      const normalized = code.trim().toUpperCase();

      if (!normalized) return;

      const discountPercent = DEMO_COUPONS[normalized];

      if (discountPercent) {
        setCoupon({
          code: normalized,
          discountPercent,
        });

        setCouponError(null);

        showToast(
          `Cupom ${normalized} aplicado! -${discountPercent}%`,
          'success'
        );
      } else {
        setCoupon(null);
        setCouponError('Cupom inválido ou expirado.');
      }
    },
    [showToast]
  );

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    setCouponError(null);
  }, []);

  const itemCount = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum + item.product.price * item.quantity,
      0
    );
  }, [items]);

  const discount = useMemo(() => {
    if (!coupon) return 0;

    return (subtotal * coupon.discountPercent) / 100;
  }, [coupon, subtotal]);

  const total = useMemo(() => {
    return Math.max(subtotal - discount, 0);
  }, [subtotal, discount]);

  const value: CartContextValue = {
    items,
    isOpen,
    openCart,
    closeCart,
    toggleCart,
    addItem,
    removeItem,
    updateQuantity,
    updateNotes,
    clearCart,
    itemCount,
    subtotal,
    coupon,
    couponError,
    applyCoupon,
    removeCoupon,
    discount,
    total,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error(
      'useCart deve ser usado dentro de CartProvider'
    );
  }

  return ctx;
}