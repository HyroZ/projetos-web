
/* ESTADO DO CARRINHO */
var carrinho = [];          // Array de itens { id, nome, preco, imagem, quantidade }
var taxaEntrega = 0;           // Taxa de entrega atual (R$)
var cepValido = false;       // Indicador de CEP validado com sucesso
var CART_KEY = 'testburguers_cart_v1';


/* INICIALIZAÃ‡ÃƒO */
/* Carrega o carrinho do localStorage e atualiza a UI */
function inicializarCarrinho() {
  carregarCarrinhoStorage();
  atualizarCarrinhoUI();
}

function carregarCarrinhoStorage() {
  try {
    var salvo = localStorage.getItem(CART_KEY);
    if (salvo) {
      var parsed = JSON.parse(salvo);
      if (Array.isArray(parsed)) {
        carrinho = parsed;
      }
    }
  } catch (e) {
    console.warn('Test burguers: Não foi possível carregar o carrinho do localStorage.', e);
    carrinho = [];
  }
}

function salvarCarrinhoStorage() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(carrinho));
  } catch (e) {
    console.warn('Test burguers: Não foi possível salvar o carrinho no localStorage.', e);
  }
}


/* OPERAÃ‡Ã•ES DO CARRINHO */

/**
 * Adiciona um produto ao carrinho.
 * Se jÃ¡ existir, incrementa a quantidade.
 */
function adicionarAoCarrinho(id, nome, preco, imagem) {
  var index = encontrarIndexProduto(id);

  if (index > -1) {
    carrinho[index].quantidade++;
  } else {
    carrinho.push({
      id: id,
      nome: nome,
      preco: parseFloat(preco),
      imagem: imagem,
      quantidade: 1
    });
  }

  salvarCarrinhoStorage();
  atualizarCarrinhoUI();
  animarBotaoCarrinho();
  atualizarBotaoProduto(id);

  mostrarToast('ðŸ›’ ' + nome + ' adicionado!', 'success');
}

/**
 * Remove um produto do carrinho pelo ID
 */
function removerDoCarrinho(id) {
  carrinho = carrinho.filter(function (item) { return item.id !== id; });

  salvarCarrinhoStorage();
  atualizarCarrinhoUI();
  atualizarBotaoProduto(id);
}

/**
 * Altera a quantidade de um item (delta pode ser +1 ou -1).
 * Remove o item se a quantidade chegar a 0.
 */
function alterarQuantidade(id, delta) {
  var index = encontrarIndexProduto(id);
  if (index === -1) return;

  carrinho[index].quantidade += delta;

  if (carrinho[index].quantidade <= 0) {
    removerDoCarrinho(id);
    return;
  }

  salvarCarrinhoStorage();
  atualizarCarrinhoUI();
  atualizarBotaoProduto(id);
}

/**
 * Limpa todo o carrinho
 */
function limparCarrinho() {
  carrinho = [];
  taxaEntrega = 0;

  // Reseta cupom (definido em cupons.js)
  if (typeof cupomAtivo !== 'undefined') cupomAtivo = null;

  salvarCarrinhoStorage();

  // Reseta campo de CEP e endereÃ§o
  var cepInput = document.getElementById('cepInput');
  var logradouroIn = document.getElementById('logradouroInput');
  var bairroFoundIn = document.getElementById('bairroEncontrado');
  var cepFeedback = document.getElementById('cepFeedback');

  if (cepInput) cepInput.value = '';
  if (logradouroIn) logradouroIn.value = '';
  if (bairroFoundIn) bairroFoundIn.value = '';
  if (cepFeedback) {
    cepFeedback.textContent = '';
    cepFeedback.className = 'cep-feedback';
  }

  // Reseta campo de cupom
  var cupomInput = document.getElementById('cupomInput');
  if (cupomInput) {
    cupomInput.value = '';
    cupomInput.disabled = false;
  }

  var cupomBtn = document.getElementById('cupomBtn');
  if (cupomBtn) {
    cupomBtn.textContent = 'Aplicar';
    cupomBtn.onclick = aplicarCupom;
  }

  var cupomFeedback = document.getElementById('cupomFeedback');
  if (cupomFeedback) {
    cupomFeedback.textContent = '';
    cupomFeedback.className = 'coupon-feedback';
  }

  atualizarCarrinhoUI();
}


/* CÃLCULOS */
/** Retorna o subtotal (sem entrega e sem desconto) */
function calcularSubtotal() {
  return carrinho.reduce(function (total, item) {
    return total + (item.preco * item.quantidade);
  }, 0);
}
/** Retorna o total de itens (somando quantidades) */
function totalItensCarrinho() {
  return carrinho.reduce(function (acc, item) { return acc + item.quantidade; }, 0);
}

/**
 * Atualiza a taxa de entrega com base no bairro selecionado
 * e sincroniza o campo de bairro no formulÃ¡rio.
 */
function atualizarEntrega(bairro) {
  if (!bairro || typeof bairro !== 'string' || bairro.trim() === '') {
    taxaEntrega = 0;
    cepValido = false;
    atualizarTotais();
    return;
  }

  var bairroNormalizado = normalizarBairro(bairro);
  taxaEntrega = calcularTaxaPorBairro(bairroNormalizado);
  cepValido = true;

  // Se existir um campo de bairro oculto, atualiza para manter o valor no form
  var bairroInput = document.getElementById('clienteBairro');
  if (bairroInput) {
    bairroInput.value = bairro;
  }

  atualizarTotais();
}

function normalizarBairro(bairro) {
  return bairro
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ç/g, 'c')
    .replace(/ã/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function calcularTaxaPorBairro(bairro) {
  var proximos = new Set([
    'santa rita i',
    'santa rita 1',
    'santa rita ii',
    'sao judas',
    'sao jose',
    'maracana',
    'jardim olimpico',
    'delfino magalhaes',
    'santos reis',
    'vila exposicao',
    'monte carmelo'
  ]);

  var isProximo = proximos.has(bairro);
  return isProximo ? 3 : 8;
}

function buscarCep(cep) {
  var feedback = document.getElementById('cepFeedback');
  var logradouroIn = document.getElementById('logradouroInput');
  var bairroFoundIn = document.getElementById('bairroEncontrado');

  if (feedback) {
    feedback.textContent = 'Buscando endereÃ§o...';
    feedback.className = 'cep-feedback';
  }

  fetch('https://viacep.com.br/ws/' + cep + '/json/')
    .then(function (response) {
      if (!response.ok) {
        throw new Error('NÃ£o foi possÃ­vel consultar o CEP.');
      }
      return response.json();
    })
    .then(function (data) {
      if (data.erro) {
        throw new Error('CEP nÃ£o encontrado.');
      }

      if (logradouroIn) logradouroIn.value = data.logradouro || '';
      if (bairroFoundIn) bairroFoundIn.value = data.bairro || '';

      if (data.bairro) {
        if (feedback) {
          feedback.textContent = 'CEP encontrado. Bairro identificado automaticamente.';
          feedback.className = 'cep-feedback success';
        }
        atualizarEntrega(data.bairro);
      } else {
        if (feedback) {
          feedback.textContent = 'CEP encontrado, mas o bairro nÃ£o foi retornado. Frete padrÃ£o aplicado.';
          feedback.className = 'cep-feedback error';
        }
        atualizarEntrega('');
      }
    })
    .catch(function (error) {
      limparEnderecoCep();
      if (feedback) {
        feedback.textContent = 'CEP invÃ¡lido ou nÃ£o encontrado. Verifique e tente novamente.';
        feedback.className = 'cep-feedback error';
      }
    });
}

function limparEnderecoCep() {
  var logradouroIn = document.getElementById('logradouroInput');
  var bairroFoundIn = document.getElementById('bairroEncontrado');

  if (logradouroIn) logradouroIn.value = '';
  if (bairroFoundIn) bairroFoundIn.value = '';

  taxaEntrega = 0;
  cepValido = false;
  atualizarTotais();
}

function formatarCep(event) {
  var input = event.target;
  var valor = input.value.replace(/\D/g, '');

  if (valor.length > 5) {
    valor = valor.slice(0, 5) + '-' + valor.slice(5, 8);
  }

  input.value = valor;

  var feedback = document.getElementById('cepFeedback');
  if (valor.length === 9) {
    if (feedback) {
      feedback.textContent = 'Consultando CEP...';
      feedback.className = 'cep-feedback';
    }
    buscarCep(valor);
    return;
  }

  if (cepValido) {
    limparEnderecoCep();
  }

  if (feedback) {
    feedback.textContent = 'Digite o CEP completo para consultar.';
    feedback.className = 'cep-feedback';
  }
}

/** Recalcula e atualiza os valores exibidos no resumo */
function atualizarTotais() {
  var subtotal = calcularSubtotal();

  // Desconto de produto (% ou fixo) â€” definido em cupons.js
  var desconto = (typeof calcularDesconto === 'function') ? calcularDesconto(subtotal) : 0;
  // Desconto de frete â€” definido em cupons.js
  var descontoFrete = (typeof calcularDescontoFrete === 'function') ? calcularDescontoFrete() : 0;

  var entregaFinal = Math.max(0, taxaEntrega - descontoFrete);
  var total = Math.max(0, subtotal - desconto + entregaFinal);

  // Elementos
  var elSubtotal = document.getElementById('cartSubtotal');
  var elEntrega = document.getElementById('cartEntrega');
  var elTotal = document.getElementById('cartTotal');
  var elDescontoRow = document.getElementById('descontoRow');
  var elDesconto = document.getElementById('cartDesconto');

  if (elSubtotal) elSubtotal.textContent = formatarMoeda(subtotal);
  if (elTotal) elTotal.textContent = formatarMoeda(total);

  // Entrega
  if (elEntrega) {
    elEntrega.textContent = (taxaEntrega === 0 && entregaFinal === 0)
      ? 'A calcular'
      : (entregaFinal === 0 ? 'GrÃ¡tis ðŸŽ‰' : formatarMoeda(entregaFinal));
  }

  // Linha de desconto
  if (elDescontoRow && elDesconto) {
    var descontoTotal = desconto + descontoFrete;
    if (descontoTotal > 0) {
      elDescontoRow.style.display = 'flex';
      elDesconto.textContent = 'â€” ' + formatarMoeda(descontoTotal);
    } else {
      elDescontoRow.style.display = 'none';
    }
  }
}


/* RENDERIZAÃ‡ÃƒO DA UI DO CARRINHO */

/**
 * Atualiza todos os elementos da interface do carrinho:
 * badge, lista de itens, seÃ§Ãµes visÃ­veis, totais.
 */
function atualizarCarrinhoUI() {
  var totalItens = totalItensCarrinho();

  // ---- Badge do Ã­cone ----
  var badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = totalItens;
    if (totalItens > 0) {
      badge.classList.add('active');
    } else {
      badge.classList.remove('active');
    }
  }

  // ---- Elementos que dependem de o carrinho estar vazio ou nÃ£o ----
  var elEmpty = document.getElementById('cartEmpty');
  var elItems = document.getElementById('cartItems');
  var elCoupon = document.getElementById('cartCoupon');
  var elDelivery = document.getElementById('cartDelivery');
  var elSummary = document.getElementById('cartSummary');
  var elForm = document.getElementById('cartForm');

  if (!elItems) return; // Se o DOM do carrinho nÃ£o existir, encerra

  if (carrinho.length === 0) {
    // --- Estado vazio ---
    if (elEmpty) elEmpty.style.display = 'flex';
    if (elCoupon) elCoupon.style.display = 'none';
    if (elDelivery) elDelivery.style.display = 'none';
    if (elSummary) elSummary.style.display = 'none';
    if (elForm) elForm.style.display = 'none';
    elItems.innerHTML = '';

  } else {
    // --- Carrinho com itens ---
    if (elEmpty) elEmpty.style.display = 'none';
    if (elCoupon) elCoupon.style.display = 'block';
    if (elDelivery) elDelivery.style.display = 'block';
    if (elSummary) elSummary.style.display = 'flex';
    if (elForm) elForm.style.display = 'block';

    elItems.innerHTML = carrinho.map(function (item) {
      return renderizarItemCarrinho(item);
    }).join('');
  }

  atualizarTotais();
}

/**
 * Gera o HTML de um item do carrinho
 * @param {Object} item
 * @returns {string} HTML string
 */
function renderizarItemCarrinho(item) {
  var subtotalItem = item.preco * item.quantidade;
  var imgFallback = 'data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%2260%22 height%3D%2256%22%3E%3Crect width%3D%22100%25%22 height%3D%22100%25%22 fill%3D%22%236B0010%22%2F%3E%3Ctext x%3D%2250%25%22 y%3D%2250%25%22 dominant-baseline%3D%22middle%22 text-anchor%3D%22middle%22 fill%3D%22white%22 font-size%3D%2224%22%3E%F0%9F%8D%94%3C%2Ftext%3E%3C%2Fsvg%3E';

  return '<div class="cart-item" data-id="' + item.id + '">' +
    '<div class="cart-item-img">' +
    '<img src="' + item.imagem + '" alt="' + item.nome + '" loading="lazy" ' +
    'onerror="this.src=\'' + imgFallback + '\'">' +
    '</div>' +
    '<div class="cart-item-info">' +
    '<div class="cart-item-name">' + item.nome + '</div>' +
    '<div class="cart-item-price">' + formatarMoeda(item.preco) + ' cada</div>' +
    '<div class="cart-item-controls">' +
    '<button class="qty-btn" onclick="alterarQuantidade(' + item.id + ', -1)" ' +
    'aria-label="Diminuir quantidade de ' + item.nome + '">âˆ’</button>' +
    '<span class="qty-value">' + item.quantidade + '</span>' +
    '<button class="qty-btn" onclick="alterarQuantidade(' + item.id + ', 1)" ' +
    'aria-label="Aumentar quantidade de ' + item.nome + '">+</button>' +
    '</div>' +
    '</div>' +
    '<div class="cart-item-subtotal">' +
    '<span>' + formatarMoeda(subtotalItem) + '</span>' +
    '<button class="remove-btn" onclick="removerDoCarrinho(' + item.id + ')" ' +
    'aria-label="Remover ' + item.nome + ' do carrinho">âœ•</button>' +
    '</div>' +
    '</div>';
}


/* ABRIR / FECHAR SIDEBAR */
function abrirCarrinho() {
  var sidebar = document.getElementById('cartSidebar');
  var overlay = document.getElementById('cartOverlay');

  if (sidebar) {
    sidebar.classList.add('open');
    sidebar.removeAttribute('aria-hidden');
  }
  if (overlay) {
    overlay.classList.add('active');
    overlay.removeAttribute('aria-hidden');
  }
  document.body.style.overflow = 'hidden';
}

function fecharCarrinho() {
  var sidebar = document.getElementById('cartSidebar');
  var overlay = document.getElementById('cartOverlay');

  if (sidebar) {
    sidebar.classList.remove('open');
    sidebar.setAttribute('aria-hidden', 'true');
  }
  if (overlay) {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
  }

  // SÃ³ libera o overflow se o menu mobile tambÃ©m estiver fechado
  var navLinks = document.getElementById('navLinks');
  if (!navLinks || !navLinks.classList.contains('open')) {
    document.body.style.overflow = '';
  }
}


/* ----------------------------------------------------------
   BOTÃƒO DO PRODUTO â€” ATUALIZA ESTADO NO GRID
   ---------------------------------------------------------- */
/**
 * Atualiza o botÃ£o "Adicionar" de um produto com base no carrinho atual.
 * Se o item estiver no carrinho, exibe a quantidade e muda a cor.
 * @param {number} id - ID do produto
 */
function atualizarBotaoProduto(id) {
  // Busca em destaquesGrid e produtosGrid
  var seletores = [
    '[data-produto-id="' + id + '"] .add-btn'
  ];

  seletores.forEach(function (seletor) {
    var botoes = document.querySelectorAll(seletor);
    botoes.forEach(function (btn) {
      var itemNoCarrinho = carrinho.find(function (i) { return i.id === id; });

      if (itemNoCarrinho) {
        btn.innerHTML = '<span class="qty-indicator">' + itemNoCarrinho.quantidade + '</span> No Carrinho';
        btn.classList.add('in-cart');
      } else {
        btn.innerHTML =
          '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" ' +
          'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>' +
          '<line x1="3" y1="6" x2="21" y2="6"/>' +
          '<path d="M16 10a4 4 0 01-8 0"/>' +
          '</svg> Adicionar';
        btn.classList.remove('in-cart');
      }
    });
  });
}


/* ----------------------------------------------------------
   ANIMAÃ‡ÃƒO DO ÃCONE DO CARRINHO
   ---------------------------------------------------------- */
function animarBotaoCarrinho() {
  var btn = document.getElementById('cartBtn');
  if (!btn) return;

  btn.classList.add('bounce');
  setTimeout(function () {
    btn.classList.remove('bounce');
  }, 700);
}


/* ----------------------------------------------------------
   HELPERS INTERNOS
   ---------------------------------------------------------- */
function encontrarIndexProduto(id) {
  for (var i = 0; i < carrinho.length; i++) {
    if (carrinho[i].id === id) return i;
  }
  return -1;
}

/** Helper de formataÃ§Ã£o de moeda (reutiliza o do app.js se disponÃ­vel) */
function formatarMoeda(valor) {
  if (typeof window.formatarMoeda === 'function') {
    return window.formatarMoeda(valor);
  }
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

