// Tema toggling
function setTheme(theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  setTheme(isDark ? 'light' : 'dark');
}

// Mobile menu
const mobileBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const themeToggle = document.getElementById('themeToggle');
const themeToggleMobile = document.getElementById('themeToggleMobile');

mobileBtn?.addEventListener('click', () => {
  mobileMenu?.classList.toggle('hidden');
});

themeToggle?.addEventListener('click', toggleTheme);

themeToggleMobile?.addEventListener('click', toggleTheme);

// Smooth close mobile menu when clicking links
mobileMenu?.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => mobileMenu.classList.add('hidden'));
});

// Active year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Simple contact form (no backend): validate and show message
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(contactForm).entries());
  if (!data.name || !data.email || !data.message) {
    formMsg.textContent = 'Lütfen tüm alanları doldurun.';
    formMsg.className = 'text-sm text-red-600 dark:text-red-400';
    return;
  }
  formMsg.textContent = 'Gönderiliyor...';
  formMsg.className = 'text-sm text-slate-600 dark:text-slate-300';

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.ok === false) {
      throw new Error(json.error || 'Gönderim sırasında hata oluştu.');
    }
    formMsg.textContent = 'Teşekkürler! Mesajınız başarıyla gönderildi.';
    formMsg.className = 'text-sm text-emerald-600 dark:text-emerald-400';
    contactForm.reset();
  } catch (err) {
    formMsg.textContent = err.message || 'Gönderim başarısız. Lütfen daha sonra tekrar deneyin.';
    formMsg.className = 'text-sm text-red-600 dark:text-red-400';
  }
});

// Project modal
const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalGallery = document.getElementById('modalGallery');

document.querySelectorAll('#projects .card').forEach((card) => {
  card.addEventListener('click', () => {
    const dataJson = card.getAttribute('data-project');
    try {
      const data = JSON.parse(dataJson);
      modalTitle.textContent = data.title || 'Proje';
      modalDesc.textContent = data.desc || '';
      modalGallery.innerHTML = '';
      (data.images || []).forEach((src) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Proje görseli';
        img.className = 'w-full h-44 object-cover rounded-lg ring-1 ring-slate-200 dark:ring-slate-800';
        modalGallery.appendChild(img);
      });
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    } catch (e) {
      console.error('Proje verisi çözümlenemedi', e);
    }
  });
});

modal?.addEventListener('click', (e) => {
  if (e.target.hasAttribute('data-close')) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
});
