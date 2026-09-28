import{_ as h}from"./index-Ck2rxaNa.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";async function c(e,a={}){let n=[],t=[];try{const l=a.jobId?`?jobId=${a.jobId}`:"";[n,t]=await Promise.all([window.api.get(`/applicants${l}`),window.api.get("/jobs?status=OPEN")])}catch{n=I(),t=[{id:"1",title:"Sr. React Engineer"},{id:"2",title:"Product Manager"},{id:"3",title:"DevOps Lead"}]}e.innerHTML=E(n,t,a.jobId),C(e,t)}function E(e,a,n){return`
  <!-- ═══ DESKTOP ═══ -->
  <div class="hidden lg:block p-8 max-w-7xl mx-auto w-full">
    <div class="flex flex-col gap-space-xl">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">Applicants</h1>
          <p class="font-body-md text-body-md text-on-surface-variant">${e.length} candidates across all open roles</p>
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
          ${a.map(t=>`<option value="${t.id}" ${n===t.id?"selected":""}>${t.title}</option>`).join("")}
        </select>
        <select id="applicant-status-filter" class="h-10 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary appearance-none pr-8">
          <option value="">All Stages</option>
          ${["New","Screening","Interview","Selection","Offer","Hired","Rejected"].map(t=>`<option value="${t.toUpperCase()}">${t}</option>`).join("")}
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
            ${e.map($).join("")}
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
      ${["All","New","Screening","Interview","Offer","Hired"].map((t,l)=>`
        <button class="stage-pill shrink-0 px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all ${l===0?"bg-primary text-on-primary":"bg-surface-container-lowest text-on-surface-variant border border-outline-variant/40"}" data-stage="${t==="All"?"":t.toUpperCase()}">${t}</button>
      `).join("")}
    </div>

    <div id="applicants-mobile-list" class="flex flex-col gap-space-md">
      ${e.map(S).join("")}
    </div>
  </div>

  <!-- Add/Edit Applicant Modal -->
  <div id="applicant-modal" class="modal-overlay hidden">
    <div class="modal-box">
      ${p(a)}
    </div>
  </div>`}function $(e){const a="★".repeat(Math.round(e.rating||0))+"☆".repeat(5-Math.round(e.rating||0)),n=e.source==="Google Form";return`
  <tr class="hover:bg-surface-container-low transition-colors cursor-pointer" onclick="window.viewCandidate('${e.id}')">
    <td class="px-space-xl py-space-md">
      <div class="flex items-center gap-space-md">
        <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary font-semibold text-sm shrink-0">
          ${(e.firstName||e.name||"C")[0]?.toUpperCase()}
        </div>
        <div>
          <div class="flex items-center gap-space-xs">
            <p class="font-headline-sm text-headline-sm text-on-surface">${e.firstName||""} ${e.lastName||e.name||""}</p>
            ${n?'<span class="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-label-sm text-[10px] font-semibold flex items-center gap-0.5" title="Applied via Google Form"><span class="material-symbols-outlined text-[12px]">description</span>Form</span>':""}
          </div>
          <p class="font-body-sm text-body-sm text-outline">${e.email}</p>
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
      <div class="flex items-center justify-end gap-space-sm" onclick="e => e.stopPropagation()">
        <button onclick="event.stopPropagation(); window.advanceCandidate('${e.id}', '${e.stage}')" class="px-space-md py-space-xs rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors">Advance</button>
        <button onclick="event.stopPropagation(); window.viewCandidate('${e.id}')" class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high">
          <span class="material-symbols-outlined text-[18px]">open_in_new</span>
        </button>
      </div>
    </td>
  </tr>`}function S(e){const a=e.source==="Google Form";return`
  <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer" onclick="window.viewCandidate('${e.id}')">
    <div class="flex items-start justify-between mb-space-sm">
      <div class="flex items-center gap-space-md min-w-0">
        <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-semibold text-sm shrink-0">
          ${(e.firstName||e.name||"C")[0]?.toUpperCase()}
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-space-xs">
            <h3 class="font-headline-sm text-headline-sm text-on-surface truncate">${e.firstName||""} ${e.lastName||e.name||""}</h3>
            ${a?'<span class="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-label-sm text-[10px] font-semibold flex items-center gap-0.5" title="Applied via Google Form"><span class="material-symbols-outlined text-[12px]">description</span>Form</span>':""}
          </div>
          <p class="font-body-sm text-body-sm text-on-surface-variant truncate">${e.jobTitle||e.appliedRole||"General Application"}</p>
        </div>
      </div>
      ${window.statusBadge((e.stage||e.status||"new").toLowerCase())}
    </div>
    <div class="flex items-center justify-between pt-space-sm border-t border-outline-variant/20">
      <span class="font-body-sm text-body-sm text-outline">${e.email}</span>
      <span class="font-label-sm text-label-sm text-outline">${window.fmtDate(e.appliedDate||e.createdAt)}</span>
    </div>
  </div>`}function p(e,a={}){return`
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
            ${e.map(n=>`<option value="${n.id}" ${a.jobId===n.id?"selected":""}>${n.title}</option>`).join("")}
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
  </div>`}function C(e,a){["add-applicant-btn","add-applicant-btn-mobile"].forEach(t=>{e.querySelector(`#${t}`)?.addEventListener("click",()=>{window.openModal(p(a)),N(a)})}),e.querySelector("#clear-all-applicants-btn")?.addEventListener("click",()=>{window.confirmDialog("Are you sure you want to remove ALL current applicants? This action cannot be undone.",async()=>{try{await window.api.delete("/applicants/all"),window.showToast("All current applicants removed successfully!","success"),window.loadPage("applicants")}catch{window.showToast("Failed to clear applicants","error")}})});const n=window.debounce(t=>{const l=t.toLowerCase();e.querySelectorAll("#applicants-tbody tr").forEach(s=>s.style.display=s.textContent.toLowerCase().includes(l)?"":"none"),e.querySelectorAll("#applicants-mobile-list > div").forEach(s=>s.style.display=s.textContent.toLowerCase().includes(l)?"":"none")},300);e.querySelector("#applicant-search")?.addEventListener("input",t=>n(t.target.value)),e.querySelector("#applicant-search-mobile")?.addEventListener("input",t=>n(t.target.value)),e.querySelector("#applicant-job-filter")?.addEventListener("change",()=>c(e,{jobId:e.querySelector("#applicant-job-filter").value})),e.querySelector("#applicant-status-filter")?.addEventListener("change",()=>c(e)),e.querySelectorAll(".stage-pill").forEach(t=>{t.addEventListener("click",()=>{e.querySelectorAll(".stage-pill").forEach(s=>{s.classList.remove("bg-primary","text-on-primary"),s.classList.add("bg-surface-container-lowest","text-on-surface-variant","border","border-outline-variant/40")}),t.classList.add("bg-primary","text-on-primary"),t.classList.remove("bg-surface-container-lowest","text-on-surface-variant");const l=t.dataset.stage;e.querySelectorAll("#applicants-mobile-list > div").forEach(s=>{s.style.display=!l||s.textContent.toUpperCase().includes(l)?"":"none"})})}),window.viewCandidate=t=>window.loadPage("candidate-profile",{id:t}),window.advanceCandidate=async(t,l)=>{const s=["NEW","SCREENING","INTERVIEW","SELECTION","OFFER","HIRED"],d=s.indexOf(l?.toUpperCase()||"NEW"),i=s[Math.min(d+1,s.length-1)];try{await window.api.patch(`/applicants/${t}/stage`,{stage:i}),window.showToast(`Candidate advanced to ${i}`,"success"),window.loadPage("applicants")}catch{window.showToast("Failed to advance candidate","error")}}}function N(e){const a=document.getElementById("applicant-form");a&&a.addEventListener("submit",async n=>{n.preventDefault();const t=document.getElementById("applicant-submit"),l=document.getElementById("applicant-form-error");t.disabled=!0,t.innerHTML='<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>',l.classList.add("hidden");const s=document.getElementById("app-job").value,d=e.find(o=>o.id===s),i={firstName:document.getElementById("app-firstname").value,lastName:document.getElementById("app-lastname").value,email:document.getElementById("app-email").value,phone:document.getElementById("app-phone").value,jobId:s,jobTitle:d?.title,yearsExperience:parseInt(document.getElementById("app-exp").value)||0,currentCompany:document.getElementById("app-company").value,linkedinUrl:document.getElementById("app-linkedin").value,notes:document.getElementById("app-notes").value,stage:"NEW"},r=document.getElementById("app-resume").files[0];if(r)try{const{getStorage:o,ref:m,uploadBytes:u,getDownloadURL:f}=await h(async()=>{const{getStorage:g,ref:y,uploadBytes:v,getDownloadURL:w}=await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js");return{getStorage:g,ref:y,uploadBytes:v,getDownloadURL:w}},[]),x=m(window.firebaseStorage,`resumes/${Date.now()}_${r.name}`),b=await u(x,r);i.resumeUrl=await f(b.ref)}catch(o){console.warn("Resume upload failed:",o)}try{await window.api.post("/applicants",i),window.showToast("Candidate added successfully!","success"),window.closeModal(),window.loadPage("applicants")}catch(o){l.textContent=o.message,l.classList.remove("hidden"),t.disabled=!1,t.innerHTML='<span class="material-symbols-outlined text-[18px]">save</span> Add Candidate'}})}function I(){return[{id:"1",firstName:"Alex",lastName:"Rivera",email:"alex@email.com",jobTitle:"Sr. React Engineer",stage:"INTERVIEW",rating:4,appliedDate:new Date(Date.now()-3*864e5).toISOString()},{id:"2",firstName:"Priya",lastName:"Sharma",email:"priya@email.com",jobTitle:"Product Manager",stage:"SCREENING",rating:3.5,appliedDate:new Date(Date.now()-5*864e5).toISOString()},{id:"3",firstName:"Marcus",lastName:"Chen",email:"marcus@email.com",jobTitle:"DevOps Lead",stage:"OFFER",rating:4.5,appliedDate:new Date(Date.now()-7*864e5).toISOString()},{id:"4",firstName:"Jennifer",lastName:"Kim",email:"jennifer@email.com",jobTitle:"Backend Engineer",stage:"HIRED",rating:5,appliedDate:new Date(Date.now()-14*864e5).toISOString()},{id:"5",firstName:"Ryan",lastName:"Patel",email:"ryan@email.com",jobTitle:"Sr. React Engineer",stage:"NEW",rating:2,appliedDate:new Date(Date.now()-1*864e5).toISOString()},{id:"6",firstName:"Sofia",lastName:"Martinez",email:"sofia@email.com",jobTitle:"UX Designer",stage:"SELECTION",rating:4,appliedDate:new Date(Date.now()-6*864e5).toISOString()},{id:"7",firstName:"James",lastName:"Wong",email:"james@email.com",jobTitle:"Security Analyst",stage:"REJECTED",rating:2,appliedDate:new Date(Date.now()-10*864e5).toISOString()}]}export{c as render};
