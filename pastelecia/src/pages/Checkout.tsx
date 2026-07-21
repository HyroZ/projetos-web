import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShoppingBag, PencilLine, MessageCircle } from 'lucide-react';
import type { CheckoutData, PaymentMethod } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useSettings } from '@/hooks/useSettings';
import { useSEO } from '@/hooks/useSEO';
import { useToast } from '@/contexts/ToastContext';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { OrderTicketPreview } from '@/components/checkout/OrderTicketPreview';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency } from '@/utils/formatCurrency';
import { isValidPhone } from '@/utils/validators';
import { buildOrderMessage, getWhatsAppUrl } from '@/services/whatsappService';

const EMPTY_DATA: CheckoutData = {
  name: '',
  phone: '',
  address: '',
  number: '',
  complement: '',
  paymentMethod: '',
  changeFor: '',
  notes: '',
  coupon: '',
};

export function Checkout() {
  useSEO('Finalizar Pedido', 'Confirme seus dados e envie seu pedido pelo WhatsApp da Pastelecia.');

  const { items, subtotal, discount, total, clearCart } = useCart();
  const settings = useSettings();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [step, setStep] = useState<'form' | 'review'>('form');
  const [data, setData] = useState<CheckoutData>(EMPTY_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutData, string>>>({});

  function handleChange(field: keyof CheckoutData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const nextErrors: Partial<Record<keyof CheckoutData, string>> = {};
    if (!data.name.trim()) nextErrors.name = 'Informe seu nome.';
    if (!data.phone.trim()) nextErrors.phone = 'Informe seu telefone.';
    else if (!isValidPhone(data.phone)) nextErrors.phone = 'Telefone inválido.';
    if (!data.address.trim()) nextErrors.address = 'Informe o endereço.';
    if (!data.number.trim()) nextErrors.number = 'Informe o número.';
    if (!data.paymentMethod) nextErrors.paymentMethod = 'Selecione a forma de pagamento.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      showToast("Corrija os erros antes de continuar.", 'error');
      return;
    }
    setStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleConfirm() {
    if (!settings) return;
    const message = buildOrderMessage(items, data, subtotal, total, discount);
    const url = getWhatsAppUrl(settings.contact.whatsappNumber, message);
    window.open(url, '_blank', 'noopener,noreferrer');
    showToast('Pedido enviado! Só confirmar no WhatsApp.', 'success');
    clearCart();
    navigate('/');
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24">
        <EmptyState
          icon={<ShoppingBag size={26} />}
          title="Sua comanda está vazia"
          description="Adicione alguns produtos ao carrinho antes de finalizar o pedido."
          action={
            <Button onClick={() => navigate('/cardapio')}>Ver cardápio</Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <button
        onClick={() => (step === 'review' ? setStep('form') : navigate(-1))}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/60 transition hover:text-ink"
      >
        <ChevronLeft size={16} /> {step === 'review' ? 'Editar dados' : 'Voltar'}
      </button>

      <div className="mb-8 flex items-center gap-3">
        <StepBadge active={step === 'form'} done={step === 'review'} number={1} label="Seus dados" />
        <div className="h-px flex-1 bg-ink/10" />
        <StepBadge active={step === 'review'} done={false} number={2} label="Confirmar" />
      </div>

      <AnimatePresence mode="wait">
        {step === 'form' ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]"
          >
            <form onSubmit={handleContinue} className="rounded-xl2 border border-ink/10 bg-paper p-6 sm:p-8">
              <h1 className="mb-6 flex items-center gap-2 font-display text-2xl font-semibold text-ink">
                <PencilLine size={22} className="text-brand-greenDark" /> Seus dados
              </h1>
              <CheckoutForm
                data={data}
                errors={errors}
                onChange={handleChange}
                paymentMethods={(settings?.payments.methods ?? ['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro']) as PaymentMethod[]}
              />
              <Button type="submit" size="lg" fullWidth className="mt-8">
                Revisar Pedido
              </Button>
            </form>

            <OrderSummary items={items} subtotal={subtotal} discount={discount} total={total} />
          </motion.div>
        ) : (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="text-center">
              <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                Confira sua comanda
              </h1>
              <p className="mt-2 text-ink/60">
                Está tudo certo? Vamos abrir o WhatsApp com seu pedido pronto para enviar.
              </p>
            </div>

            <OrderTicketPreview items={items} checkout={data} subtotal={subtotal} discount={discount} total={total} />

            <div className="flex w-full max-w-sm flex-col gap-3">
              <Button size="lg" fullWidth icon={<MessageCircle size={19} />} onClick={handleConfirm}>
                Enviar pelo WhatsApp
              </Button>
              <Button size="lg" fullWidth variant="outline" onClick={() => setStep('form')}>
                Voltar e editar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepBadge({ active, done, number, label }: { active: boolean; done: boolean; number: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-sm font-bold ${
          active || done ? 'bg-ink text-paper' : 'bg-ink/10 text-ink/40'
        }`}
      >
        {number}
      </span>
      <span className={`hidden text-sm font-semibold sm:inline ${active ? 'text-ink' : 'text-ink/40'}`}>
        {label}
      </span>
    </div>
  );
}

function OrderSummary({
  items,
  subtotal,
  discount,
  total,
}: {
  items: { product: { id: number; name: string; price: number }; quantity: number }[];
  subtotal: number;
  discount: number;
  total: number;
}) {
  return (
    <aside className="h-fit rounded-xl2 border border-ink/10 bg-paper-dim p-6">
      <h2 className="mb-4 font-display text-lg font-semibold text-ink">Resumo do pedido</h2>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item.product.id} className="flex items-center justify-between text-sm text-ink/70">
            <span>
              {item.quantity}x {item.product.name}
            </span>
            <span className="font-mono">{formatCurrency(item.product.price * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 space-y-1.5 border-t border-ink/10 pt-4">
        <div className="flex justify-between text-sm text-ink/60">
          <span>Subtotal</span>
          <span className="font-mono">{formatCurrency(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-brand-greenDark">
            <span>Desconto</span>
            <span className="font-mono">-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between pt-1 font-display text-lg font-bold text-ink">
          <span>Total</span>
          <span className="font-mono">{formatCurrency(total)}</span>
        </div>
      </div>
      <Link to="/cardapio" className="mt-4 inline-block text-sm font-semibold text-brand-greenDark hover:underline">
        + Adicionar mais itens
      </Link>
    </aside>
  );
}