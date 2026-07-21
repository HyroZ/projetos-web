import {
  Triangle,
  Beef,
  GlassWater,
  CupSoda,
  UtensilsCrossed,
  IceCreamCone,
  type LucideIcon,
} from 'lucide-react';

/**
 * Mapeia o nome do ícone salvo em categories.json (string) para o
 * componente Lucide correspondente.
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  Triangle,
  Beef,
  GlassWater,
  CupSoda,
  UtensilsCrossed,
  IceCreamCone,
};

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? UtensilsCrossed;
}