// ─────────────────────────────────────────────────────────────────
// Applicants Page – Desktop Table + Mobile Cards
// ─────────────────────────────────────────────────────────────────

export async function render(container, params = {}) {
  let applicants = [];
  let jobs = [];
  try {
    const qs = params.jobId ? `?jobId=${params.jobId}` : '';
    [applicants, jobs] = await Promise.all([
      window.api.get(`/applicants${qs}`),
      window.api.get('/jobs?status=OPEN'),
    ]);
  } catch {
    applicants = [];
    jobs = [];
  }

  container.innerHTML = buildLayout(applicants, jobs, params.jobId);
  attachEvents(container, jobs);
}

function buildLayout(applicants, jobs, selectedJobId) {
  return `
  <!-- ═══ DESKTOP ═══ -->
  <div class="hidden lg:block p-8 max-w-7xl mx-auto w-full">
    <div class="flex flex-col gap-space-xl">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">Applicants</h1>
          <p class="font-body-md text-body-md text-on-surface-variant">${applicants.length} candidates across all open roles</p>
        </div>
        <div class="flex items-center gap-space-sm">
          <button id="clear-all-applicants-btn" class="h-10 px-space-md flex items-center gap-space-xs rounded-lg border border-error/30 text-error hover:bg-error-container/30 transition-colors font-body-sm text-body-sm">
            <span class="material-symbols-outlined text-[18px]">delete_sweep</span>
            <span>Clear All Applicants</span>
          </button>
          <button id="add-applicant-btn" class="h-10 px-space-lg flex items-center gap-space-xs rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-secondary transition-all shadow-md">
            <span class="material-symbols-outlined text-[18px]">person_add</span>
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-wrap items-center gap-space-md">
        <div class="relative flex-1 min-w-[200px]">
          <span class="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">search</span>
          <input id="applicant-search" class="w-full h-10 pl-10 pr-space-md bg-surface-container-low rounded-lg text-on-surface placeholder:text-outline text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="Search by name, email, skills..."/>
        </div>
        <select id="applicant-job-filter" class="h-10 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary appearance-none pr-8">
          <option value="">All Jobs</option>
          ${jobs.map(j => `<option value="${j.id}" ${selectedJobId===j.id?'selected':''}>${j.title}</option>`).join('')}
        </select>
        <select id="applicant-status-filter" class="h-10 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary appearance-none pr-8">
          <option value="">All Stages</option>
          ${['New','Screening','Interview','Selection','Offer','Hired','Rejected'].map(s => `<option value="${s.toUpperCase()}">${s}</option>`).join('')}
        </select>
        <select id="applicant-sort" class="h-10 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary appearance-none pr-8">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name A-Z</option>
          <option value="stage">Pipeline Stage</option>
        </select>
      </div>

      <!-- Applicants Table -->
      <div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        <table class="w-full">
          <thead class="bg-surface-container-low border-b border-outline-variant/30">
            <tr>
              <th class="text-left px-space-xl py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Candidate</th>
              <th class="text-left px-space-md py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Applied Role</th>
              <th class="text-left px-space-md py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Stage</th>
              <th class="text-left px-space-md py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Rating</th>
              <th class="text-left px-space-md py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Applied</th>
              <th class="text-right px-space-xl py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody id="applicants-tbody" class="divide-y divide-outline-variant/20">
            ${applicants.map(renderApplicantRow).join('')}
          </tbody>
        </table>
        ${applicants.length === 0 ? '<div class="flex flex-col items-center justify-center py-16 gap-space-md text-on-surface-variant"><span class="material-symbols-outlined text-[48px]">group</span><p class="font-headline-sm text-headline-sm">No applicants yet</p></div>' : ''}
      </div>
    </div>
  </div>

  <!-- ═══ MOBILE ═══ -->
  <div class="lg:hidden flex flex-col w-full px-margin py-space-md space-y-space-lg pb-24">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-headline-sm text-headline-sm text-on-surface">Applicants</h1>
        <p class="font-body-sm text-body-sm text-on-surface-variant">${applicants.length} candidates</p>
      </div>
      <button id="add-applicant-btn-mobile" class="h-10 px-space-md flex items-center gap-space-xs rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold active:scale-95 transition-transform">
        <span class="material-symbols-outlined text-[18px]">person_add</span>
      </button>
    </div>

    <div class="relative">
      <span class="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">search</span>
      <input id="applicant-search-mobile" class="w-full h-11 pl-10 pr-space-md bg-surface-container-lowest rounded-lg text-on-surface placeholder:text-outline text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm" placeholder="Search candidates..."/>
    </div>

    <!-- Stage Filter Pills -->
    <div class="flex gap-space-sm overflow-x-auto no-scrollbar -mx-margin px-margin pb-space-xs">
      ${['All','New','Screening','Interview','Offer','Hired'].map((s, i) => `
        <button class="stage-pill shrink-0 px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all ${i === 0 ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/40'}" data-stage="${s === 'All' ? '' : s.toUpperCase()}">${s}</button>
      `).join('')}
    </div>

    <div id="applicants-mobile-list" class="flex flex-col gap-space-md">
      ${applicants.map(renderApplicantCard).join('')}
    </div>
  </div>

  <!-- Add/Edit Applicant Modal -->
  <div id="applicant-modal" class="modal-overlay hidden">
    <div class="modal-box">
      ${renderApplicantForm(jobs)}
    </div>
  </div>`;
}

function renderApplicantRow(a) {
  const stars = '★'.repeat(Math.round(a.rating || 0)) + '☆'.repeat(5 - Math.round(a.rating || 0));
  const isGoogleForm = a.source === 'Google Form';
  return `
  <tr class="hover:bg-surface-container-low transition-colors cursor-pointer" onclick="window.viewCandidate('${a.id}')">
    <td class="px-space-xl py-space-md">
      <div class="flex items-center gap-space-md">
        <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary font-semibold text-sm shrink-0">
          ${(a.firstName||a.name||'C')[0]?.toUpperCase()}
        </div>
        <div>
          <div class="flex items-center gap-space-xs">
            <p class="font-headline-sm text-headline-sm text-on-surface">${a.firstName || ''} ${a.lastName || a.name || ''}</p>
            ${isGoogleForm ? `<span class="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-label-sm text-[10px] font-semibold flex items-center gap-0.5" title="Applied via Google Form"><span class="material-symbols-outlined text-[12px]">description</span>Form</span>` : ''}
          </div>
          <p class="font-body-sm text-body-sm text-outline">${a.email}</p>
        </div>
      </div>
    </td>
    <td class="px-space-md py-space-md">
      <p class="font-body-sm text-body-sm text-on-surface">${a.jobTitle || a.appliedRole || '—'}</p>
    </td>
    <td class="px-space-md py-space-md">
      ${window.statusBadge((a.stage || a.status || 'new').toLowerCase())}
    </td>
    <td class="px-space-md py-space-md">
      <span class="text-status-screening font-label-sm text-label-sm" title="${a.rating || 0}/5">${stars}</span>
    </td>
    <td class="px-space-md py-space-md">
      <span class="font-body-sm text-body-sm text-outline">${window.fmtDate(a.appliedDate || a.createdAt)}</span>
    </td>
    <td class="px-space-xl py-space-md text-right">
      <div class="flex items-center justify-end gap-space-sm" onclick="e => e.stopPropagation()">
        <button onclick="event.stopPropagation(); window.advanceCandidate('${a.id}', '${a.stage}')" class="px-space-md py-space-xs rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors">Advance</button>
        <button onclick="event.stopPropagation(); window.viewCandidate('${a.id}')" class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high">
          <span class="material-symbols-outlined text-[18px]">open_in_new</span>
        </button>
      </div>
    </td>
  </tr>`;
}

function renderApplicantCard(a) {
  const isGoogleForm = a.source === 'Google Form';
  return `
  <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer" onclick="window.viewCandidate('${a.id}')">
    <div class="flex items-start justify-between mb-space-sm">
      <div class="flex items-center gap-space-md min-w-0">
        <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-semibold text-sm shrink-0">
          ${(a.firstName||a.name||'C')[0]?.toUpperCase()}
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-space-xs">
            <h3 class="font-headline-sm text-headline-sm text-on-surface truncate">${a.firstName || ''} ${a.lastName || a.name || ''}</h3>
            ${isGoogleForm ? `<span class="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-label-sm text-[10px] font-semibold flex items-center gap-0.5" title="Applied via Google Form"><span class="material-symbols-outlined text-[12px]">description</span>Form</span>` : ''}
          </div>
          <p class="font-body-sm text-body-sm text-on-surface-variant truncate">${a.jobTitle || a.appliedRole || 'General Application'}</p>
        </div>
      </div>
      ${window.statusBadge((a.stage || a.status || 'new').toLowerCase())}
    </div>
    <div class="flex items-center justify-between pt-space-sm border-t border-outline-variant/20">
      <span class="font-body-sm text-body-sm text-outline">${a.email}</span>
      <span class="font-label-sm text-label-sm text-outline">${window.fmtDate(a.appliedDate || a.createdAt)}</span>
    </div>
  </div>`;
}

function renderApplicantForm(jobs, applicant = {}) {
  return `
  <div class="p-6 flex flex-col gap-space-lg">
    <div class="flex items-center justify-between">
      <h2 class="font-headline-md text-headline-md text-on-surface">${applicant.id ? 'Edit Candidate' : 'Add Candidate'}</h2>
      <button onclick="window.closeModal()" class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <form id="applicant-form" class="flex flex-col gap-space-lg">
      <input type="hidden" id="applicant-id" value="${applicant.id || ''}"/>
      <div class="grid grid-cols-2 gap-space-md">
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">First Name *</label>
          <input id="app-firstname" type="text" required value="${applicant.firstName || ''}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="First"/>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Last Name *</label>
          <input id="app-lastname" type="text" required value="${applicant.lastName || ''}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="Last"/>
        </div>
        <div class="col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Email *</label>
          <input id="app-email" type="email" required value="${applicant.email || ''}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="candidate@email.com"/>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Phone</label>
          <input id="app-phone" type="tel" value="${applicant.phone || ''}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="+1 (555) 000-0000"/>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Applied Role *</label>
          <select id="app-job" required class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary appearance-none">
            <option value="">Select job</option>
            ${jobs.map(j => `<option value="${j.id}" ${applicant.jobId===j.id?'selected':''}>${j.title}</option>`).join('')}
          </select>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Experience (years)</label>
          <input id="app-exp" type="number" min="0" value="${applicant.yearsExperience || ''}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="5"/>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Current Company</label>
          <input id="app-company" type="text" value="${applicant.currentCompany || ''}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="ACME Corp"/>
        </div>
        <div class="col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">LinkedIn URL</label>
          <input id="app-linkedin" type="url" value="${applicant.linkedinUrl || ''}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="https://linkedin.com/in/..."/>
        </div>
        <div class="col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Resume / CV</label>
          <input id="app-resume" type="file" accept=".pdf,.doc,.docx"
            class="h-11 px-space-md py-2.5 bg-surface-container-low rounded-lg text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-primary file:text-on-primary file:text-sm file:font-medium file:cursor-pointer"/>
        </div>
        <div class="col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Notes</label>
          <textarea id="app-notes" rows="3" class="px-space-md py-space-sm bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary resize-none" placeholder="Internal notes about this candidate...">${applicant.notes || ''}</textarea>
        </div>
      </div>
      <div id="applicant-form-error" class="hidden text-error font-body-sm text-body-sm bg-error-container/40 px-space-md py-space-sm rounded-lg"></div>
      <div class="flex gap-space-sm justify-end pt-space-sm border-t border-outline-variant/20">
        <button type="button" onclick="window.closeModal()" class="px-space-lg py-space-sm rounded-lg border border-outline-variant text-on-surface font-body-sm text-body-sm hover:bg-surface-container-low">Cancel</button>
        <button type="submit" id="applicant-submit" class="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-secondary transition-colors shadow-md flex items-center gap-space-xs">
          <span class="material-symbols-outlined text-[18px]">save</span>
          ${applicant.id ? 'Save Changes' : 'Add Candidate'}
        </button>
      </div>
    </form>
  </div>`;
}

function attachEvents(container, jobs) {
  ['add-applicant-btn', 'add-applicant-btn-mobile'].forEach(id => {
    container.querySelector(`#${id}`)?.addEventListener('click', () => {
      window.openModal(renderApplicantForm(jobs));
      attachApplicantFormSubmit(jobs);
    });
  });

  container.querySelector('#clear-all-applicants-btn')?.addEventListener('click', () => {
    window.confirmDialog('Are you sure you want to remove ALL current applicants? This action cannot be undone.', async () => {
      try {
        await window.api.delete('/applicants/all');
        window.showToast('All current applicants removed successfully!', 'success');
        window.loadPage('applicants');
      } catch {
        window.showToast('Failed to clear applicants', 'error');
      }
    });
  });

  const doSearch = window.debounce((q) => {
    const lq = q.toLowerCase();
    container.querySelectorAll('#applicants-tbody tr').forEach(r => r.style.display = r.textContent.toLowerCase().includes(lq) ? '' : 'none');
    container.querySelectorAll('#applicants-mobile-list > div').forEach(c => c.style.display = c.textContent.toLowerCase().includes(lq) ? '' : 'none');
  }, 300);

  container.querySelector('#applicant-search')?.addEventListener('input', e => doSearch(e.target.value));
  container.querySelector('#applicant-search-mobile')?.addEventListener('input', e => doSearch(e.target.value));

  container.querySelector('#applicant-job-filter')?.addEventListener('change', () => render(container, { jobId: container.querySelector('#applicant-job-filter').value }));
  container.querySelector('#applicant-status-filter')?.addEventListener('change', () => render(container));

  container.querySelectorAll('.stage-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      container.querySelectorAll('.stage-pill').forEach(p => {
        p.classList.remove('bg-primary', 'text-on-primary');
        p.classList.add('bg-surface-container-lowest', 'text-on-surface-variant', 'border', 'border-outline-variant/40');
      });
      pill.classList.add('bg-primary', 'text-on-primary');
      pill.classList.remove('bg-surface-container-lowest', 'text-on-surface-variant');
      // Filter cards
      const stage = pill.dataset.stage;
      container.querySelectorAll('#applicants-mobile-list > div').forEach(card => {
        card.style.display = (!stage || card.textContent.toUpperCase().includes(stage)) ? '' : 'none';
      });
    });
  });

  window.viewCandidate = (id) => window.loadPage('candidate-profile', { id });
  window.advanceCandidate = async (id, currentStage) => {
    const stages = ['NEW', 'SCREENING', 'INTERVIEW', 'SELECTION', 'OFFER', 'HIRED'];
    const idx = stages.indexOf(currentStage?.toUpperCase() || 'NEW');
    const next = stages[Math.min(idx + 1, stages.length - 1)];
    try {
      await window.api.patch(`/applicants/${id}/stage`, { stage: next });
      window.showToast(`Candidate advanced to ${next}`, 'success');
      window.loadPage('applicants');
    } catch { window.showToast('Failed to advance candidate', 'error'); }
  };
}

function attachApplicantFormSubmit(jobs) {
  const form = document.getElementById('applicant-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('applicant-submit');
    const errEl = document.getElementById('applicant-form-error');
    btn.disabled = true;
    btn.innerHTML = '<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>';
    errEl.classList.add('hidden');

    const jobId = document.getElementById('app-job').value;
    const selectedJob = jobs.find(j => j.id === jobId);

    const payload = {
      firstName: document.getElementById('app-firstname').value,
      lastName: document.getElementById('app-lastname').value,
      email: document.getElementById('app-email').value,
      phone: document.getElementById('app-phone').value,
      jobId,
      jobTitle: selectedJob?.title,
      yearsExperience: parseInt(document.getElementById('app-exp').value) || 0,
      currentCompany: document.getElementById('app-company').value,
      linkedinUrl: document.getElementById('app-linkedin').value,
      notes: document.getElementById('app-notes').value,
      stage: 'NEW',
    };

    // Handle resume upload
    const resumeFile = document.getElementById('app-resume').files[0];
    if (resumeFile) {
      try {
        const { getStorage, ref, uploadBytes, getDownloadURL } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js');
        const storageRef = ref(window.firebaseStorage, `resumes/${Date.now()}_${resumeFile.name}`);
        const snap = await uploadBytes(storageRef, resumeFile);
        payload.resumeUrl = await getDownloadURL(snap.ref);
      } catch (uploadErr) {
        console.warn('Resume upload failed:', uploadErr);
      }
    }

    try {
      await window.api.post('/applicants', payload);
      window.showToast('Candidate added successfully!', 'success');
      window.closeModal();
      window.loadPage('applicants');
    } catch (err) {
      errEl.textContent = err.message;
      errEl.classList.remove('hidden');
      btn.disabled = false;
      btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">save</span> Add Candidate';
    }
  });
}

function getDemoApplicants() {
  return [];
}
