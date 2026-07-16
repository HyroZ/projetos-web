
// Page loader 
window.addEventListener('load', () => {
  const loader = document.querySelector('.page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 350);
  }
});

// Menu mobile
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Toasts 
const toastStack = document.querySelector('.toast-stack');

function showToast({ type = 'success', title, message, duration = 3200 }) {
  if (!toastStack) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="dot"></span>
    <div>
      <strong>${title}</strong>
      <span>${message}</span>
    </div>
    <button aria-label="Fechar aviso">&times;</button>
  `;

  const remove = () => {
    toast.classList.add('leaving');
    setTimeout(() => toast.remove(), 250);
  };

  toast.querySelector('button').addEventListener('click', remove);
  toastStack.appendChild(toast);
  setTimeout(remove, duration);
}

// Carrinho 
let cartCount = 0;
const cartBadge = document.querySelector('.cart-count .badge');

function updateCartBadge() {
  if (cartBadge) cartBadge.textContent = cartCount;
}

document.querySelectorAll('[data-add-to-cart]').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.getAttribute('data-add-to-cart');
    cartCount += 1;
    updateCartBadge();
    showToast({
      type: 'success',
      title: 'Adicionado ao carrinho',
      message: name,
    });
  });
});

// Skeleton loading 
function revealProducts(grid) {
  const skeletons = grid.querySelectorAll('.skel-card');
  const real = grid.querySelectorAll('.card[data-real]');
  skeletons.forEach(s => s.remove());
  real.forEach(card => card.removeAttribute('hidden'));
}

document.querySelectorAll('[data-product-grid]').forEach(grid => {
  const delay = 700 + Math.random() * 500;
  setTimeout(() => revealProducts(grid), delay);
});

// Filtro de categorias com empty state 
const chips = document.querySelectorAll('.chip[data-filter]');
const productCards = document.querySelectorAll('.products [data-real]');
const emptyState = document.querySelector('[data-empty-state]');

function applyFilter(category) {
  let visibleCount = 0;

  productCards.forEach(card => {
    const matches = category === 'todos' || card.dataset.category === category;
    card.style.display = matches ? '' : 'none';
    if (matches) visibleCount += 1;
  });

  if (emptyState) {
    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
  }
}

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    applyFilter(chip.dataset.filter);
  });
});

// Newsletter 
const newsletterForm = document.querySelector('[data-newsletter-form]');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input[type="email"]');
    const email = input.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValid) {
      showToast({
        type: 'error',
        title: 'E-mail inválido',
        message: 'Confira o endereço digitado e tente novamente.',
      });
      input.focus();
      return;
    }

    showToast({
      type: 'success',
      title: 'Inscrição confirmada',
      message: 'Você vai receber nossas novidades em breve.',
    });
    newsletterForm.reset();
  });
}
