import { type ReactNode } from 'react';
import type { CheckoutData, PaymentMethod } from '@/types';
import { formatPhoneMask } from '@/utils/validators';
import { cn } from '@/utils/cn';

interface Props {
  data: CheckoutData;
  errors: Partial<Record<keyof CheckoutData, string>>;
  onChange: (field: keyof CheckoutData, value: string) => void;
  paymentMethods: PaymentMethod[];
}

function Field({
  label,
  error,
  children,
  required,
}: {
  label: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-ink/75">
        {label} {required && <span className="text-brand-orange">*</span>}
      </span>
      {children}
      {error && <span className="text-xs font-medium text-red-500">{error}</span>}
    </label>
  );
}

const inputClass =
  'w-full rounded-xl border bg-paper px-4 py-3 text-ink placeholder:text-ink/35 focus:outline-none focus:ring-4 transition-colors';

export function CheckoutForm({ data, errors, onChange, paymentMethods }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Nome completo" error={errors.name} required>
            <input
              type="text"
              value={data.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Como podemos te chamar?"
              className={cn(inputClass, errors.name ? 'border-red-400 focus:ring-red-100' : 'border-ink/15 focus:border-brand-greenDark focus:ring-brand-green/20')}
            />
          </Field>
        </div>

        <Field label="Telefone / WhatsApp" error={errors.phone} required>
          <input
            type="tel"
            inputMode="tel"
            value={data.phone}
            onChange={(e) => onChange('phone', formatPhoneMask(e.target.value))}
            placeholder="(38) 90000-0000"
            className={cn(inputClass, errors.phone ? 'border-red-400 focus:ring-red-100' : 'border-ink/15 focus:border-brand-greenDark focus:ring-brand-green/20')}
          />
        </Field>

        <Field label="Forma de pagamento" error={errors.paymentMethod} required>
          <select
            value={data.paymentMethod}
            onChange={(e) => onChange('paymentMethod', e.target.value)}
            className={cn(inputClass, errors.paymentMethod ? 'border-red-400' : 'border-ink/15 focus:border-brand-greenDark focus:ring-brand-green/20')}
          >
            <option value="">Selecione...</option>
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </Field>

        {data.paymentMethod === 'Dinheiro' && (
          <div className="sm:col-span-2">
            <Field label="Troco para quanto?">
              <input
                type="text"
                inputMode="decimal"
                value={data.changeFor}
                onChange={(e) => onChange('changeFor', e.target.value)}
                placeholder="Ex: 50,00 (deixe em branco se não precisar)"
                className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-ink placeholder:text-ink/35 focus:border-brand-greenDark focus:outline-none focus:ring-4 focus:ring-brand-green/20"
              />
            </Field>
          </div>
        )}

        <div className="sm:col-span-2">
          <Field label="Endereço" error={errors.address} required>
            <input
              type="text"
              value={data.address}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="Rua, avenida..."
              className={cn(inputClass, errors.address ? 'border-red-400 focus:ring-red-100' : 'border-ink/15 focus:border-brand-greenDark focus:ring-brand-green/20')}
            />
          </Field>
        </div>

        <Field label="Número" error={errors.number} required>
          <input
            type="text"
            value={data.number}
            onChange={(e) => onChange('number', e.target.value)}
            placeholder="Nº"
            className={cn(inputClass, errors.number ? 'border-red-400 focus:ring-red-100' : 'border-ink/15 focus:border-brand-greenDark focus:ring-brand-green/20')}
          />
        </Field>

        <Field label="Complemento">
          <input
            type="text"
            value={data.complement}
            onChange={(e) => onChange('complement', e.target.value)}
            placeholder="Bloco, apto, referência..."
            className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-ink placeholder:text-ink/35 focus:border-brand-greenDark focus:outline-none focus:ring-4 focus:ring-brand-green/20"
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Observações do pedido">
            <textarea
              value={data.notes}
              onChange={(e) => onChange('notes', e.target.value)}
              placeholder="Ponto de referência, instruções de entrega..."
              rows={3}
              className="w-full resize-none rounded-xl border border-ink/15 bg-paper px-4 py-3 text-ink placeholder:text-ink/35 focus:border-brand-greenDark focus:outline-none focus:ring-4 focus:ring-brand-green/20"
            />
          </Field>
        </div>
      </div>
    </div>
  );
}