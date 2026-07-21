import { Link } from 'react-router-dom';
import { Sandwich } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSEO } from '@/hooks/useSEO';

export function NotFound() {
  useSEO('Página não encontrada');

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-5 px-4 py-28 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-yellow/30">
        <Sandwich size={28} className="text-ink/60" />
      </span>
      <h1 className="font-display text-3xl font-semibold text-ink">Página não encontrada</h1>
      <p className="text-ink/60">
        Essa página saiu do cardápio. Que tal voltar para o início e escolher algo gostoso?
      </p>
      <Button asChild>
        <Link to="/">Voltar ao início</Link>
      </Button>
    </div>
  );
}