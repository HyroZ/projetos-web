import {
  type ButtonHTMLAttributes,
  type ReactNode,
  type ReactElement,
  forwardRef,
  cloneElement,
  isValidElement,
} from 'react';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'dark';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  /**
   * Quando true, o Button não renderiza seu próprio <button>: em vez disso,
   * aplica os estilos e o comportamento diretamente no único filho (ex.: um
   * <Link> do react-router). Útil para que um link de navegação tenha a
   * mesma aparência de um botão, sem aninhar <a> dentro de <button>.
   */
  asChild?: boolean;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-brand-green text-ink hover:bg-brand-greenDark hover:text-paper focus-visible:ring-brand-greenDark',
  secondary:
    'bg-brand-orange text-ink hover:brightness-95 focus-visible:ring-brand-orange',
  outline:
    'border-2 border-ink/15 bg-transparent text-ink hover:border-ink/30 hover:bg-ink/5 focus-visible:ring-ink/30',
  ghost: 'bg-transparent text-ink hover:bg-ink/5 focus-visible:ring-ink/20',
  dark: 'bg-ink text-paper hover:bg-ink/90 focus-visible:ring-ink',
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'px-3.5 py-2 text-sm gap-1.5',
  md: 'px-5 py-3 text-[0.95rem] gap-2',
  lg: 'px-7 py-4 text-base gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    fullWidth,
    asChild,
    className,
    children,
    ...props
  },
  ref,
) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-full font-body font-semibold',
    'transition-all duration-200 active:scale-[0.97]',
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-1',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth && 'w-full',
    className,
  );

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </>
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string; children?: ReactNode }>;
    return cloneElement(child, {
      className: cn(classes, child.props.className),
      children: (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          {child.props.children}
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      ),
    });
  }

  return (
    <button ref={ref} className={classes} {...props}>
      {content}
    </button>
  );
});