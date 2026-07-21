import { MessageCircle } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

export function WhatsAppFloatButton() {
  const settings = useSettings();
  if (!settings) return null;

  return (
    <a
      href={settings.contact.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Pastelecia no WhatsApp"
      className="group fixed bottom-5 right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-brand-greenDark text-paper shadow-ticket transition-transform hover:scale-105 active:scale-95"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-brand-green/50 group-hover:animate-none" aria-hidden="true" />
      <MessageCircle size={26} className="relative" />
    </a>
  );
}