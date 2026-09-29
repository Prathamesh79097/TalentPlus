// ─────────────────────────────────────────────────────────────────
// Job Offers Page
// ─────────────────────────────────────────────────────────────────

export async function render(container, params = {}) {
  let offers = [];
  let candidates = [];
  try {
    [offers, candidates] = await Promise.all([
      window.api.get('/offers'),
      window.api.get('/applicants'),
    ]);
  } catch {
    offers = [];
    candidates = [];
  }

  container.innerHTML = buildLayout(offers, candidates);
  attachEvents(container, candidates);

  // Auto-open send offer if redirected from selection
  if (params.candidateId) {
    const cand = candidates.find(c => c.id === params.candidateId) || { id: params.candidateId };
    setTimeout(() => { window.openSendOfferModal(cand); }, 100);
  }
}

function buildLayout(offers, candidates) {
  const stats = {
    pending: offers.filter(o => o.status === 'PENDING').length,
    accepted: offers.filter(o => o.status === 'ACCEPTED').length,
    declined: offers.filter(o => o.status === 'DECLINED').length,
    total: offers.length,
  };

  return `
  <!-- ═══ DESKTOP ═══ -->
  <div class="hidden lg:block p-8 max-w-7xl mx-auto w-full">
    <div class="flex flex-col gap-space-xl">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">Job Offers</h1>
          <p class="font-body-md text-body-md text-on-surface-variant">Track and manage all sent job offers</p>
        </div>
        <button id="send-offer-btn" class="h-10 px-space-lg flex items-center gap-space-xs rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-secondary transition-all shadow-md">
          <span class="material-symbols-outlined text-[18px]">send</span>
          <span>Send New Offer</span>
        </button>
      </div>

      <!-- Offer Stats -->
      <div class="grid grid-cols-4 gap-space-lg">
        ${offerStat('Total Offers', stats.total, 'local_offer', 'primary')}
        ${offerStat('Pending Response', stats.pending, 'pending', 'status-screening')}
        ${offerStat('Accepted', stats.accepted, 'check_circle', 'status-hired')}
        ${offerStat('Declined', stats.declined, 'cancel', 'error')}
      </div>

      <!-- Offers Table -->
      <div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        <div class="p-space-xl border-b border-outline-variant/30 flex items-center justify-between">
          <span class="font-headline-md text-headline-md text-on-surface">All Offers</span>
          <div class="flex gap-space-sm">
            ${['ALL','PENDING','ACCEPTED','DECLINED','EXPIRED'].map(s => `
              <button class="offer-filter px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all ${s==='ALL'?'bg-primary text-on-primary':'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}" data-filter="${s}">${s[0]+s.slice(1).toLowerCase()}</button>
            `).join('')}
          </div>
        </div>
        <table class="w-full">
          <thead class="bg-surface-container-low border-b border-outline-variant/30">
            <tr>
              <th class="text-left px-space-xl py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Candidate</th>
              <th class="text-left px-space-md py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Role</th>
              <th class="text-left px-space-md py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Offered Package</th>
              <th class="text-left px-space-md py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Status</th>
              <th class="text-left px-space-md py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Sent / Expires</th>
              <th class="text-right px-space-xl py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody id="offers-tbody" class="divide-y divide-outline-variant/20">
            ${offers.map(renderOfferRow).join('')}
          </tbody>
        </table>
        ${offers.length === 0 ? '<div class="flex flex-col items-center justify-center py-16 text-on-surface-variant"><span class="material-symbols-outlined text-[48px]">local_offer</span><p class="font-headline-sm text-headline-sm mt-4">No offers sent yet</p></div>' : ''}
      </div>
    </div>
  </div>

  <!-- ═══ MOBILE ═══ -->
  <div class="lg:hidden flex flex-col w-full px-margin py-space-md space-y-space-lg pb-24">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-headline-sm text-headline-sm text-on-surface">Job Offers</h1>
        <p class="font-body-sm text-body-sm text-on-surface-variant">${stats.total} offers • ${stats.accepted} accepted</p>
      </div>
      <button id="send-offer-btn-mobile" class="h-10 px-space-md flex items-center gap-space-xs rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold active:scale-95 transition-transform">
        <span class="material-symbols-outlined text-[18px]">send</span>
        <span>Send Offer</span>
      </button>
    </div>

    <!-- Offer Summary Chips -->
    <div class="flex gap-space-sm overflow-x-auto no-scrollbar -mx-margin px-margin">
      ${[['All', stats.total, ''],['Pending', stats.pending, 'PENDING'],['Accepted', stats.accepted, 'ACCEPTED'],['Declined', stats.declined, 'DECLINED']].map(([l, n, f], i) => `
        <button class="offer-pill shrink-0 flex items-center gap-space-xs px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all ${i===0?'bg-primary text-on-primary':'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/40'}" data-filter="${f}">
          ${l} <span class="font-bold">${n}</span>
        </button>
      `).join('')}
    </div>

    <div id="offers-mobile-list" class="flex flex-col gap-space-md">
      ${offers.map(renderOfferCard).join('')}
    </div>
  </div>

  <!-- Send Offer Modal -->
  <div id="send-offer-modal" class="modal-overlay hidden">
    <div class="modal-box">
      ${renderOfferForm(candidates)}
    </div>
  </div>`;
}

function offerStat(label, value, icon, color) {
  return `
  <div class="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex items-center gap-space-md">
    <div class="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-${color}">
      <span class="material-symbols-outlined text-[24px]">${icon}</span>
    </div>
    <div>
      <span class="font-label-sm text-label-sm text-outline uppercase tracking-wider block">${label}</span>
      <span class="font-headline-md text-headline-md text-on-surface font-bold">${value}</span>
    </div>
  </div>`;
}

function renderOfferRow(o) {
  const daysLeft = o.expiresAt ? Math.ceil((new Date(o.expiresAt) - Date.now()) / 86400000) : null;
  return `
  <tr class="hover:bg-surface-container-low transition-colors">
    <td class="px-space-xl py-space-md">
      <div class="flex items-center gap-space-md">
        <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary font-semibold text-sm shrink-0">
          ${(o.candidateName||'C')[0]?.toUpperCase()}
        </div>
        <div>
          <p class="font-headline-sm text-headline-sm text-on-surface">${o.candidateName}</p>
          <p class="font-body-sm text-body-sm text-outline">${o.email||''}</p>
        </div>
      </div>
    </td>
    <td class="px-space-md py-space-md">
      <p class="font-body-sm text-body-sm text-on-surface">${o.position}</p>
    </td>
    <td class="px-space-md py-space-md">
      <p class="font-body-sm text-body-sm text-on-surface font-semibold">${o.salary||'—'}</p>
      <p class="font-label-sm text-label-sm text-outline">${o.benefits||''}</p>
    </td>
    <td class="px-space-md py-space-md">
      ${window.statusBadge((o.status||'pending').toLowerCase())}
    </td>
    <td class="px-space-md py-space-md">
      <p class="font-body-sm text-body-sm text-on-surface">${window.fmtDate(o.sentAt)}</p>
      ${daysLeft !== null ? `<p class="font-label-sm text-label-sm ${daysLeft < 3 ? 'text-error' : 'text-outline'}">${daysLeft > 0 ? daysLeft + 'd left' : 'Expired'}</p>` : ''}
    </td>
    <td class="px-space-xl py-space-md text-right">
      <div class="flex items-center justify-end gap-space-xs">
        ${o.status === 'PENDING' ? `
          <button onclick="window.updateOfferStatus('${o.id}','ACCEPTED')" class="px-space-md py-space-xs rounded-lg bg-status-hired-bg text-status-hired font-label-md text-label-md hover:opacity-80 transition-opacity">Accept</button>
          <button onclick="window.updateOfferStatus('${o.id}','DECLINED')" class="px-space-md py-space-xs rounded-lg bg-error-container text-error font-label-md text-label-md hover:opacity-80 transition-opacity">Decline</button>
        ` : ''}
        <button onclick="window.deleteOffer('${o.id}')" class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-error-container hover:text-error">
          <span class="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    </td>
  </tr>`;
}

function renderOfferCard(o) {
  return `
  <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm" data-status="${o.status}">
    <div class="flex items-start justify-between mb-space-sm">
      <div class="flex items-center gap-space-md min-w-0">
        <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-semibold text-sm shrink-0">
          ${(o.candidateName||'C')[0]?.toUpperCase()}
        </div>
        <div class="min-w-0">
          <h3 class="font-headline-sm text-headline-sm text-on-surface truncate">${o.candidateName}</h3>
          <p class="font-body-sm text-body-sm text-on-surface-variant truncate">${o.position}</p>
        </div>
      </div>
      ${window.statusBadge((o.status||'pending').toLowerCase())}
    </div>
    <div class="flex items-center justify-between py-space-sm border-t border-outline-variant/20">
      <div>
        <p class="font-headline-sm text-headline-sm text-on-surface">${o.salary||'Salary TBD'}</p>
        <p class="font-label-sm text-label-sm text-outline">Sent ${window.fmtDate(o.sentAt)}</p>
      </div>
      ${o.status === 'PENDING' ? `
        <div class="flex gap-space-xs">
          <button onclick="window.updateOfferStatus('${o.id}','ACCEPTED')" class="py-2 px-space-md rounded-lg bg-status-hired-bg text-status-hired font-label-md text-label-md min-h-[44px]">Accept</button>
          <button onclick="window.updateOfferStatus('${o.id}','DECLINED')" class="py-2 px-space-md rounded-lg bg-error-container text-error font-label-md text-label-md min-h-[44px]">Decline</button>
        </div>` : ''}
    </div>
  </div>`;
}

function renderOfferForm(candidates, offer = {}) {
  return `
  <div class="p-6 flex flex-col gap-space-lg">
    <div class="flex items-center justify-between">
      <h2 class="font-headline-md text-headline-md text-on-surface">Send Job Offer</h2>
      <button onclick="window.closeModal()" class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <form id="offer-form" class="flex flex-col gap-space-lg">
      <input type="hidden" id="offer-id" value="${offer.id || ''}"/>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        <div class="sm:col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Candidate *</label>
          <select id="offer-candidate" required class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary appearance-none">
            <option value="">Select candidate</option>
            ${candidates.map(c => `<option value="${c.id}" data-name="${c.firstName||''} ${c.lastName||''}" data-role="${c.jobTitle||''}" ${offer.candidateId===c.id?'selected':''}>${c.firstName||''} ${c.lastName||''} — ${c.jobTitle||''}</option>`).join('')}
          </select>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Base Salary *</label>
          <input id="offer-salary" type="text" required value="${offer.salary||''}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="e.g. $120,000 / year"/>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Start Date</label>
          <input id="offer-start" type="date" value="${offer.startDate||''}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"/>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Offer Expires</label>
          <input id="offer-expires" type="date" value="${offer.expiresAt ? new Date(offer.expiresAt).toISOString().split('T')[0] : ''}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"/>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Equity / Bonus</label>
          <input id="offer-equity" type="text" value="${offer.equity||''}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="e.g. 0.25% equity"/>
        </div>
        <div class="sm:col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Benefits</label>
          <input id="offer-benefits" type="text" value="${offer.benefits||''}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="Health, Dental, 401k, Remote, etc."/>
        </div>
        <div class="sm:col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Offer Letter Notes</label>
          <textarea id="offer-notes" rows="3" class="px-space-md py-space-sm bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary resize-none" placeholder="Any additional information to include in the offer...">${offer.notes||''}</textarea>
        </div>
      </div>
      <div id="offer-form-error" class="hidden text-error font-body-sm text-body-sm bg-error-container/40 px-space-md py-space-sm rounded-lg"></div>
      <div class="flex gap-space-sm justify-end pt-space-sm border-t border-outline-variant/20">
        <button type="button" onclick="window.closeModal()" class="px-space-lg py-space-sm rounded-lg border border-outline-variant text-on-surface font-body-sm text-body-sm hover:bg-surface-container-low">Cancel</button>
        <button type="submit" id="offer-submit" class="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-secondary transition-colors shadow-md flex items-center gap-space-xs">
          <span class="material-symbols-outlined text-[18px]">send</span>
          Send Offer
        </button>
      </div>
    </form>
  </div>`;
}

function attachEvents(container, candidates) {
  ['send-offer-btn', 'send-offer-btn-mobile'].forEach(id => {
    container.querySelector(`#${id}`)?.addEventListener('click', () => {
      window.openModal(renderOfferForm(candidates));
      attachOfferFormSubmit(candidates);
    });
  });

  window.openSendOfferModal = (cand) => {
    window.openModal(renderOfferForm(candidates, { candidateId: cand.id }));
    attachOfferFormSubmit(candidates);
    // Pre-select candidate
    setTimeout(() => {
      const sel = document.getElementById('offer-candidate');
      if (sel) sel.value = cand.id;
    }, 50);
  };

  // Filter buttons
  container.querySelectorAll('.offer-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.offer-filter').forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary');
        b.classList.add('bg-surface-container', 'text-on-surface-variant');
      });
      btn.classList.add('bg-primary', 'text-on-primary');
      btn.classList.remove('bg-surface-container', 'text-on-surface-variant');
      const f = btn.dataset.filter;
      container.querySelectorAll('#offers-tbody tr').forEach(r => {
        r.style.display = f === 'ALL' || r.textContent.toUpperCase().includes(f) ? '' : 'none';
      });
    });
  });

  container.querySelectorAll('.offer-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      container.querySelectorAll('.offer-pill').forEach(p => {
        p.classList.remove('bg-primary', 'text-on-primary');
        p.classList.add('bg-surface-container-lowest', 'text-on-surface-variant', 'border', 'border-outline-variant/40');
      });
      pill.classList.add('bg-primary', 'text-on-primary');
      pill.classList.remove('bg-surface-container-lowest', 'text-on-surface-variant');
      const f = pill.dataset.filter;
      container.querySelectorAll('#offers-mobile-list > div').forEach(card => {
        card.style.display = !f || card.dataset.status === f ? '' : 'none';
      });
    });
  });

  window.updateOfferStatus = async (id, status) => {
    try {
      await window.api.patch(`/offers/${id}/status`, { status });
      window.showToast(`Offer marked as ${status.toLowerCase()}`, status === 'ACCEPTED' ? 'success' : 'info');
      window.loadPage('job-offers');
    } catch { window.showToast('Failed to update offer status', 'error'); }
  };

  window.deleteOffer = (id) => {
    window.confirmDialog('Delete this offer?', async () => {
      try {
        await window.api.delete(`/offers/${id}`);
        window.showToast('Offer deleted', 'info');
        window.loadPage('job-offers');
      } catch { window.showToast('Failed to delete offer', 'error'); }
    });
  };
}

function attachOfferFormSubmit(candidates) {
  const form = document.getElementById('offer-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('offer-submit');
    const errEl = document.getElementById('offer-form-error');
    btn.disabled = true;
    btn.innerHTML = '<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>';
    errEl.classList.add('hidden');

    const sel = document.getElementById('offer-candidate');
    const opt = sel.options[sel.selectedIndex];

    const payload = {
      candidateId: sel.value,
      candidateName: opt.dataset.name,
      position: opt.dataset.role,
      salary: document.getElementById('offer-salary').value,
      startDate: document.getElementById('offer-start').value,
      expiresAt: document.getElementById('offer-expires').value ? new Date(document.getElementById('offer-expires').value).toISOString() : null,
      equity: document.getElementById('offer-equity').value,
      benefits: document.getElementById('offer-benefits').value,
      notes: document.getElementById('offer-notes').value,
      status: 'PENDING',
      sentAt: new Date().toISOString(),
    };

    try {
      await window.api.post('/offers', payload);
      window.showToast('Offer sent successfully!', 'success');
      window.closeModal();
      window.loadPage('job-offers');
    } catch (err) {
      errEl.textContent = err.message;
      errEl.classList.remove('hidden');
      btn.disabled = false;
      btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">send</span> Send Offer';
    }
  });
}

function getDemoOffers() {
  return [];
}
