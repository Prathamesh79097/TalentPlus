// ─────────────────────────────────────────────────────────────────
// Interviews Page – Desktop Schedule + Mobile List
// ─────────────────────────────────────────────────────────────────

export async function render(container) {
  let interviews = [];
  let candidates = [];
  try {
    [interviews, candidates] = await Promise.all([
      window.api.get('/interviews'),
      window.api.get('/applicants?stages=SHORTLISTED,INTERVIEW'),
    ]);
  } catch {
    interviews = getDemoInterviews();
    candidates = [
      { id: '1', firstName: 'Alex', lastName: 'Rivera', jobTitle: 'Sr. React Engineer' },
      { id: '2', firstName: 'Priya', lastName: 'Sharma', jobTitle: 'Product Manager' },
      { id: '6', firstName: 'Sofia', lastName: 'Martinez', jobTitle: 'UX Designer' },
    ];
  }

  container.innerHTML = buildLayout(interviews, candidates);
  attachEvents(container, candidates);
}

function buildLayout(interviews, candidates) {
  const today = new Date();
  const todayStr = today.toDateString();
  const grouped = groupByDate(interviews);

  return `
  <!-- ═══ DESKTOP ═══ -->
  <div class="hidden lg:block p-8 max-w-7xl mx-auto w-full">
    <div class="flex flex-col gap-space-xl">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">Interview Schedule</h1>
          <p class="font-body-md text-body-md text-on-surface-variant">${interviews.length} scheduled interviews</p>
        </div>
        <button id="schedule-btn" class="h-10 px-space-lg flex items-center gap-space-xs rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-secondary transition-all shadow-md">
          <span class="material-symbols-outlined text-[18px]">calendar_add_on</span>
          <span>Schedule Interview</span>
        </button>
      </div>

      <!-- Week View Grid -->
      <div class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm">
        <div class="flex items-center justify-between mb-space-lg">
          <div class="flex items-center gap-space-md">
            <button id="prev-week" class="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors">
              <span class="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span id="week-label" class="font-headline-sm text-headline-sm text-on-surface"></span>
            <button id="next-week" class="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors">
              <span class="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
          <button id="today-btn" class="px-space-md py-space-xs rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors">Today</button>
        </div>

        <!-- Day Headers -->
        <div id="week-grid" class="grid grid-cols-7 gap-space-sm">
          <!-- Rendered by JS -->
        </div>
      </div>

      <!-- Interview List -->
      <div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        <div class="p-space-xl border-b border-outline-variant/30 flex items-center justify-between">
          <span class="font-headline-md text-headline-md text-on-surface">All Interviews</span>
          <div class="flex gap-space-sm">
            ${['ALL','SCHEDULED','COMPLETED','CANCELLED'].map(s => `
              <button class="iv-filter px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all ${s==='ALL'?'bg-primary text-on-primary':'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}" data-filter="${s}">${s[0]+s.slice(1).toLowerCase()}</button>
            `).join('')}
          </div>
        </div>
        <div id="interviews-list" class="divide-y divide-outline-variant/20">
          ${interviews.length > 0 ? interviews.map(renderInterviewRow).join('') : '<div class="p-8 text-center text-on-surface-variant font-body-md text-body-md">No interviews scheduled.</div>'}
        </div>
      </div>
    </div>
  </div>

  <!-- ═══ MOBILE ═══ -->
  <div class="lg:hidden flex flex-col w-full px-margin py-space-md space-y-space-lg pb-24">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-headline-sm text-headline-sm text-on-surface">Interviews</h1>
        <p class="font-body-sm text-body-sm text-on-surface-variant">${interviews.filter(i => new Date(i.scheduledAt).toDateString() === todayStr).length} today</p>
      </div>
      <button id="schedule-btn-mobile" class="h-10 px-space-md flex items-center gap-space-xs rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold active:scale-95 transition-transform">
        <span class="material-symbols-outlined text-[18px]">add</span>
        <span>Schedule</span>
      </button>
    </div>

    <!-- Status Pills -->
    <div class="flex gap-space-sm overflow-x-auto no-scrollbar -mx-margin px-margin">
      ${['All','Today','This Week','Scheduled','Completed'].map((s, i) => `
        <button class="iv-mobile-filter shrink-0 px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all ${i===0?'bg-primary text-on-primary':'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/40'}" data-filter="${s}">${s}</button>
      `).join('')}
    </div>

    <div id="interviews-mobile-list" class="flex flex-col gap-space-md">
      ${interviews.map(renderInterviewCard).join('')}
    </div>
  </div>

  <!-- Schedule Modal -->
  <div id="schedule-modal" class="modal-overlay hidden">
    <div class="modal-box">
      ${renderScheduleForm(candidates)}
    </div>
  </div>`;
}

function renderInterviewRow(iv) {
  const d = new Date(iv.scheduledAt);
  const isToday = d.toDateString() === new Date().toDateString();
  return `
  <div class="flex items-center gap-space-xl px-space-xl py-space-md hover:bg-surface-container-low transition-colors">
    <div class="flex flex-col items-center min-w-[56px]">
      <span class="font-label-sm text-label-sm text-outline uppercase">${d.toLocaleDateString('en-US',{weekday:'short'})}</span>
      <span class="font-headline-md text-headline-md text-on-surface font-bold">${d.getDate()}</span>
      ${isToday ? '<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>' : ''}
    </div>
    <div class="flex items-center gap-space-md flex-1">
      <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-semibold text-sm shrink-0">
        ${(iv.candidateName||'C')[0]?.toUpperCase()}
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-headline-sm text-headline-sm text-on-surface">${iv.candidateName}</p>
        <p class="font-body-sm text-body-sm text-on-surface-variant">${iv.position} • ${iv.interviewType || 'Technical'}</p>
      </div>
    </div>
    <div class="flex items-center gap-space-xl">
      <div class="text-right">
        <p class="font-body-sm text-body-sm text-on-surface">${window.fmtTime(iv.scheduledAt)}</p>
        <p class="font-label-sm text-label-sm text-outline">${iv.duration || 60} min</p>
      </div>
      ${window.statusBadge((iv.status||'scheduled').toLowerCase())}
      <div class="flex gap-space-xs">
        ${iv.meetingUrl ? `<a href="${iv.meetingUrl}" target="_blank" class="px-space-md py-space-xs rounded-lg bg-secondary text-on-secondary font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">video_call</span>Join</a>` : ''}
        <button onclick="window.editInterview('${iv.id}')" class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high">
          <span class="material-symbols-outlined text-[18px]">edit</span>
        </button>
        <button onclick="window.cancelInterview('${iv.id}')" class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-error-container hover:text-error">
          <span class="material-symbols-outlined text-[18px]">cancel</span>
        </button>
      </div>
    </div>
  </div>`;
}

function renderInterviewCard(iv) {
  const d = new Date(iv.scheduledAt);
  const isToday = d.toDateString() === new Date().toDateString();
  return `
  <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
    <div class="flex items-start justify-between mb-space-sm">
      <div class="flex items-center gap-space-md min-w-0">
        <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-semibold text-sm shrink-0">
          ${(iv.candidateName||'C')[0]?.toUpperCase()}
        </div>
        <div class="min-w-0">
          <h3 class="font-headline-sm text-headline-sm text-on-surface truncate">${iv.candidateName}</h3>
          <p class="font-body-sm text-body-sm text-on-surface-variant truncate">${iv.position}</p>
        </div>
      </div>
      ${window.statusBadge((iv.status||'scheduled').toLowerCase())}
    </div>
    <div class="bg-surface-container-low p-space-sm rounded-lg mb-space-sm flex items-center justify-between">
      <div class="flex items-center gap-space-sm">
        <span class="material-symbols-outlined text-secondary text-[18px]">schedule</span>
        <span class="font-body-sm text-body-sm text-on-surface">${isToday ? 'Today, ' : window.fmtDate(iv.scheduledAt) + ', '}${window.fmtTime(iv.scheduledAt)}</span>
      </div>
      <span class="font-label-sm text-label-sm text-outline">${iv.duration || 60} min</span>
    </div>
    <div class="flex items-center gap-space-sm">
      ${iv.meetingUrl ? `<a href="${iv.meetingUrl}" target="_blank" class="flex-1 bg-secondary text-on-secondary py-2 rounded-lg font-label-md text-label-md flex items-center justify-center gap-1 min-h-[44px] active:scale-95 transition-transform"><span class="material-symbols-outlined text-[18px]">video_call</span>Join</a>` : ''}
      <button onclick="window.editInterview('${iv.id}')" class="flex-1 bg-surface-container text-on-surface py-2 rounded-lg font-label-md text-label-md flex items-center justify-center gap-1 min-h-[44px] active:scale-95 transition-transform">
        <span class="material-symbols-outlined text-[18px]">edit</span>Brief
      </button>
    </div>
  </div>`;
}

function renderScheduleForm(candidates, iv = {}) {
  return `
  <div class="p-6 flex flex-col gap-space-lg">
    <div class="flex items-center justify-between">
      <h2 class="font-headline-md text-headline-md text-on-surface">${iv.id ? 'Edit Interview' : 'Schedule Interview'}</h2>
      <button onclick="window.closeModal()" class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <form id="schedule-form" class="flex flex-col gap-space-lg">
      <input type="hidden" id="iv-id" value="${iv.id || ''}"/>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        <div class="sm:col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Candidate *</label>
          <select id="iv-candidate" required class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary appearance-none">
            <option value="">Select candidate</option>
            ${candidates.map(c => `<option value="${c.id}" data-name="${c.firstName} ${c.lastName}" data-role="${c.jobTitle||''}" ${iv.candidateId===c.id?'selected':''}>${c.firstName} ${c.lastName} — ${c.jobTitle||''}</option>`).join('')}
          </select>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Interview Type</label>
          <select id="iv-type" class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary appearance-none">
            ${['Technical','HR/Culture','System Design','Case Study','Final Round'].map(t => `<option value="${t}" ${iv.interviewType===t?'selected':''}>${t}</option>`).join('')}
          </select>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Duration (minutes)</label>
          <select id="iv-duration" class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary appearance-none">
            ${[30,45,60,90,120].map(d => `<option value="${d}" ${iv.duration===d?'selected':''}>${d} min</option>`).join('')}
          </select>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Date *</label>
          <input id="iv-date" type="date" required value="${iv.scheduledAt ? new Date(iv.scheduledAt).toISOString().split('T')[0] : ''}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"/>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Time *</label>
          <input id="iv-time" type="time" required value="${iv.scheduledAt ? new Date(iv.scheduledAt).toTimeString().slice(0,5) : ''}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"/>
        </div>
        <div class="sm:col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Interviewer(s)</label>
          <input id="iv-interviewers" type="text" value="${(iv.interviewers||[]).join(', ')}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="John Smith, Jane Doe (comma separated)"/>
        </div>
        <div class="sm:col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Meeting Link</label>
          <input id="iv-meeting" type="url" value="${iv.meetingUrl || ''}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="https://meet.google.com/..."/>
        </div>
        <div class="sm:col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Notes</label>
          <textarea id="iv-notes" rows="3" class="px-space-md py-space-sm bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary resize-none" placeholder="Interview agenda, notes...">${iv.notes || ''}</textarea>
        </div>
      </div>
      <div id="iv-form-error" class="hidden text-error font-body-sm text-body-sm bg-error-container/40 px-space-md py-space-sm rounded-lg"></div>
      <div class="flex gap-space-sm justify-end pt-space-sm border-t border-outline-variant/20">
        <button type="button" onclick="window.closeModal()" class="px-space-lg py-space-sm rounded-lg border border-outline-variant text-on-surface font-body-sm text-body-sm hover:bg-surface-container-low">Cancel</button>
        <button type="submit" id="iv-submit" class="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-secondary transition-colors shadow-md flex items-center gap-space-xs">
          <span class="material-symbols-outlined text-[18px]">calendar_add_on</span>
          ${iv.id ? 'Update' : 'Schedule'}
        </button>
      </div>
    </form>
  </div>`;
}

function groupByDate(interviews) {
  const groups = {};
  interviews.forEach(iv => {
    const d = new Date(iv.scheduledAt).toDateString();
    if (!groups[d]) groups[d] = [];
    groups[d].push(iv);
  });
  return groups;
}

function attachEvents(container, candidates) {
  ['schedule-btn', 'schedule-btn-mobile'].forEach(id => {
    container.querySelector(`#${id}`)?.addEventListener('click', () => {
      window.openModal(renderScheduleForm(candidates));
      attachScheduleFormSubmit(candidates);
    });
  });

  // Filter buttons
  container.querySelectorAll('.iv-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.iv-filter').forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary');
        b.classList.add('bg-surface-container', 'text-on-surface-variant');
      });
      btn.classList.add('bg-primary', 'text-on-primary');
      btn.classList.remove('bg-surface-container', 'text-on-surface-variant');
      const filter = btn.dataset.filter;
      container.querySelectorAll('#interviews-list > div').forEach(row => {
        row.style.display = filter === 'ALL' || row.textContent.toUpperCase().includes(filter) ? '' : 'none';
      });
    });
  });

  container.querySelectorAll('.iv-mobile-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.iv-mobile-filter').forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary');
        b.classList.add('bg-surface-container-lowest', 'text-on-surface-variant', 'border', 'border-outline-variant/40');
      });
      btn.classList.add('bg-primary', 'text-on-primary');
      btn.classList.remove('bg-surface-container-lowest', 'text-on-surface-variant');
    });
  });

  // Week navigation
  let weekOffset = 0;
  function renderWeekGrid() {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + weekOffset * 7);
    document.getElementById('week-label').textContent = `Week of ${weekStart.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}`;
    const grid = document.getElementById('week-grid');
    if (!grid) return;
    const days = Array.from({length:7}, (_,i) => {
      const d = new Date(weekStart); d.setDate(weekStart.getDate() + i); return d;
    });
    grid.innerHTML = days.map(d => {
      const isToday = d.toDateString() === now.toDateString();
      return `
      <div class="flex flex-col gap-space-xs ${isToday ? 'bg-surface-container-high rounded-xl p-space-xs' : ''}">
        <div class="text-center ${isToday ? 'text-primary font-semibold' : 'text-on-surface-variant'}">
          <p class="font-label-sm text-label-sm">${d.toLocaleDateString('en-US',{weekday:'short'})}</p>
          <p class="font-headline-md text-headline-md">${d.getDate()}</p>
        </div>
      </div>`;
    }).join('');
  }
  renderWeekGrid();
  document.getElementById('prev-week')?.addEventListener('click', () => { weekOffset--; renderWeekGrid(); });
  document.getElementById('next-week')?.addEventListener('click', () => { weekOffset++; renderWeekGrid(); });
  document.getElementById('today-btn')?.addEventListener('click', () => { weekOffset = 0; renderWeekGrid(); });

  window.editInterview = async (id) => {
    try {
      const iv = await window.api.get(`/interviews/${id}`);
      window.openModal(renderScheduleForm(candidates, iv));
      attachScheduleFormSubmit(candidates, id);
    } catch { window.showToast('Failed to load interview', 'error'); }
  };

  window.cancelInterview = (id) => {
    window.confirmDialog('Cancel this interview?', async () => {
      try {
        await window.api.patch(`/interviews/${id}/cancel`, {});
        window.showToast('Interview cancelled', 'info');
        window.loadPage('interviews');
      } catch { window.showToast('Failed to cancel interview', 'error'); }
    });
  };
}

function attachScheduleFormSubmit(candidates, existingId = null) {
  const form = document.getElementById('schedule-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('iv-submit');
    const errEl = document.getElementById('iv-form-error');
    btn.disabled = true;
    btn.innerHTML = '<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>';
    errEl.classList.add('hidden');

    const candidateSelect = document.getElementById('iv-candidate');
    const selectedOption = candidateSelect.options[candidateSelect.selectedIndex];
    const date = document.getElementById('iv-date').value;
    const time = document.getElementById('iv-time').value;

    const payload = {
      candidateId: candidateSelect.value,
      candidateName: selectedOption.dataset.name,
      position: selectedOption.dataset.role,
      interviewType: document.getElementById('iv-type').value,
      duration: parseInt(document.getElementById('iv-duration').value),
      scheduledAt: new Date(`${date}T${time}`).toISOString(),
      interviewers: document.getElementById('iv-interviewers').value.split(',').map(s=>s.trim()).filter(Boolean),
      meetingUrl: document.getElementById('iv-meeting').value,
      notes: document.getElementById('iv-notes').value,
      status: 'SCHEDULED',
    };

    try {
      if (existingId) {
        await window.api.put(`/interviews/${existingId}`, payload);
        window.showToast('Interview updated!', 'success');
      } else {
        await window.api.post('/interviews', payload);
        window.showToast('Interview scheduled!', 'success');
      }
      window.closeModal();
      window.loadPage('interviews');
    } catch (err) {
      errEl.textContent = err.message;
      errEl.classList.remove('hidden');
      btn.disabled = false;
      btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">calendar_add_on</span> Schedule';
    }
  });
}

function getDemoInterviews() {
  const now = new Date();
  const toISO = (h, m) => { const d = new Date(now); d.setHours(h,m,0,0); return d.toISOString(); };
  return [
    { id: '1', candidateName: 'Alex Rivera', position: 'Sr. React Engineer', interviewType: 'Technical', duration: 60, scheduledAt: toISO(10,30), status: 'SCHEDULED', meetingUrl: 'https://meet.google.com/abc-defg-hij' },
    { id: '2', candidateName: 'Priya Sharma', position: 'Product Manager', interviewType: 'HR/Culture', duration: 45, scheduledAt: toISO(14,0), status: 'SCHEDULED', meetingUrl: 'https://meet.google.com/xyz-uvwx-yz1' },
    { id: '3', candidateName: 'Sofia Martinez', position: 'UX Designer', interviewType: 'Case Study', duration: 90, scheduledAt: toISO(16,0), status: 'COMPLETED' },
    { id: '4', candidateName: 'Marcus Chen', position: 'DevOps Lead', interviewType: 'System Design', duration: 60, scheduledAt: new Date(now.getTime() + 86400000).toISOString(), status: 'SCHEDULED' },
  ];
}
