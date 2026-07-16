/* ==========================================================
   TEST BURGERS — produtos.js
   Carrega produtos de produtos.json e renderiza o grid
   ========================================================== */

var produtosGlobais = [];

/** Carrega produtos do arquivo JSON e renderiza os grids */
function carregarProdutos() {
  var destaquesGrid = document.getElementById('destaquesGrid');
  var produtosGrid = document.getElementById('produtosGrid');

  if (destaquesGrid) {
    destaquesGrid.innerHTML = '<div class="loading-produtos"><div class="spinner" aria-label="Carregando produtos"></div><p>Carregando destaques...</p></div>';
  }
  if (produtosGrid) {
    produtosGrid.innerHTML = '<div class="loading-produtos"><div class="spinner" aria-label="Carregando cardápio"></div><p>Carregando cardápio...</p></div>';
  }

  fetch('produtos.json', { cache: 'no-cache' })
    .then(function (res) {
      if (!res.ok) throw new Error('Falha ao buscar produtos.json');
      return res.json();
    })
    .then(function (data) {
      if (!Array.isArray(data)) data = [];
      produtosGlobais = data;
      renderizarDestaques(produtosGlobais);
      renderizarProdutos(produtosGlobais);

      // Atualiza estado de botões do carrinho caso já existam itens
      if (typeof atualizarBotaoProduto === 'function') {
        produtosGlobais.forEach(function (p) { atualizarBotaoProduto(p.id); });
      }

      // Re-observa animações para elementos dinâmicos
      if (typeof reobservarElementos === 'function') reobservarElementos();
    })
    .catch(function (err) {
      console.error('Erro ao carregar produtos:', err);
      if (destaquesGrid) destaquesGrid.innerHTML = '<p>Não foi possível carregar os destaques.</p>';
      if (produtosGrid) produtosGrid.innerHTML = '<p>Não foi possível carregar o cardápio.</p>';
    });
}

/** Renderiza os produtos em destaque no grid de destaques */
function renderizarDestaques(produtos) {
  var container = document.getElementById('destaquesGrid');
  if (!container) return;

  var destaques = produtos.filter(function (p) { return !!p.destaque; });

  if (destaques.length === 0) {
    container.innerHTML = '<p>Sem destaques no momento.</p>';
    return;
  }

  container.innerHTML = destaques.map(function (p) {
    return '' +
      '<article class="produto-card destaque reveal" data-produto-id="' + p.id + '">' +
      '<div class="produto-img"><img src="' + p.imagem + '" alt="' + p.nome + '" loading="lazy"></div>' +
      '<div class="produto-body">' +
      '<h3 class="produto-nome">' + p.nome + '</h3>' +
      '<p class="produto-desc">' + p.descricao + '</p>' +
      '<div class="produto-footer">' +
      '<span class="produto-preco">' + (typeof formatarMoeda === 'function' ? formatarMoeda(p.preco) : p.preco) + '</span>' +
      '<button class="add-btn" onclick="adicionarProdutoPorId(' + p.id + ')">' +
      '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>' +
      '<line x1="3" y1="6" x2="21" y2="6"/>' +
      '<path d="M16 10a4 4 0 01-8 0"/>' +
      '</svg> Adicionar' +
      '</button>' +
      '</div>' +
      '</div>' +
      '</article>';
  }).join('');
}

/** Renderiza todos os produtos no grid do cardápio */
function renderizarProdutos(produtos) {
  var container = document.getElementById('produtosGrid');
  if (!container) return;

  if (!produtos || produtos.length === 0) {
    container.innerHTML = '<p>Cardápio vazio.</p>';
    return;
  }

  container.innerHTML = produtos.map(function (p) {
    return '' +
      '<article class="produto-card reveal" data-produto-id="' + p.id + '" data-categoria="' + (p.categoria || '') + '">' +
      '<div class="produto-img"><img src="' + p.imagem + '" alt="' + p.nome + '" loading="lazy"></div>' +
      '<div class="produto-body">' +
      '<h3 class="produto-nome">' + p.nome + '</h3>' +
      '<p class="produto-desc">' + p.descricao + '</p>' +
      '<div class="produto-footer">' +
      '<span class="produto-preco">' + (typeof formatarMoeda === 'function' ? formatarMoeda(p.preco) : p.preco) + '</span>' +
      '<button class="add-btn" onclick="adicionarProdutoPorId(' + p.id + ')">' +
      '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>' +
      '<line x1="3" y1="6" x2="21" y2="6"/>' +
      '<path d="M16 10a4 4 0 01-8 0"/>' +
      '</svg> Adicionar' +
      '</button>' +
      '</div>' +
      '</div>' +
      '</article>';
  }).join('');
}

/** Adiciona produto ao carrinho por ID (usa produtosGlobais) */
function adicionarProdutoPorId(id) {
  var produto = produtosGlobais.find(function (p) { return p.id === id; });
  if (!produto) return mostrarToast && mostrarToast('Produto não encontrado', 'error');
  if (typeof adicionarAoCarrinho === 'function') {
    adicionarAoCarrinho(produto.id, produto.nome, produto.preco, produto.imagem);
  }
}

/** Filtra produtos por categoria e atualiza o grid */
function filtrarPorCategoria(categoria) {
  var filtros = document.querySelectorAll('.filter-btn');
  filtros.forEach(function (btn) {
    if (btn.dataset && btn.dataset.categoria === categoria) {
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    }
  });

  var produtosFiltrados = produtosGlobais.filter(function (p) {
    if (!categoria || categoria === 'todos') return true;
    return p.categoria === categoria;
  });

  renderizarProdutos(produtosFiltrados);

  // Atualiza botões do carrinho para os produtos visíveis
  if (typeof atualizarBotaoProduto === 'function') {
    produtosFiltrados.forEach(function (p) { atualizarBotaoProduto(p.id); });
  }

  // Sincroniza aria-labelledby do painel de produtos com a aba ativa
  var painel = document.getElementById('produtos-panel');
  if (painel) {
    var ativo = document.querySelector('.filter-btn[aria-selected="true"]');
    if (ativo && ativo.id) painel.setAttribute('aria-labelledby', ativo.id);
  }

  // Re-observa animações
  if (typeof reobservarElementos === 'function') reobservarElementos();
}
