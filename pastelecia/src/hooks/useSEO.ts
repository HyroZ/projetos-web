import { useEffect } from 'react';

/**
 * Atualiza o <title> e a meta description da página em tempo de execução.
 * Uma solução leve, sem dependências extras (ex.: react-helmet), suficiente
 * para um site totalmente client-side como este.
 */
export function useSEO(title: string, description?: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | Pastelecia`;

    let metaDescription: HTMLMetaElement | null = null;
    let previousDescription: string | null = null;

    if (description) {
      metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        previousDescription = metaDescription.getAttribute('content');
        metaDescription.setAttribute('content', description);
      }
    }

    return () => {
      document.title = previousTitle;
      if (metaDescription && previousDescription) {
        metaDescription.setAttribute('content', previousDescription);
      }
    };
  }, [title, description]);
}