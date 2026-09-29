import{_ as h}from"./index-C7y_1Zkn.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";async function f(e,a={}){let o=[],n=[];try{const t=a.jobId?`?jobId=${a.jobId}`:"";[o,n]=await Promise.all([window.api.get(`/applicants${t}`),window.api.get("/jobs?status=OPEN")])}catch{o=[],n=[]}e.innerHTML=$(o,n,a.jobId),C(e,n)}function $(e,a,o){return`
  <!-- ═══ DESKTOP ═══ -->
  <div class="hidden lg:block p-8 max-w-7xl mx-auto w-full">
    <div class="flex flex-col gap-space-xl">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">Applicants</h1>
          <p class="font-body-md text-body-md text-on-surface-variant">${e.length} candidates across all open roles</p>
        </div>
        <div class="flex items-center gap-space-sm">
          <button id="delete-selected-btn" class="hidden h-10 px-space-md flex items-center gap-space-xs rounded-lg bg-error text-on-error hover:opacity-90 transition-all font-body-sm text-body-sm shadow-sm font-medium">
            <span class="material-symbols-outlined text-[18px]">delete</span>
            <span>Delete Selected (<span id="selected-count">0</span>)</span>
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
          ${a.map(n=>`<option value="${n.id}" ${o===n.id?"selected":""}>${n.title}</option>`).join("")}
        </select>
        <select id="applicant-status-filter" class="h-10 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary appearance-none pr-8">
          <option value="">All Stages</option>
          ${["New","Screening","Interview","Selection","Offer","Hired","Rejected"].map(n=>`<option value="${n.toUpperCase()}">${n}</option>`).join("")}
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
              <th class="w-12 px-4 py-space-md text-center">
                <input type="checkbox" id="select-all-applicants" class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-secondary cursor-pointer" title="Select All"/>
              </th>
              <th class="text-left px-space-md py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Candidate</th>
              <th class="text-left px-space-md py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Applied Role</th>
              <th class="text-left px-space-md py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Stage</th>
              <th class="text-left px-space-md py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Rating</th>
              <th class="text-left px-space-md py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Applied</th>
              <th class="text-right px-space-xl py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody id="applicants-tbody" class="divide-y divide-outline-variant/20">
            ${e.map(E).join("")}
          </tbody>
        </table>
        ${e.length===0?'<div class="flex flex-col items-center justify-center py-16 gap-space-md text-on-surface-variant"><span class="material-symbols-outlined text-[48px]">group</span><p class="font-headline-sm text-headline-sm">No applicants yet</p></div>':""}
      </div>
    </div>
  </div>

  <!-- ═══ MOBILE ═══ -->
  <div class="lg:hidden flex flex-col w-full px-margin py-space-md space-y-space-lg pb-24">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-headline-sm text-headline-sm text-on-surface">Applicants</h1>
        <p class="font-body-sm text-body-sm text-on-surface-variant">${e.length} candidates</p>
      </div>
      <div class="flex items-center gap-2">
        <button id="delete-selected-btn-mobile" class="hidden h-10 px-space-md flex items-center gap-1 rounded-lg bg-error text-on-error font-label-md text-label-md font-semibold active:scale-95 transition-transform">
          <span class="material-symbols-outlined text-[18px]">delete</span>
          <span>(<span id="selected-count-mobile">0</span>)</span>
        </button>
        <button id="add-applicant-btn-mobile" class="h-10 px-space-md flex items-center gap-space-xs rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold active:scale-95 transition-transform">
          <span class="material-symbols-outlined text-[18px]">person_add</span>
        </button>
      </div>
    </div>

    <div class="relative">
      <span class="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">search</span>
      <input id="applicant-search-mobile" class="w-full h-11 pl-10 pr-space-md bg-surface-container-lowest rounded-lg text-on-surface placeholder:text-outline text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm" placeholder="Search candidates..."/>
    </div>

    <!-- Stage Filter Pills -->
    <div class="flex gap-space-sm overflow-x-auto no-scrollbar -mx-margin px-margin pb-space-xs">
      ${["All","New","Screening","Interview","Offer","Hired"].map((n,t)=>`
        <button class="stage-pill shrink-0 px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all ${t===0?"bg-primary text-on-primary":"bg-surface-container-lowest text-on-surface-variant border border-outline-variant/40"}" data-stage="${n==="All"?"":n.toUpperCase()}">${n}</button>
      `).join("")}
    </div>

    <div id="applicants-mobile-list" class="flex flex-col gap-space-md">
      ${e.map(A).join("")}
    </div>
  </div>

  <!-- Add/Edit Applicant Modal -->
  <div id="applicant-modal" class="modal-overlay hidden">
    <div class="modal-box">
      ${x(a)}
    </div>
  </div>`}function E(e){const a="★".repeat(Math.round(e.rating||0))+"☆".repeat(5-Math.round(e.rating||0)),o=e.source==="Google Form",n=`${e.firstName||""} ${e.lastName||e.name||""}`.trim()||"Applicant";return`
  <tr class="hover:bg-surface-container-low transition-colors cursor-pointer" onclick="window.viewCandidate('${e.id}')">
    <td class="w-12 px-4 py-space-md text-center" onclick="event.stopPropagation()">
      <input type="checkbox" class="applicant-cb w-4 h-4 rounded border-outline-variant text-primary focus:ring-secondary cursor-pointer" data-id="${e.id}" data-name="${n}" onclick="event.stopPropagation(); window.updateSelectedApplicantCount()"/>
    </td>
    <td class="px-space-md py-space-md">
      <div class="flex items-center gap-space-md">
        <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary font-semibold text-sm shrink-0">
          ${(e.firstName||e.name||"C")[0]?.toUpperCase()}
        </div>
        <div>
          <div class="flex items-center gap-space-xs">
            <p class="font-headline-sm text-headline-sm text-on-surface">${n}</p>
            ${o?'<span class="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-label-sm text-[10px] font-semibold flex items-center gap-0.5" title="Applied via Google Form"><span class="material-symbols-outlined text-[12px]">description</span>Form</span>':""}
          </div>
          <p class="font-body-sm text-body-sm text-outline">${e.email||"—"}</p>
        </div>
      </div>
    </td>
    <td class="px-space-md py-space-md">
      <p class="font-body-sm text-body-sm text-on-surface">${e.jobTitle||e.appliedRole||"—"}</p>
    </td>
    <td class="px-space-md py-space-md">
      ${window.statusBadge((e.stage||e.status||"new").toLowerCase())}
    </td>
    <td class="px-space-md py-space-md">
      <span class="text-status-screening font-label-sm text-label-sm" title="${e.rating||0}/5">${a}</span>
    </td>
    <td class="px-space-md py-space-md">
      <span class="font-body-sm text-body-sm text-outline">${window.fmtDate(e.appliedDate||e.createdAt)}</span>
    </td>
    <td class="px-space-xl py-space-md text-right">
      <div class="flex items-center justify-end gap-space-sm" onclick="event.stopPropagation()">
        <button onclick="event.stopPropagation(); window.advanceCandidate('${e.id}', '${e.stage}')" class="px-space-md py-space-xs rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors">Advance</button>
        <button onclick="event.stopPropagation(); window.viewCandidate('${e.id}')" class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high" title="View Profile">
          <span class="material-symbols-outlined text-[18px]">open_in_new</span>
        </button>
        <button onclick="event.stopPropagation(); window.deleteApplicant('${e.id}', '${n}')" class="w-8 h-8 flex items-center justify-center rounded-lg text-outline hover:text-error hover:bg-error-container/40 transition-colors" title="Delete Candidate">
          <span class="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    </td>
  </tr>`}function A(e){const a=e.source==="Google Form",o=`${e.firstName||""} ${e.lastName||e.name||""}`.trim()||"Applicant";return`
  <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer" onclick="window.viewCandidate('${e.id}')">
    <div class="flex items-center justify-between pb-space-xs mb-space-xs border-b border-outline-variant/10" onclick="event.stopPropagation()">
      <label class="flex items-center gap-2 cursor-pointer font-label-sm text-label-sm text-on-surface-variant" onclick="event.stopPropagation()">
        <input type="checkbox" class="applicant-cb w-4 h-4 rounded border-outline-variant text-primary focus:ring-secondary cursor-pointer" data-id="${e.id}" data-name="${o}" onclick="event.stopPropagation(); window.updateSelectedApplicantCount()"/>
        <span>Select</span>
      </label>
      <button onclick="event.stopPropagation(); window.deleteApplicant('${e.id}', '${o}')" class="text-outline hover:text-error p-1 flex items-center rounded hover:bg-error-container/30 transition-colors" title="Delete Candidate">
        <span class="material-symbols-outlined text-[18px]">delete</span>
      </button>
    </div>
    <div class="flex items-start justify-between mb-space-sm">
      <div class="flex items-center gap-space-md min-w-0">
        <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-semibold text-sm shrink-0">
          ${(e.firstName||e.name||"C")[0]?.toUpperCase()}
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-space-xs">
            <h3 class="font-headline-sm text-headline-sm text-on-surface truncate">${o}</h3>
            ${a?'<span class="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-label-sm text-[10px] font-semibold flex items-center gap-0.5" title="Applied via Google Form"><span class="material-symbols-outlined text-[12px]">description</span>Form</span>':""}
          </div>
          <p class="font-body-sm text-body-sm text-on-surface-variant truncate">${e.jobTitle||e.appliedRole||"General Application"}</p>
        </div>
      </div>
      ${window.statusBadge((e.stage||e.status||"new").toLowerCase())}
    </div>
    <div class="flex items-center justify-between pt-space-sm border-t border-outline-variant/20">
      <span class="font-body-sm text-body-sm text-outline">${e.email||"—"}</span>
      <span class="font-label-sm text-label-sm text-outline">${window.fmtDate(e.appliedDate||e.createdAt)}</span>
    </div>
  </div>`}function x(e,a={}){return`
  <div class="p-6 flex flex-col gap-space-lg">
    <div class="flex items-center justify-between">
      <h2 class="font-headline-md text-headline-md text-on-surface">${a.id?"Edit Candidate":"Add Candidate"}</h2>
      <button onclick="window.closeModal()" class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <form id="applicant-form" class="flex flex-col gap-space-lg">
      <input type="hidden" id="applicant-id" value="${a.id||""}"/>
      <div class="grid grid-cols-2 gap-space-md">
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">First Name *</label>
          <input id="app-firstname" type="text" required value="${a.firstName||""}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="First"/>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Last Name *</label>
          <input id="app-lastname" type="text" required value="${a.lastName||""}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="Last"/>
        </div>
        <div class="col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Email *</label>
          <input id="app-email" type="email" required value="${a.email||""}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="candidate@email.com"/>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Phone</label>
          <input id="app-phone" type="tel" value="${a.phone||""}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="+1 (555) 000-0000"/>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Applied Role *</label>
          <select id="app-job" required class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary appearance-none">
            <option value="">Select job</option>
            ${e.map(o=>`<option value="${o.id}" ${a.jobId===o.id?"selected":""}>${o.title}</option>`).join("")}
          </select>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Experience (years)</label>
          <input id="app-exp" type="number" min="0" value="${a.yearsExperience||""}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="5"/>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Current Company</label>
          <input id="app-company" type="text" value="${a.currentCompany||""}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="ACME Corp"/>
        </div>
        <div class="col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">LinkedIn URL</label>
          <input id="app-linkedin" type="url" value="${a.linkedinUrl||""}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="https://linkedin.com/in/..."/>
        </div>
        <div class="col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Resume / CV</label>
          <input id="app-resume" type="file" accept=".pdf,.doc,.docx"
            class="h-11 px-space-md py-2.5 bg-surface-container-low rounded-lg text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-primary file:text-on-primary file:text-sm file:font-medium file:cursor-pointer"/>
        </div>
        <div class="col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Notes</label>
          <textarea id="app-notes" rows="3" class="px-space-md py-space-sm bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary resize-none" placeholder="Internal notes about this candidate...">${a.notes||""}</textarea>
        </div>
      </div>
      <div id="applicant-form-error" class="hidden text-error font-body-sm text-body-sm bg-error-container/40 px-space-md py-space-sm rounded-lg"></div>
      <div class="flex gap-space-sm justify-end pt-space-sm border-t border-outline-variant/20">
        <button type="button" onclick="window.closeModal()" class="px-space-lg py-space-sm rounded-lg border border-outline-variant text-on-surface font-body-sm text-body-sm hover:bg-surface-container-low">Cancel</button>
        <button type="submit" id="applicant-submit" class="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-secondary transition-colors shadow-md flex items-center gap-space-xs">
          <span class="material-symbols-outlined text-[18px]">save</span>
          ${a.id?"Save Changes":"Add Candidate"}
        </button>
      </div>
    </form>
  </div>`}function C(e,a){["add-applicant-btn","add-applicant-btn-mobile"].forEach(t=>{e.querySelector(`#${t}`)?.addEventListener("click",()=>{window.openModal(x(a)),S(a)})}),window.updateSelectedApplicantCount=()=>{const t=Array.from(e.querySelectorAll(".applicant-cb:checked")).map(p=>p.dataset.id),s=Array.from(new Set(t)).length,c=e.querySelector("#selected-count"),d=e.querySelector("#selected-count-mobile"),i=e.querySelector("#delete-selected-btn"),r=e.querySelector("#delete-selected-btn-mobile"),u=e.querySelector("#select-all-applicants");c&&(c.textContent=s),d&&(d.textContent=s),i&&(s>0?i.classList.remove("hidden"):i.classList.add("hidden")),r&&(s>0?r.classList.remove("hidden"):r.classList.add("hidden"));const m=e.querySelectorAll(".applicant-cb");u&&(u.checked=m.length>0&&Array.from(m).every(p=>p.checked))},e.querySelector("#select-all-applicants")?.addEventListener("change",t=>{const l=t.target.checked;e.querySelectorAll(".applicant-cb").forEach(s=>{s.checked=l}),window.updateSelectedApplicantCount()});const o=()=>{const t=Array.from(e.querySelectorAll(".applicant-cb:checked")).map(s=>s.dataset.id),l=Array.from(new Set(t));l.length!==0&&window.confirmDialog(`Are you sure you want to delete ${l.length} selected candidate(s)? This action cannot be undone.`,async()=>{try{await Promise.all(l.map(s=>window.api.delete(`/applicants/${s}`))),window.showToast(`${l.length} candidate(s) deleted successfully!`,"success"),window.loadPage("applicants")}catch{window.showToast("Failed to delete selected candidates","error")}})};e.querySelector("#delete-selected-btn")?.addEventListener("click",o),e.querySelector("#delete-selected-btn-mobile")?.addEventListener("click",o),window.deleteApplicant=(t,l)=>{window.confirmDialog(`Are you sure you want to delete ${l?l.trim():"this candidate"}? This cannot be undone.`,async()=>{try{await window.api.delete(`/applicants/${t}`),window.showToast("Candidate deleted successfully!","success"),window.loadPage("applicants")}catch{window.showToast("Failed to delete candidate","error")}})};const n=window.debounce(t=>{const l=t.toLowerCase();e.querySelectorAll("#applicants-tbody tr").forEach(s=>s.style.display=s.textContent.toLowerCase().includes(l)?"":"none"),e.querySelectorAll("#applicants-mobile-list > div").forEach(s=>s.style.display=s.textContent.toLowerCase().includes(l)?"":"none")},300);e.querySelector("#applicant-search")?.addEventListener("input",t=>n(t.target.value)),e.querySelector("#applicant-search-mobile")?.addEventListener("input",t=>n(t.target.value)),e.querySelector("#applicant-job-filter")?.addEventListener("change",()=>f(e,{jobId:e.querySelector("#applicant-job-filter").value})),e.querySelector("#applicant-status-filter")?.addEventListener("change",()=>f(e)),e.querySelectorAll(".stage-pill").forEach(t=>{t.addEventListener("click",()=>{e.querySelectorAll(".stage-pill").forEach(s=>{s.classList.remove("bg-primary","text-on-primary"),s.classList.add("bg-surface-container-lowest","text-on-surface-variant","border","border-outline-variant/40")}),t.classList.add("bg-primary","text-on-primary"),t.classList.remove("bg-surface-container-lowest","text-on-surface-variant");const l=t.dataset.stage;e.querySelectorAll("#applicants-mobile-list > div").forEach(s=>{s.style.display=!l||s.textContent.toUpperCase().includes(l)?"":"none"})})}),window.viewCandidate=t=>window.loadPage("candidate-profile",{id:t}),window.advanceCandidate=async(t,l)=>{const s=["NEW","SCREENING","INTERVIEW","SELECTION","OFFER","HIRED"],c=s.indexOf(l?.toUpperCase()||"NEW"),d=s[Math.min(c+1,s.length-1)];try{await window.api.patch(`/applicants/${t}/stage`,{stage:d}),window.showToast(`Candidate advanced to ${d}`,"success"),window.loadPage("applicants")}catch{window.showToast("Failed to advance candidate","error")}}}function S(e){const a=document.getElementById("applicant-form");a&&a.addEventListener("submit",async o=>{o.preventDefault();const n=document.getElementById("applicant-submit"),t=document.getElementById("applicant-form-error");n.disabled=!0,n.innerHTML='<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>',t.classList.add("hidden");const l=document.getElementById("app-job").value,s=e.find(i=>i.id===l),c={firstName:document.getElementById("app-firstname").value,lastName:document.getElementById("app-lastname").value,email:document.getElementById("app-email").value,phone:document.getElementById("app-phone").value,jobId:l,jobTitle:s?.title,yearsExperience:parseInt(document.getElementById("app-exp").value)||0,currentCompany:document.getElementById("app-company").value,linkedinUrl:document.getElementById("app-linkedin").value,notes:document.getElementById("app-notes").value,stage:"NEW"},d=document.getElementById("app-resume").files[0];if(d)try{const{getStorage:i,ref:r,uploadBytes:u,getDownloadURL:m}=await h(async()=>{const{getStorage:g,ref:y,uploadBytes:v,getDownloadURL:w}=await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js");return{getStorage:g,ref:y,uploadBytes:v,getDownloadURL:w}},[]),p=r(window.firebaseStorage,`resumes/${Date.now()}_${d.name}`),b=await u(p,d);c.resumeUrl=await m(b.ref)}catch(i){console.warn("Resume upload failed:",i)}try{await window.api.post("/applicants",c),window.showToast("Candidate added successfully!","success"),window.closeModal(),window.loadPage("applicants")}catch(i){t.textContent=i.message,t.classList.remove("hidden"),n.disabled=!1,n.innerHTML='<span class="material-symbols-outlined text-[18px]">save</span> Add Candidate'}})}export{f as render};
