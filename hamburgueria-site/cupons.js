/* 
   TEST BURGERS — cupons.js
   Sistema completo de cupons de desconto
   Tipos: percentual, fixo e frete grátis
*/

/* ----------------------------------------------------------
   ESTADO
   ---------------------------------------------------------- */
var cupomAtivo = null; // { codigo, tipo, valor, descricao } ou null


/* ----------------------------------------------------------
   CATÁLOGO DE CUPONS DISPONÍVEIS
   Para adicionar novos cupons, basta incluir aqui.
   ---------------------------------------------------------- */
var CUPONS_DISPONIVEIS = {

  // 10% de desconto no subtotal
  'TEST10': {
    tipo: 'percentual',
    valor: 10,
    descricao: '10% de desconto no pedido'
  },

  // 15% de desconto no subtotal
  'PROMO15': {
    tipo: 'percentual',
    valor: 15,
    descricao: '15% de desconto no pedido'
  },

  // R$ 5,00 fixo de desconto
  'BEMVINDO': {
    tipo: 'fixo',
    valor: 5,
    descricao: 'R$ 5,00 de desconto na primeira compra'
  },

  // R$ 8,00 fixo de desconto
  'AMIGO8': {
    tipo: 'fixo',
    valor: 8,
    descricao: 'R$ 8,00 de desconto'
  },

  // Frete grátis (desconta 100% do frete)
  'FRETEGRATIS': {
    tipo: 'frete',
    valor: 100,
    descricao: 'Frete grátis em qualquer bairro 🚴'
  }
};

/* APLICAR CUPOM */
/**
 * Lê o campo de cupom, valida e aplica o desconto.
 * Chamada pelo onclick do botão "Aplicar".
 */
function aplicarCupom() {
  var input = document.getElementById('cupomInput');
  var feedback = document.getElementById('cupomFeedback');
  if (!input) return;

  var codigo = input.value.trim().toUpperCase();

  // Validação: campo vazio
  if (!codigo) {
    exibirFeedbackCupom('error', '⚠️ Digite um código de cupom.');
    return;
  }

  // Validação: carrinho vazio
  var subtotal = (typeof calcularSubtotal === 'function') ? calcularSubtotal() : 0;
  if (subtotal === 0) {
    exibirFeedbackCupom('error', '⚠️ Adicione produtos ao carrinho primeiro.');
    return;
  }

  // Verifica se o cupom existe no catálogo
  var cupomEncontrado = CUPONS_DISPONIVEIS[codigo];

  if (!cupomEncontrado) {
    exibirFeedbackCupom('error', '✗ Cupom inválido ou expirado.');
    cupomAtivo = null;
    if (typeof atualizarTotais === 'function') atualizarTotais();
    return;
  }

  // Aplica o cupom
  cupomAtivo = Object.assign({ codigo: codigo }, cupomEncontrado);

  // Atualiza a UI do campo
  input.value = codigo;
  input.disabled = true;

  var btn = document.getElementById('cupomBtn');
  if (btn) {
    btn.textContent = 'Remover';
    btn.onclick = removerCupom;
  }

  exibirFeedbackCupom('success', '✓ Cupom aplicado: ' + cupomAtivo.descricao);
  if (typeof atualizarTotais === 'function') atualizarTotais();
  if (typeof mostrarToast === 'function') mostrarToast('🎉 Cupom "' + codigo + '" aplicado!', 'success');
}

/* REMOVER CUPOM */
/**
 * Remove o cupom ativo e restaura o campo de input.
 * Chamada pelo onclick do botão "Remover" (após aplicar cupom).
 */
function removerCupom() {
  cupomAtivo = null;

  var input = document.getElementById('cupomInput');
  if (input) {
    input.value = '';
    input.disabled = false;
    input.focus();
  }

  var btn = document.getElementById('cupomBtn');
  if (btn) {
    btn.textContent = 'Aplicar';
    btn.onclick = aplicarCupom;
  }

  exibirFeedbackCupom('', '');

  if (typeof atualizarTotais === 'function') atualizarTotais();
  if (typeof mostrarToast === 'function') mostrarToast('Cupom removido.', 'info');
}

/* CÁLCULO DO DESCONTO DE PRODUTO */
/**
 * Retorna o valor do desconto sobre o subtotal dos produtos.
 * Chamada por atualizarTotais() em carrinho.js.
 * @param {number} subtotal - Subtotal atual do carrinho
 * @returns {number} Valor de desconto em R$
 */
function calcularDesconto(subtotal) {
  if (!cupomAtivo) return 0;
  if (cupomAtivo.tipo === 'percentual') {
    return subtotal * (cupomAtivo.valor / 100);
  }
  if (cupomAtivo.tipo === 'fixo') {
    // Não desconta mais do que o subtotal
    return Math.min(cupomAtivo.valor, subtotal);
  }

  // Tipo 'frete' não gera desconto no subtotal do produto
  return 0;
}
/** CÁLCULO DO DESCONTO DE FRETE */
/**
 * Retorna o valor do desconto aplicável sobre a taxa de entrega.
 * Chamada por atualizarTotais() em carrinho.js.
 * @returns {number} Valor de desconto de frete em R$
 */
function calcularDescontoFrete() {
  if (!cupomAtivo) return 0;

  if (cupomAtivo.tipo === 'frete') {
    // Desconta 100% do frete (taxaEntrega está em carrinho.js)
    return (typeof taxaEntrega !== 'undefined') ? taxaEntrega : 0;
  }

  return 0;
}
/* UI — Feedback visual do cupom */
/**
 * Exibe uma mensagem de feedback abaixo do campo de cupom.
 * @param {'success'|'error'|''} tipo
 * @param {string} mensagem
 */
function exibirFeedbackCupom(tipo, mensagem) {
  var el = document.getElementById('cupomFeedback');
  if (!el) return;

  el.textContent = mensagem;
  el.className = 'coupon-feedback' + (tipo ? ' ' + tipo : '');
}