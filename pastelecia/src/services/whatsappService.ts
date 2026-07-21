import type { CartItem, CheckoutData } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';

export function buildOrderMessage(
  items: CartItem[],
  checkout: CheckoutData,
  subtotal: number,
  total: number,
  couponDiscount = 0,
): string {

  const lines: string[] = [];

  lines.push('🛒 *Novo Pedido — Pastelecia*');
  lines.push('');

  lines.push('*Cliente:*');
  lines.push(checkout.name || '');
  lines.push('');

  lines.push('*Itens:*');

  items.forEach((item) => {
    lines.push(
      `${item.quantity}x ${item.product.name} — ${formatCurrency(
        item.product.price * item.quantity
      )}`
    );

    if (item.notes)
      lines.push(`   obs: ${item.notes}`);
  });

  lines.push('');

  lines.push(`*Subtotal:* ${formatCurrency(subtotal)}`);

  if (couponDiscount > 0) {
    lines.push(`*Desconto:* -${formatCurrency(couponDiscount)}`);
  }

  lines.push(`*Total:* ${formatCurrency(total)}`);

  lines.push('');

  lines.push('*Pagamento:*');
  lines.push(checkout.paymentMethod || '-');

  if (
    checkout.paymentMethod === 'Dinheiro' &&
    checkout.changeFor
  ) {
    lines.push(`Troco para: R$ ${checkout.changeFor}`);
  }

  lines.push('');

  lines.push('*Endereço de entrega:*');

  const addressParts = [
    checkout.address,
    checkout.number,
    checkout.complement,
  ].filter(Boolean);

  lines.push(addressParts.join(', ') || '-');

  lines.push('');

  lines.push('*Observações:*');
  lines.push(checkout.notes || 'Nenhuma');

  return lines.join('\n');
}

export function getWhatsAppUrl(
  phoneNumber: string,
  message: string
): string {

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}