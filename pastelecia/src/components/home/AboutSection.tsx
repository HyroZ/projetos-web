import { motion } from 'framer-motion';
import { ChefHat, Timer, HeartHandshake } from 'lucide-react';

const PILLARS = [
  {
    icon: ChefHat,
    title: 'Feito na hora',
    description: 'Massa fininha, cana moída na hora e blend artesanal — sem atalhos.',
  },
  {
    icon: Timer,
    title: 'Rápido de pedir',
    description: 'Monte seu pedido em menos de 1 minuto e envie direto pelo WhatsApp.',
  },
  {
    icon: HeartHandshake,
    title: 'Ambiente familiar',
    description: 'O clima de bairro que a gente conhece desde criança, no Cristo Rei.',
  },
];

export function AboutSection() {
  return (
    <section className="bg-paper-dim py-14 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="flex flex-col items-start gap-3 rounded-xl2 bg-paper p-6 shadow-soft"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-green/20 text-brand-greenDark">
                <pillar.icon size={20} />
              </span>
              <h3 className="font-display text-lg font-semibold text-ink">{pillar.title}</h3>
              <p className="text-sm text-ink/60">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}