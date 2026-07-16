/* 
   TEST BURGERS — app.js
   Orquestração principal da aplicação
   Inicialização, Navbar, Scroll, Animações, Utilitários
*/

/* INICIALIZAÇÃO DA APLICAÇÃO */
document.addEventListener('DOMContentLoaded', function () {
  inicializarApp();
});

function inicializarApp() {
  // Módulos principais
  inicializarNavbar();
  inicializarHamburger();
  inicializarScrollReveal();
  inicializarBackToTop();
  inicializarMascarasTelefone();
  inicializarSmoothScroll();

  // Carrinho (definido em carrinho.js)
  inicializarCarrinho();

  // Produtos (definido em produtos.js)
  carregarProdutos();

  // Eventos do carrinho
  vincularEventosCarrinho();

  // Fechar tudo com Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      fecharCarrinho();
      fecharMenu();
    }
  });
}

/* EVENTOS DO CARRINHO */
function vincularEventosCarrinho() {
  const cartBtn = document.getElementById('cartBtn');
  const cartClose = document.getElementById('cartClose');
  const cartOverlay = document.getElementById('cartOverlay');

  if (cartBtn) cartBtn.addEventListener('click', abrirCarrinho);
  if (cartClose) cartClose.addEventListener('click', fecharCarrinho);
  if (cartOverlay) cartOverlay.addEventListener('click', fecharCarrinho);
}

/* NAVBAR — scroll + link ativo */
function inicializarNavbar() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');

  if (!navbar) return;

  // Aplica classe .scrolled quando a página rola
  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Realça o link da seção visível
    destacarLinkAtivo(sections);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Executa uma vez para definir estado inicial
  onScroll();
}

function destacarLinkAtivo(sections) {
  const scrollY = window.scrollY + 100;

  sections.forEach(function (section) {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    const link = document.querySelector('.nav-link[href="#' + sectionId + '"]');

    if (!link) return;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      document.querySelectorAll('.nav-link').forEach(function (l) {
        l.classList.remove('active');
      });
      link.classList.add('active');
    }
  });
}

/* MENU HAMBÚRGUER (MOBILE) */
function inicializarHamburger() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navOverlay = document.getElementById('navOverlay');

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleMenu);
  if (navOverlay) navOverlay.addEventListener('click', fecharMenu);
}

function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  const hamburgerBtn = document.getElementById('hamburgerBtn');

  if (!navLinks) return;

  const estaAberto = navLinks.classList.contains('open');

  if (estaAberto) {
    fecharMenu();
  } else {
    abrirMenu();
  }
}

function abrirMenu() {
  const navLinks = document.getElementById('navLinks');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navOverlay = document.getElementById('navOverlay');

  if (navLinks) navLinks.classList.add('open');
  if (hamburgerBtn) {
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
  }
  if (navOverlay) {
    navOverlay.classList.add('active');
    navOverlay.removeAttribute('aria-hidden');
  }
  document.body.style.overflow = 'hidden';
}

function fecharMenu() {
  const navLinks = document.getElementById('navLinks');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navOverlay = document.getElementById('navOverlay');

  if (navLinks) navLinks.classList.remove('open');
  if (hamburgerBtn) {
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }
  if (navOverlay) {
    navOverlay.classList.remove('active');
    navOverlay.setAttribute('aria-hidden', 'true');
  }

  // Só libera o overflow se o carrinho também estiver fechado
  const cartSidebar = document.getElementById('cartSidebar');
  if (!cartSidebar || !cartSidebar.classList.contains('open')) {
    document.body.style.overflow = '';
  }
}


/* SCROLL SUAVE (SMOOTH SCROLL) */
function inicializarSmoothScroll() {
  // Aplica scroll suave a todos os links âncora internos
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#!') return;

      const alvo = document.querySelector(href);
      if (!alvo) return;

      e.preventDefault();
      scrollToSection(alvo.id);
    });
  });
}

/**
 * Rola suavemente até uma seção pelo ID
 * @param {string} id - ID da seção de destino
 */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;

  const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;
  const offsetTop = el.getBoundingClientRect().top + window.scrollY - navH - 8;

  window.scrollTo({ top: offsetTop, behavior: 'smooth' });
}

/* BOTÃO VOLTAR AO TOPO */
function inicializarBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 420) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ANIMAÇÕES DE SCROLL (IntersectionObserver) */
function inicializarScrollReveal() {
  // Verifica suporte ao IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    // Fallback: exibe todos os elementos de uma vez
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('revealed');
    });
    return;
  }

  const observador = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observador.unobserve(entry.target); // Anima apenas uma vez
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -48px 0px'
    }
  );

  document.querySelectorAll('.reveal').forEach(function (el) {
    observador.observe(el);
  });
}

/**
 * Reinicializa o ScrollReveal para elementos adicionados dinamicamente
 * (chamado após renderizar produtos)
 */
function reobservarElementos() {
  if (!('IntersectionObserver' in window)) return;

  const observador = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observador.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  document.querySelectorAll('.reveal:not(.revealed)').forEach(function (el) {
    observador.observe(el);
  });
}

/* MÁSCARA DE TELEFONE */
function inicializarMascarasTelefone() {
  const campo = document.getElementById('clienteTelefone');
  if (!campo) return;

  campo.addEventListener('input', function () {
    let valor = this.value.replace(/\D/g, '');

    // Limita a 11 dígitos
    if (valor.length > 11) valor = valor.slice(0, 11);

    // Formata: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    if (valor.length >= 7) {
      valor = '(' + valor.slice(0, 2) + ') ' + valor.slice(2, 7) + '-' + valor.slice(7);
    } else if (valor.length >= 3) {
      valor = '(' + valor.slice(0, 2) + ') ' + valor.slice(2);
    } else if (valor.length >= 1) {
      valor = '(' + valor;
    }

    this.value = valor;
  });

  // Previne letras no campo de número
  campo.addEventListener('keypress', function (e) {
    if (!/[\d\s()\-+]/.test(e.key)) e.preventDefault();
  });
}

/* SISTEMA DE TOAST / NOTIFICAÇÕES */
let toastTimer = null;

/**
 * Exibe uma notificação toast
 * @param {string} mensagem  - Texto da mensagem
 * @param {'success'|'error'|'info'} tipo - Tipo de notificação
 * @param {number} duracao   - Duração em ms (padrão: 3000)
 */
function mostrarToast(mensagem, tipo, duracao) {
  tipo = tipo || 'success';
  duracao = duracao || 3000;

  const toast = document.getElementById('toast');
  if (!toast) return;

  // Cancela toast anterior se existir
  if (toastTimer) clearTimeout(toastTimer);

  toast.textContent = mensagem;
  toast.className = 'toast toast-' + tipo + ' show';

  toastTimer = setTimeout(function () {
    toast.classList.remove('show');
  }, duracao);
}

/* UTILITÁRIO — Formatar moeda BRL */
/**
 * Formata número para moeda brasileira
 * @param {number} valor
 * @returns {string} Ex: "R$ 32,90"
 */
function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

/* UTILITÁRIO — Debounce */
function debounce(fn, espera) {
  let timer;
  return function () {
    const args = arguments;
    const contexto = this;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(contexto, args);
    }, espera);
  };
}