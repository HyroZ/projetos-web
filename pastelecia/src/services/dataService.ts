import type {
  Product,
  Category,
  BrandSettings,
  FeaturedConfig,
  PromoConfig,
} from '@/types';

import productsJson from '@/data/products.json';
import categoriesJson from '@/data/categories.json';
import settingsJson from '@/data/settings.json';
import featuredJson from '@/data/featured.json';
import promoJson from '@/data/promo.json';

export const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL ?? '';

const USE_MOCK = true;

function withLatency<T>(data: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

export async function getProducts(): Promise<Product[]> {
  if (USE_MOCK) return withLatency(productsJson as Product[]);

  const res = await fetch(`${API_BASE_URL}/products`);
  return res.json();
}

export async function getProductById(id: number): Promise<Product | undefined> {
  if (USE_MOCK) {
    const product = (productsJson as Product[]).find(
      (p) => p.id === id
    );

    return withLatency(product, 250);
  }

  const res = await fetch(`${API_BASE_URL}/products/${id}`);
  return res.json();
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {

  if (USE_MOCK) {
    const related = (productsJson as Product[])
      .filter(
        (p) =>
          p.category === product.category &&
          p.id !== product.id
      )
      .slice(0, limit);

    return withLatency(related, 250);
  }

  const res = await fetch(
    `${API_BASE_URL}/products/${product.id}/related`
  );

  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  if (USE_MOCK)
    return withLatency(categoriesJson as Category[], 200);

  const res = await fetch(`${API_BASE_URL}/categories`);
  return res.json();
}

export async function getSettings(): Promise<BrandSettings> {
  if (USE_MOCK)
    return withLatency(settingsJson as BrandSettings, 0);

  const res = await fetch(`${API_BASE_URL}/settings`);
  return res.json();
}

export async function getFeatured(): Promise<FeaturedConfig> {
  if (USE_MOCK)
    return withLatency(featuredJson as FeaturedConfig, 300);

  const res = await fetch(`${API_BASE_URL}/featured`);
  return res.json();
}

export async function getPromo(): Promise<PromoConfig> {
  if (USE_MOCK)
    return withLatency(promoJson as PromoConfig, 300);

  const res = await fetch(`${API_BASE_URL}/promo`);
  return res.json();
}