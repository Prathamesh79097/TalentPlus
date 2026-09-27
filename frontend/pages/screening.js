// ─────────────────────────────────────────────────────────────────
// Screening Page – Kanban Board Desktop / Mobile List
// ─────────────────────────────────────────────────────────────────

export async function render(container) {
  let applicants = [];
  try {
    applicants = await window.api.get('/applicants?stages=NEW,SCREENING');
  } catch {
    applicants = getDemoScreening();
  }

  container.innerHTML = buildLayout(applicants);
  attachEvents(container);
}

function buildLayout(applicants) {
  const byStage = { NEW: [], SCREENING: [], SHORTLISTED: [], REJECTED: [] };
  applicants.forEach(a => {
    const stage = a.stage?.toUpperCase() || 'NEW';
    if (byStage[stage]) byStage[stage].push(a);
    else byStage.NEW.push(a);
  });

  return `
  <!-- ═══ DESKTOP ═══ -->
  <div class="hidden lg:block p-8 max-w-7xl mx-auto w-full">
    <div class="flex flex-col gap-space-xl">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">Candidate Screening</h1>
          <p class="font-body-md text-body-md text-on-surface-variant">Review and shortlist candidates from the applicant pool</p>
        </div>
        <div class="flex items-center gap-space-sm">
          <div class="relative">
            <span class="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">search</span>
            <input id="screen-search" class="h-10 pl-9 pr-space-md bg-surface-container-lowest rounded-lg text-on-surface placeholder:text-outline text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm" placeholder="Search candidates..."/>
          </div>
        </div>
      </div>

      <!-- Screening Columns (Kanban) -->
      <div class="grid grid-cols-4 gap-space-lg items-start">
        ${renderKanbanCol('New Applications', byStage.NEW, 'NEW', 'primary-container', 'text-on-primary-container')}
        ${renderKanbanCol('Under Screening', byStage.SCREENING, 'SCREENING', 'secondary-container', 'text-on-secondary')}
        ${renderKanbanCol('Shortlisted', byStage.SHORTLISTED, 'SHORTLISTED', 'status-hired-bg', 'text-status-hired')}
        ${renderKanbanCol('Rejected', byStage.REJECTED, 'REJECTED', 'error-container', 'text-error')}
      </div>
    </div>
  </div>

  <!-- ═══ MOBILE ═══ -->
  <div class="lg:hidden flex flex-col w-full px-margin py-space-md space-y-space-lg pb-24">
    <div>
      <h1 class="font-headline-sm text-headline-sm text-on-surface">Candidate Screening</h1>
      <p class="font-body-sm text-body-sm text-on-surface-variant">${applicants.length} candidates to review</p>
    </div>

    <div class="relative">
      <span class="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">search</span>
      <input id="screen-search-mobile" class="w-full h-11 pl-10 pr-space-md bg-surface-container-lowest rounded-lg text-on-surface placeholder:text-outline text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm" placeholder="Search candidates..."/>
    </div>

    <!-- Stage tabs -->
    <div class="flex gap-space-sm overflow-x-auto no-scrollbar -mx-margin px-margin">
      ${[['All',''],['New','NEW'],['Screening','SCREENING'],['Shortlisted','SHORTLISTED'],['Rejected','REJECTED']].map(([label, val], i) => `
        <button class="screen-tab shrink-0 px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all ${i===0?'bg-primary text-on-primary':'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/40'}" data-stage="${val}">${label}</button>
      `).join('')}
    </div>

    <div id="screening-mobile-list" class="flex flex-col gap-space-md">
      ${applicants.map(a => renderScreeningCard(a)).join('')}
    </div>
  </div>`;
}

function renderKanbanCol(title, candidates, stageKey, headerBg, headerTextColor) {
  return `
  <div class="flex flex-col gap-space-md" data-stage="${stageKey}">
    <div class="flex items-center justify-between p-space-md rounded-xl bg-${headerBg}">
      <span class="font-headline-sm text-headline-sm ${headerTextColor}">${title}</span>
      <span class="font-label-sm text-label-sm ${headerTextColor} bg-white/20 px-2 py-0.5 rounded-full font-semibold">${candidates.length}</span>
    </div>
    <div class="flex flex-col gap-space-md min-h-[200px]">
      ${candidates.map(a => renderKanbanCard(a)).join('')}
      ${candidates.length === 0 ? `<div class="flex items-center justify-center h-24 rounded-xl border-2 border-dashed border-outline-variant/40 text-on-surface-variant">
        <span class="font-body-sm text-body-sm text-outline">No candidates</span>
      </div>` : ''}
    </div>
  </div>`;
}

function renderKanbanCard(a) {
  return `
  <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer" onclick="window.viewCandidate('${a.id}')">
    <div class="flex items-center gap-space-sm mb-space-sm">
      <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary font-semibold text-sm shrink-0">
        ${(a.firstName||a.name||'C')[0]?.toUpperCase()}
      </div>
      <div class="min-w-0 flex-1">
        <p class="font-headline-sm text-headline-sm text-on-surface truncate">${a.firstName||''} ${a.lastName||a.name||''}</p>
        <p class="font-body-sm text-body-sm text-on-surface-variant truncate">${a.jobTitle||a.appliedRole||''}</p>
      </div>
    </div>
    <div class="flex items-center gap-space-sm mb-space-sm flex-wrap">
      ${(a.skills||[]).slice(0,3).map(s => `<span class="badge-interview px-2 py-0.5 rounded-full font-label-sm text-label-sm">${s}</span>`).join('')}
    </div>
    <div class="flex items-center justify-between">
      <span class="font-body-sm text-body-sm text-outline">${a.yearsExperience||0}y exp • ${a.currentCompany||'—'}</span>
      <div class="flex gap-space-xs">
        <button onclick="event.stopPropagation(); window.updateStage('${a.id}','SHORTLISTED')" class="w-7 h-7 flex items-center justify-center rounded-lg bg-status-hired-bg text-status-hired hover:opacity-80 transition-opacity" title="Shortlist">
          <span class="material-symbols-outlined text-[16px]">thumb_up</span>
        </button>
        <button onclick="event.stopPropagation(); window.updateStage('${a.id}','REJECTED')" class="w-7 h-7 flex items-center justify-center rounded-lg bg-error-container text-error hover:opacity-80 transition-opacity" title="Reject">
          <span class="material-symbols-outlined text-[16px]">thumb_down</span>
        </button>
      </div>
    </div>
  </div>`;
}

function renderScreeningCard(a) {
  return `
  <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm" data-stage="${a.stage}">
    <div class="flex items-start justify-between mb-space-sm">
      <div class="flex items-center gap-space-md min-w-0">
        <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-semibold text-sm shrink-0">
          ${(a.firstName||a.name||'C')[0]?.toUpperCase()}
        </div>
        <div class="min-w-0">
          <h3 class="font-headline-sm text-headline-sm text-on-surface truncate">${a.firstName||''} ${a.lastName||a.name||''}</h3>
          <p class="font-body-sm text-body-sm text-on-surface-variant truncate">${a.jobTitle||a.appliedRole||''}</p>
        </div>
      </div>
      ${window.statusBadge((a.stage||'new').toLowerCase())}
    </div>
    <div class="flex items-center gap-space-sm pt-space-sm border-t border-outline-variant/20">
      <button onclick="window.updateStage('${a.id}','SHORTLISTED')" class="flex-1 py-2 rounded-lg bg-status-hired-bg text-status-hired font-label-md text-label-md flex items-center justify-center gap-1 active:scale-95 transition-transform min-h-[44px]">
        <span class="material-symbols-outlined text-[18px]">thumb_up</span> Shortlist
      </button>
      <button onclick="window.updateStage('${a.id}','REJECTED')" class="flex-1 py-2 rounded-lg bg-error-container text-error font-label-md text-label-md flex items-center justify-center gap-1 active:scale-95 transition-transform min-h-[44px]">
        <span class="material-symbols-outlined text-[18px]">thumb_down</span> Reject
      </button>
      <button onclick="window.viewCandidate('${a.id}')" class="w-11 h-11 flex items-center justify-center rounded-lg bg-surface-container text-on-surface active:scale-95 transition-transform">
        <span class="material-symbols-outlined text-[20px]">open_in_new</span>
      </button>
    </div>
  </div>`;
}

function attachEvents(container) {
  const doSearch = window.debounce((q) => {
    const lq = q.toLowerCase();
    container.querySelectorAll('[data-stage]').forEach(card => {
      if (card.querySelector('p')) {
        card.style.display = card.textContent.toLowerCase().includes(lq) ? '' : 'none';
      }
    });
  }, 300);

  container.querySelector('#screen-search')?.addEventListener('input', e => doSearch(e.target.value));
  container.querySelector('#screen-search-mobile')?.addEventListener('input', e => doSearch(e.target.value));

  container.querySelectorAll('.screen-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.screen-tab').forEach(t => {
        t.classList.remove('bg-primary', 'text-on-primary');
        t.classList.add('bg-surface-container-lowest', 'text-on-surface-variant', 'border', 'border-outline-variant/40');
      });
      tab.classList.add('bg-primary', 'text-on-primary');
      tab.classList.remove('bg-surface-container-lowest', 'text-on-surface-variant');
      const stage = tab.dataset.stage;
      container.querySelectorAll('#screening-mobile-list > div').forEach(card => {
        card.style.display = (!stage || card.dataset.stage === stage) ? '' : 'none';
      });
    });
  });

  window.updateStage = async (id, stage) => {
    try {
      await window.api.patch(`/applicants/${id}/stage`, { stage });
      window.showToast(`Candidate marked as ${stage.toLowerCase()}`, 'success');
      window.loadPage('screening');
    } catch { window.showToast('Failed to update stage', 'error'); }
  };

  window.viewCandidate = (id) => window.loadPage('candidate-profile', { id });
}

function getDemoScreening() {
  return [
    { id: '1', firstName: 'Alex', lastName: 'Rivera', email: 'alex@email.com', jobTitle: 'Sr. React Engineer', stage: 'NEW', yearsExperience: 5, currentCompany: 'Google', skills: ['React', 'TypeScript', 'Node.js'] },
    { id: '5', firstName: 'Ryan', lastName: 'Patel', email: 'ryan@email.com', jobTitle: 'Sr. React Engineer', stage: 'NEW', yearsExperience: 3, currentCompany: 'Startup', skills: ['React', 'CSS'] },
    { id: '2', firstName: 'Priya', lastName: 'Sharma', email: 'priya@email.com', jobTitle: 'Product Manager', stage: 'SCREENING', yearsExperience: 7, currentCompany: 'Meta', skills: ['Product Strategy', 'Agile', 'Data Analysis'] },
    { id: '8', firstName: 'David', lastName: 'Lee', email: 'david@email.com', jobTitle: 'Backend Engineer', stage: 'SCREENING', yearsExperience: 4, currentCompany: 'Stripe', skills: ['Java', 'Spring Boot', 'PostgreSQL'] },
    { id: '6', firstName: 'Sofia', lastName: 'Martinez', email: 'sofia@email.com', jobTitle: 'UX Designer', stage: 'SHORTLISTED', yearsExperience: 6, currentCompany: 'Adobe', skills: ['Figma', 'User Research'] },
    { id: '7', firstName: 'James', lastName: 'Wong', email: 'james@email.com', jobTitle: 'Security Analyst', stage: 'REJECTED', yearsExperience: 2, currentCompany: 'Unknown', skills: ['Networking'] },
  ];
}
