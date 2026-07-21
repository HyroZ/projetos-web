import { MapPin, Clock, Instagram, MessageCircle } from 'lucide-react';
import type { BrandSettings } from '@/types';

export function InfoStrip({ settings }: { settings: BrandSettings | null }) {
  if (!settings) return null;

  const items = [
    { icon: MapPin, label: settings.address.full },
    { icon: Clock, label: `${settings.hours.days} · ${settings.hours.open} às ${settings.hours.close}` },
    { icon: MessageCircle, label: settings.contact.whatsappDisplay },
    { icon: Instagram, label: settings.contact.instagramHandle },
  ];

  return (
    <section className="border-y border-ink/8 bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6 lg:px-8">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5 text-sm text-ink/70">
            <item.icon size={16} className="shrink-0 text-brand-greenDark" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}