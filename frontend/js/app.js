// ─────────────────────────────────────────────────────────────────
// TalentPulse – App Router & Core Application Logic
// ─────────────────────────────────────────────────────────────────

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8081/api'
  : (window.BACKEND_API_URL || 'https://talentplus-backend.onrender.com/api');
window.currentPage = 'dashboard';

// ── Toast Notifications ──────────────────────────────────────────
window.showToast = (message, type = 'info', duration = 3500) => {
  const icons = { success: 'check_circle', error: 'error', info: 'info' };
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="material-symbols-outlined text-[20px]">${icons[type]}</span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
};

// ── API Helper ────────────────────────────────────────────────────
window.api = {
  async request(endpoint, options = {}) {
    const user = window.currentUser;
    const token = user ? await user.getIdToken() : null;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      ...options,
    };
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, config);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || 'Request failed');
      }
      if (res.status === 204) return null;
      return res.json();
    } catch (e) {
      console.error('[API]', endpoint, e);
      throw e;
    }
  },
  get: (ep) => window.api.request(ep),
  post: (ep, data) => window.api.request(ep, { method: 'POST', body: data }),
  put: (ep, data) => window.api.request(ep, { method: 'PUT', body: data }),
  patch: (ep, data) => window.api.request(ep, { method: 'PATCH', body: data }),
  delete: (ep) => window.api.request(ep, { method: 'DELETE' }),
};

// ── Status Badge Helper ───────────────────────────────────────────
window.statusBadge = (status) => {
  const s = (status || '').toLowerCase().replace(/ /g, '-');
  return `<span class="badge-${s} px-2.5 py-0.5 rounded-full font-label-sm text-label-sm capitalize">${status}</span>`;
};

// ── Date Formatting ───────────────────────────────────────────────
window.fmtDate = (d) => {
  if (!d) return '—';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
window.fmtTime = (d) => {
  if (!d) return '—';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};
window.timeAgo = (d) => {
  if (!d) return '';
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

// ── Page Router ───────────────────────────────────────────────────
const PAGE_TITLES = {
  'dashboard': 'Dashboard',
  'job-openings': 'Job Openings',
  'applicants': 'Applicants',
  'screening': 'Screening',
  'interviews': 'Interviews',
  'selection': 'Selection',
  'job-offers': 'Job Offers',
  'reports': 'Reports',
  'settings': 'Settings',
  'candidate-profile': 'Candidate Profile',
  'login': 'Sign In',
};

window.loadPage = async (page, params = {}) => {
  window.currentPage = page;
  window.pageParams = params;

  // Update nav active states
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(el => {
    if (el.dataset.page === page) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  // Update bottom nav
  document.querySelectorAll('.bottom-nav-item').forEach(el => {
    const icon = el.querySelector('.nav-icon');
    const label = el.querySelector('.nav-label');
    if (el.dataset.page === page) {
      icon.classList.add('text-secondary');
      icon.classList.remove('text-on-surface-variant');
      label.classList.add('text-secondary');
      label.classList.remove('text-on-surface-variant');
    } else {
      icon.classList.remove('text-secondary');
      icon.classList.add('text-on-surface-variant');
      label.classList.remove('text-secondary');
      label.classList.add('text-on-surface-variant');
    }
  });

  // Update mobile title
  const mTitle = document.getElementById('mobile-page-title');
  if (mTitle) mTitle.textContent = PAGE_TITLES[page] || page;

  // Show loading
  const content = document.getElementById('page-content');
  content.innerHTML = `<div class="flex items-center justify-center h-64"><div class="spinner"></div></div>`;

  // Load the page module
  try {
    const mod = await import(`../pages/${page}.js`);
    await mod.render(content, params);
    content.classList.add('page-enter');
    setTimeout(() => content.classList.remove('page-enter'), 300);
  } catch (err) {
    console.error('[Router] Failed to load page:', page, err);
    content.innerHTML = `
      <div class="flex flex-col items-center justify-center h-64 gap-space-md text-on-surface-variant">
        <span class="material-symbols-outlined text-[48px]">error_outline</span>
        <p class="font-body-md text-body-md">Failed to load page: ${page}</p>
        <p class="font-body-sm text-body-sm text-outline">${err.message}</p>
      </div>`;
  }
};

window.loadLoginPage = async () => {
  const container = document.getElementById('auth-screen');
  container.innerHTML = '';
  try {
    const mod = await import('../pages/login.js');
    await mod.render(container);
  } catch (err) {
    console.error('[Router] Failed to load login:', err);
  }
};

// ── Mobile Nav Interactions ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Desktop nav links
  document.querySelectorAll('.nav-link').forEach(el => {
    el.addEventListener('click', () => loadPage(el.dataset.page));
  });

  // Mobile drawer nav links
  document.querySelectorAll('.mobile-nav-link').forEach(el => {
    el.addEventListener('click', () => {
      closeDrawer();
      loadPage(el.dataset.page);
    });
  });

  // Bottom nav links
  document.querySelectorAll('.bottom-nav-item').forEach(el => {
    el.addEventListener('click', () => loadPage(el.dataset.page));
  });

  // Mobile menu
  document.getElementById('mobile-menu-btn')?.addEventListener('click', openDrawer);
  document.getElementById('close-drawer-btn')?.addEventListener('click', closeDrawer);
  document.getElementById('drawer-backdrop')?.addEventListener('click', closeDrawer);

  // User menu dropdown
  document.getElementById('user-menu-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const dd = document.getElementById('user-dropdown');
    const rect = e.currentTarget.getBoundingClientRect();
    dd.style.top = (rect.bottom + 8) + 'px';
    dd.style.right = (window.innerWidth - rect.right) + 'px';
    dd.classList.toggle('hidden');
  });
  document.addEventListener('click', () => {
    document.getElementById('user-dropdown')?.classList.add('hidden');
  });

  // Global search debounce
  let searchTimeout;
  document.getElementById('global-search')?.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const q = e.target.value.trim();
      if (q.length > 2) window.dispatchEvent(new CustomEvent('global-search', { detail: q }));
    }, 350);
  });
});

function openDrawer() {
  document.getElementById('drawer-menu').classList.remove('-translate-x-full');
  document.getElementById('drawer-backdrop').classList.remove('hidden');
}
function closeDrawer() {
  document.getElementById('drawer-menu').classList.add('-translate-x-full');
  document.getElementById('drawer-backdrop').classList.add('hidden');
}

// ── Utility: Debounce ─────────────────────────────────────────────
window.debounce = (fn, delay) => {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
};

// ── Utility: Modal helper ─────────────────────────────────────────
window.openModal = (html, onClose) => {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `<div class="modal-box">${html}</div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) { overlay.remove(); if (onClose) onClose(); }
  });
  return overlay;
};
window.closeModal = () => {
  document.querySelector('.modal-overlay')?.remove();
};

// ── Utility: Confirm dialog ───────────────────────────────────────
window.confirmDialog = (message, onConfirm) => {
  const modal = openModal(`
    <div class="p-space-xl flex flex-col gap-space-lg">
      <div class="flex items-center gap-space-md">
        <span class="material-symbols-outlined text-error text-[32px]">warning</span>
        <p class="font-body-md text-body-md text-on-surface">${message}</p>
      </div>
      <div class="flex gap-space-sm justify-end">
        <button onclick="window.closeModal()" class="px-space-lg py-space-sm rounded-lg border border-outline-variant text-on-surface font-body-sm text-body-sm hover:bg-surface-container-low">Cancel</button>
        <button id="confirm-yes" class="px-space-lg py-space-sm rounded-lg bg-error text-on-error font-body-sm text-body-sm hover:opacity-90">Confirm</button>
      </div>
    </div>`);
  modal.querySelector('#confirm-yes').addEventListener('click', () => {
    modal.remove();
    onConfirm();
  });
};
