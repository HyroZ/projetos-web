/* Geração da mensagem de pedido e integração com WhatsApp */

/* CONFIGURAÇÃO */
var WHATSAPP_NUMERO = '99999999'; // Número da hamburgueria com DDI

/* FINALIZAR PEDIDO (chamada pelo botão) */
/**
 * Valida o formulário, gera a mensagem e abre o WhatsApp.
 * Chamada pelo onclick do botão "Finalizar Pedido".
 */
function finalizarPedido() {
  // 1. Verifica se o carrinho tem itens
  if (!carrinho || carrinho.length === 0) {
    mostrarToast('⚠️ Adicione produtos à sacola primeiro!', 'error');
    return;
  }

  // 2. Remove destaque de erro de campos anteriores
  limparErrosFormulario();

  // 3. Valida campos obrigatórios
  var camposObrigatorios = [
    { id: 'clienteNome', label: 'Nome Completo' },
    { id: 'clienteTelefone', label: 'Telefone' },
    { id: 'clienteNumero', label: 'Número' }
  ];

  for (var i = 0; i < camposObrigatorios.length; i++) {
    var campo = camposObrigatorios[i];
    var el = document.getElementById(campo.id);
    if (!el || el.value.trim() === '') {
      marcarCampoErro(el);
      mostrarToast('⚠️ Preencha o campo: ' + campo.label, 'error');
      if (el) el.focus();
      return;
    }
  }

  // 4. Valida se o CEP foi verificado corretamente
  if (typeof cepValido === 'undefined' || !cepValido) {
    mostrarToast('⚠️ Informe um CEP válido para calcular o frete.', 'error');
    var cepInput = document.getElementById('cepInput');
    if (cepInput) cepInput.focus();
    return;
  }

  // 5. Valida forma de pagamento
  var pagamentoEl = document.querySelector('input[name="pagamento"]:checked');
  if (!pagamentoEl) {
    mostrarToast('⚠️ Selecione a forma de pagamento!', 'error');
    // Scroll até a seção de pagamento
    var paySection = document.querySelector('.payment-section');
    if (paySection) paySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // 6. Gera e envia a mensagem
  var mensagem = gerarMensagemPedido(pagamentoEl.value);
  var url = 'https://wa.me/' + WHATSAPP_NUMERO + '?text=' + encodeURIComponent(mensagem);

  // Abre o WhatsApp em nova aba
  window.open(url, '_blank');

  // 7. Confirma limpeza do pedido após envio
  setTimeout(function () {
    var confirmou = window.confirm(
      '✅ Pedido enviado ao WhatsApp!\n\nDeseja limpar a sacola e começar um novo pedido?'
    );
    if (confirmou) {
      limparCarrinho();
      limparFormularioPedido();
      fecharCarrinho();
      mostrarToast('🎉 Novo pedido pronto para começar!', 'success');
    }
  }, 800);
}


/* GERAÇÃO DA MENSAGEM WHATSAPP */
/**
 * Monta a string formatada do pedido para envio via WhatsApp.
 * @param {string} formaPagamento - 'PIX' | 'CARTÃO' | 'DINHEIRO'
 * @returns {string} Mensagem formatada
 */
function gerarMensagemPedido(formaPagamento) {
  // Dados do cliente
  var nome = obterValorCampo('clienteNome');
  var telefone = obterValorCampo('clienteTelefone');
  var logradouro = obterValorCampo('logradouroInput');
  var numero = obterValorCampo('clienteNumero');
  var complemento = obterValorCampo('clienteComplemento');
  var bairro = obterValorCampo('bairroEncontrado');

  // Cálculos
  var subtotal = calcularSubtotal();
  var desconto = (typeof calcularDesconto === 'function') ? calcularDesconto(subtotal) : 0;
  var descontoFrete = (typeof calcularDescontoFrete === 'function') ? calcularDescontoFrete() : 0;
  var entregaFinal = Math.max(0, taxaEntrega - descontoFrete);
  var total = Math.max(0, subtotal - desconto + entregaFinal);

  // Endereço completo montado a partir do CEP
  var enderecoCompleto = logradouro ? logradouro + ', ' + numero : numero;
  if (complemento) enderecoCompleto += ', ' + complemento;
  enderecoCompleto += ' — ' + bairro;

  // Lista de itens
  var itensFormatados = carrinho.map(function (item) {
    var subtotalItem = item.preco * item.quantidade;
    return '  ' + item.quantidade + 'x ' + item.nome +
      ' (' + formatarMoeda(item.preco) + ') = ' + formatarMoeda(subtotalItem);
  }).join('\n');

  // Horário atual
  var agora = new Date();
  var horario = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  var dataHoje = agora.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // Monta a mensagem
  var msg = '';
  msg += '🍔 *NOVO PEDIDO — TEST BURGERS* 🍔\n';
  msg += '━━━━━━━━━━━━━━━━━━━━━━\n';
  msg += '👤 *Cliente:* ' + nome + '\n';
  msg += '📱 *Telefone:* ' + telefone + '\n';
  msg += '📍 *Endereço:* ' + enderecoCompleto + '\n';
  msg += '━━━━━━━━━━━━━━━━━━━━━━\n';
  msg += '🛒 *Itens do Pedido:*\n';
  msg += itensFormatados + '\n';
  msg += '━━━━━━━━━━━━━━━━━━━━━━\n';
  msg += '💰 *Subtotal:* ' + formatarMoeda(subtotal) + '\n';

  // Desconto (se houver)
  var descontoTotal = desconto + descontoFrete;
  if (descontoTotal > 0 && typeof cupomAtivo !== 'undefined' && cupomAtivo) {
    msg += '🎁 *Desconto (' + cupomAtivo.codigo + '):* -' + formatarMoeda(descontoTotal) + '\n';
  }

  // Entrega
  if (entregaFinal === 0 && taxaEntrega > 0) {
    msg += '🚴 *Entrega:* GRÁTIS (cupom frete) 🎉\n';
  } else {
    msg += '🚴 *Entrega:* ' + formatarMoeda(entregaFinal) + '\n';
  }

  msg += '💵 *TOTAL: ' + formatarMoeda(total) + '*\n';
  msg += '━━━━━━━━━━━━━━━━━━━━━━\n';
  msg += '💳 *Pagamento:* ' + formaPagamento + '\n';

  // Troco (apenas para dinheiro)
  if (formaPagamento === 'DINHEIRO') {
    var trocoEl = document.getElementById('trocoValor');
    if (trocoEl && trocoEl.value && parseFloat(trocoEl.value) > 0) {
      var trocoParaQuanto = parseFloat(trocoEl.value);
      var trocoValor = trocoParaQuanto - total;
      msg += '💵 *Troco para:* ' + formatarMoeda(trocoParaQuanto);
      if (trocoValor > 0) {
        msg += ' *(troco: ' + formatarMoeda(trocoValor) + ')*';
      }
      msg += '\n';
    } else {
      msg += '💵 *Troco:* sem troco\n';
    }
  }

  msg += '━━━━━━━━━━━━━━━━━━━━━━\n';
  msg += '📅 *Data:* ' + dataHoje + ' às ' + horario + '\n';
  msg += '\n_Pedido realizado pelo site Test Burgers_ 🔥';

  return msg;
}
/* CONTROLE DO CAMPO "TROCO" */
/**
 * Exibe ou oculta o campo de troco conforme a forma de pagamento.
 * Chamada pelo onchange dos radio buttons de pagamento.
 */
function verificarPagamento() {
  var pagamentoEl = document.querySelector('input[name="pagamento"]:checked');
  var trocoField = document.getElementById('trocoField');

  if (!trocoField) return;
  if (pagamentoEl && pagamentoEl.value === 'DINHEIRO') {
    trocoField.style.display = 'block';
  } else {
    trocoField.style.display = 'none';
    // Limpa o valor quando não for dinheiro
    var trocoInput = document.getElementById('trocoValor');
    if (trocoInput) trocoInput.value = '';
  }
}


/* LIMPEZA DO FORMULÁRIO */
function limparFormularioPedido() {
  var campos = [
    'clienteNome',
    'clienteTelefone',
    'clienteNumero',
    'clienteComplemento',
    'trocoValor'
  ];

  campos.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.value = '';
  });

  // Desmarca todos os radio buttons de pagamento
  var radios = document.querySelectorAll('input[name="pagamento"]');
  radios.forEach(function (r) { r.checked = false; });

  // Oculta campo de troco
  var trocoField = document.getElementById('trocoField');
  if (trocoField) trocoField.style.display = 'none';

  // Remove marcações de erro
  limparErrosFormulario();
}


/* VALIDAÇÃO — helpers visuais */
function marcarCampoErro(el) {
  if (!el) return;
  var grupo = el.closest('.form-group');
  if (grupo) grupo.classList.add('error');
  el.addEventListener('input', function limpar() {
    if (grupo) grupo.classList.remove('error');
    el.removeEventListener('input', limpar);
  }, { once: true });
}

function limparErrosFormulario() {
  document.querySelectorAll('.form-group.error').forEach(function (g) {
    g.classList.remove('error');
  });
}

/* HELPER INTERNO */
function obterValorCampo(id) {
  var el = document.getElementById(id);
  return el ? el.value.trim() : '';
}
/** Reutiliza formatarMoeda do contexto global */
function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}