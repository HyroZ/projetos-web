import { Link } from 'react-router-dom';
import { MapPin, Clock, Instagram, MessageCircle, Sandwich } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useCategories } from '@/hooks/useCategories';

export function Footer() {
  const settings = useSettings();
  const { categories } = useCategories();

  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-green to-brand-orange">
                <Sandwich size={18} className="text-ink" />
              </span>
              <span className="font-display text-xl font-bold">Pastelecia</span>
            </Link>
            <p className="mt-4 text-sm text-paper/60">
              {settings?.brand.tagline ?? 'O sabor que conquista na primeira mordida!'}
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-paper/40">
              Cardápio
            </h4>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/cardapio?categoria=${encodeURIComponent(cat.name)}`}
                    className="text-sm text-paper/70 transition hover:text-brand-yellow"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-paper/40">
              Contato
            </h4>
            {settings && (
              <ul className="space-y-3 text-sm text-paper/70">
                <li className="flex items-start gap-2">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-brand-green" />
                  <span>{settings.address.full}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock size={15} className="mt-0.5 shrink-0 text-brand-green" />
                  <span>
                    {settings.hours.days}
                    <br />
                    {settings.hours.open} às {settings.hours.close}
                  </span>
                </li>
              </ul>
            )}
          </div>

          <div>
            <h4 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-paper/40">
              Redes
            </h4>
            {settings && (
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href={settings.contact.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-paper/70 transition hover:text-brand-yellow"
                  >
                    <MessageCircle size={15} className="text-brand-green" />
                    {settings.contact.whatsappDisplay}
                  </a>
                </li>
                <li>
                  <a
                    href={settings.contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-paper/70 transition hover:text-brand-yellow"
                  >
                    <Instagram size={15} className="text-brand-green" />
                    {settings.contact.instagramHandle}
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-paper/10 pt-6 text-xs text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Pastelecia. Todos os direitos reservados.</p>
          <p>Feito com carinho em Montes Claros - MG.</p>
        </div>
      </div>
    </footer>
  );
}