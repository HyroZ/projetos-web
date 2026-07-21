// Tipos centrais do domínio da Pastelecia.
// Mantidos separados dos dados (JSON) para que, no futuro, a API REST
// possa substituir os arquivos locais sem exigir mudanças nos componentes.

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  featured: boolean;
  promotion: boolean;
  available: boolean;
  rating: number;
  ingredients: string[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
}

export interface BrandSettings {
  brand: {
    name: string;
    tagline: string;
    shortDescription: string;
    logo: string;
  };
  contact: {
    whatsappNumber: string;
    whatsappDisplay: string;
    whatsappLink: string;
    instagram: string;
    instagramHandle: string;
  };
  address: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    full: string;
    mapsQuery: string;
  };
  hours: {
    days: string;
    open: string;
    close: string;
    closedDays: string[];
  };
  payments: {
    methods: string[];
  };
  delivery: {
    estimateMinutes: [number, number];
    minOrder: number;
  };
  seo: {
    title: string;
    description: string;
  };
}

export interface FeaturedConfig {
  title: string;
  subtitle: string;
  productIds: number[];
}

export interface PromoConfig {
  active: boolean;
  title: string;
  description: string;
  badge: string;
  productIds: number[];
  validUntil: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'alpha-asc' | 'alpha-desc';

export interface ProductFiltersState {
  search: string;
  category: string | null;
  sort: SortOption;
  onlyPromotions: boolean;
  onlyAvailable: boolean;
}

export type PaymentMethod = 'PIX' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Dinheiro';

export interface CheckoutData {
  name: string;
  phone: string;
  address: string;
  number: string;
  complement: string;
  paymentMethod: PaymentMethod | '';
  changeFor: string;
  notes: string;
  coupon: string;
}