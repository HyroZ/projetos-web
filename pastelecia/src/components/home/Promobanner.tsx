import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { usePromo } from '@/hooks/usePromo';

export function PromoBanner() {
    const promo = usePromo();

    if (!promo || !promo.active) return null;

    return (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="relative overflow-hidden rounded-xl2 bg-ink px-6 py-8 text-paper sm:px-10 sm:py-10"
            >
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-orange/25 blur-2xl" aria-hidden="true" />
                <div className="absolute -bottom-14 left-10 h-40 w-40 rounded-full bg-brand-green/20 blur-2xl" aria-hidden="true" />
                <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-brand-yellow px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">
                            <Sparkles size={13} /> {promo.badge}
                        </span>
                        <h3 className="font-display text-2xl font-semibold sm:text-3xl">{promo.title}</h3>
                        <p className="mt-2 max-w-lg text-paper/70">{promo.description}</p>
                    </div>
                    <Link
                        to="/cardapio?promo=1"
                        className="flex shrink-0 items-center gap-2 rounded-full bg-brand-green px-6 py-3 font-semibold text-ink transition hover:bg-brand-greenDark hover:text-paper"
                    >
                        Aproveitar <ArrowRight size={16} />
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}