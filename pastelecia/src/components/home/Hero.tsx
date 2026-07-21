import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Clock, Star, Sandwich } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BrandSettings } from '@/types';

export function Hero({ settings }: { settings: BrandSettings | null }) {
  return (
    <section className="relative overflow-hidden bg-paper pb-16 pt-8 sm:pt-14 lg:pb-24 lg:pt-20">
      {/* textura sutil de fundo */}
      <div className="absolute inset-0 bg-grain" aria-hidden="true" />
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-yellow/25 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-16 top-32 h-64 w-64 rounded-full bg-brand-orange/20 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {settings && (
            <div className="mb-5 flex flex-wrap items-center gap-3 font-mono text-xs font-bold uppercase tracking-wide text-brand-greenDark">
              <span className="flex items-center gap-1.5 rounded-full bg-brand-green/15 px-3 py-1.5">
                <MapPin size={13} /> {settings.address.neighborhood}, {settings.address.city}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-brand-green/15 px-3 py-1.5">
                <Clock size={13} /> {settings.hours.days} · {settings.hours.open}–{settings.hours.close}
              </span>
            </div>
          )}

          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            O sabor que conquista
            <span className="relative mx-2 inline-block whitespace-nowrap text-brand-greenDark">
              na primeira mordida
              <svg
                viewBox="0 0 300 12"
                className="absolute -bottom-2 left-0 w-full text-brand-yellow"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M2 9 Q 80 2 150 7 T 298 6" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="mt-6 max-w-md text-lg text-ink/65">
            Pastéis crocantes, hambúrguer artesanal e caldo de cana geladinho.
            Monte seu pedido em menos de 1 minuto e envie direto pelo WhatsApp.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
              <Link to="/cardapio">Pedir Agora</Link>
            </Button>
            <Link
              to="/cardapio"
              className="font-body font-semibold text-ink/70 underline decoration-ink/25 decoration-2 underline-offset-4 transition hover:text-ink hover:decoration-brand-greenDark"
            >
              Ver Cardápio
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative mx-auto flex h-72 w-72 items-center justify-center sm:h-96 sm:w-96"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-green via-brand-yellow to-brand-orange opacity-90" />
          <div className="absolute inset-4 rounded-full bg-paper" />
          <Sandwich size={96} className="relative text-ink/80" strokeWidth={1.25} />

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-4 top-6 flex items-center gap-1.5 rounded-xl bg-ink px-3 py-2 text-paper shadow-ticket sm:-left-8"
          >
            <Star size={14} className="fill-brand-yellow text-brand-yellow" />
            <span className="font-mono text-xs font-bold">4.9 de avaliação</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -right-2 bottom-8 rounded-xl bg-paper px-3 py-2 shadow-ticket sm:-right-6"
          >
            <span className="font-mono text-xs font-bold text-brand-greenDark">35–55 min entrega</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}