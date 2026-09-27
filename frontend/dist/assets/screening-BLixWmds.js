async function m(e){let a=[];try{a=await window.api.get("/applicants?stages=NEW,SCREENING")}catch{a=p()}e.innerHTML=l(a),d(e)}function l(e){const a={NEW:[],SCREENING:[],SHORTLISTED:[],REJECTED:[]};return e.forEach(t=>{const s=t.stage?.toUpperCase()||"NEW";a[s]?a[s].push(t):a.NEW.push(t)}),`
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
        ${i("New Applications",a.NEW,"NEW","primary-container","text-on-primary-container")}
        ${i("Under Screening",a.SCREENING,"SCREENING","secondary-container","text-on-secondary")}
        ${i("Shortlisted",a.SHORTLISTED,"SHORTLISTED","status-hired-bg","text-status-hired")}
        ${i("Rejected",a.REJECTED,"REJECTED","error-container","text-error")}
      </div>
    </div>
  </div>

  <!-- ═══ MOBILE ═══ -->
  <div class="lg:hidden flex flex-col w-full px-margin py-space-md space-y-space-lg pb-24">
    <div>
      <h1 class="font-headline-sm text-headline-sm text-on-surface">Candidate Screening</h1>
      <p class="font-body-sm text-body-sm text-on-surface-variant">${e.length} candidates to review</p>
    </div>

    <div class="relative">
      <span class="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">search</span>
      <input id="screen-search-mobile" class="w-full h-11 pl-10 pr-space-md bg-surface-container-lowest rounded-lg text-on-surface placeholder:text-outline text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm" placeholder="Search candidates..."/>
    </div>

    <!-- Stage tabs -->
    <div class="flex gap-space-sm overflow-x-auto no-scrollbar -mx-margin px-margin">
      ${[["All",""],["New","NEW"],["Screening","SCREENING"],["Shortlisted","SHORTLISTED"],["Rejected","REJECTED"]].map(([t,s],n)=>`
        <button class="screen-tab shrink-0 px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all ${n===0?"bg-primary text-on-primary":"bg-surface-container-lowest text-on-surface-variant border border-outline-variant/40"}" data-stage="${s}">${t}</button>
      `).join("")}
    </div>

    <div id="screening-mobile-list" class="flex flex-col gap-space-md">
      ${e.map(t=>c(t)).join("")}
    </div>
  </div>`}function i(e,a,t,s,n){return`
  <div class="flex flex-col gap-space-md" data-stage="${t}">
    <div class="flex items-center justify-between p-space-md rounded-xl bg-${s}">
      <span class="font-headline-sm text-headline-sm ${n}">${e}</span>
      <span class="font-label-sm text-label-sm ${n} bg-white/20 px-2 py-0.5 rounded-full font-semibold">${a.length}</span>
    </div>
    <div class="flex flex-col gap-space-md min-h-[200px]">
      ${a.map(r=>o(r)).join("")}
      ${a.length===0?`<div class="flex items-center justify-center h-24 rounded-xl border-2 border-dashed border-outline-variant/40 text-on-surface-variant">
        <span class="font-body-sm text-body-sm text-outline">No candidates</span>
      </div>`:""}
    </div>
  </div>`}function o(e){return`
  <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer" onclick="window.viewCandidate('${e.id}')">
    <div class="flex items-center gap-space-sm mb-space-sm">
      <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary font-semibold text-sm shrink-0">
        ${(e.firstName||e.name||"C")[0]?.toUpperCase()}
      </div>
      <div class="min-w-0 flex-1">
        <p class="font-headline-sm text-headline-sm text-on-surface truncate">${e.firstName||""} ${e.lastName||e.name||""}</p>
        <p class="font-body-sm text-body-sm text-on-surface-variant truncate">${e.jobTitle||e.appliedRole||""}</p>
      </div>
    </div>
    <div class="flex items-center gap-space-sm mb-space-sm flex-wrap">
      ${(e.skills||[]).slice(0,3).map(a=>`<span class="badge-interview px-2 py-0.5 rounded-full font-label-sm text-label-sm">${a}</span>`).join("")}
    </div>
    <div class="flex items-center justify-between">
      <span class="font-body-sm text-body-sm text-outline">${e.yearsExperience||0}y exp • ${e.currentCompany||"—"}</span>
      <div class="flex gap-space-xs">
        <button onclick="event.stopPropagation(); window.updateStage('${e.id}','SHORTLISTED')" class="w-7 h-7 flex items-center justify-center rounded-lg bg-status-hired-bg text-status-hired hover:opacity-80 transition-opacity" title="Shortlist">
          <span class="material-symbols-outlined text-[16px]">thumb_up</span>
        </button>
        <button onclick="event.stopPropagation(); window.updateStage('${e.id}','REJECTED')" class="w-7 h-7 flex items-center justify-center rounded-lg bg-error-container text-error hover:opacity-80 transition-opacity" title="Reject">
          <span class="material-symbols-outlined text-[16px]">thumb_down</span>
        </button>
      </div>
    </div>
  </div>`}function c(e){return`
  <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm" data-stage="${e.stage}">
    <div class="flex items-start justify-between mb-space-sm">
      <div class="flex items-center gap-space-md min-w-0">
        <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-semibold text-sm shrink-0">
          ${(e.firstName||e.name||"C")[0]?.toUpperCase()}
        </div>
        <div class="min-w-0">
          <h3 class="font-headline-sm text-headline-sm text-on-surface truncate">${e.firstName||""} ${e.lastName||e.name||""}</h3>
          <p class="font-body-sm text-body-sm text-on-surface-variant truncate">${e.jobTitle||e.appliedRole||""}</p>
        </div>
      </div>
      ${window.statusBadge((e.stage||"new").toLowerCase())}
    </div>
    <div class="flex items-center gap-space-sm pt-space-sm border-t border-outline-variant/20">
      <button onclick="window.updateStage('${e.id}','SHORTLISTED')" class="flex-1 py-2 rounded-lg bg-status-hired-bg text-status-hired font-label-md text-label-md flex items-center justify-center gap-1 active:scale-95 transition-transform min-h-[44px]">
        <span class="material-symbols-outlined text-[18px]">thumb_up</span> Shortlist
      </button>
      <button onclick="window.updateStage('${e.id}','REJECTED')" class="flex-1 py-2 rounded-lg bg-error-container text-error font-label-md text-label-md flex items-center justify-center gap-1 active:scale-95 transition-transform min-h-[44px]">
        <span class="material-symbols-outlined text-[18px]">thumb_down</span> Reject
      </button>
      <button onclick="window.viewCandidate('${e.id}')" class="w-11 h-11 flex items-center justify-center rounded-lg bg-surface-container text-on-surface active:scale-95 transition-transform">
        <span class="material-symbols-outlined text-[20px]">open_in_new</span>
      </button>
    </div>
  </div>`}function d(e){const a=window.debounce(t=>{const s=t.toLowerCase();e.querySelectorAll("[data-stage]").forEach(n=>{n.querySelector("p")&&(n.style.display=n.textContent.toLowerCase().includes(s)?"":"none")})},300);e.querySelector("#screen-search")?.addEventListener("input",t=>a(t.target.value)),e.querySelector("#screen-search-mobile")?.addEventListener("input",t=>a(t.target.value)),e.querySelectorAll(".screen-tab").forEach(t=>{t.addEventListener("click",()=>{e.querySelectorAll(".screen-tab").forEach(n=>{n.classList.remove("bg-primary","text-on-primary"),n.classList.add("bg-surface-container-lowest","text-on-surface-variant","border","border-outline-variant/40")}),t.classList.add("bg-primary","text-on-primary"),t.classList.remove("bg-surface-container-lowest","text-on-surface-variant");const s=t.dataset.stage;e.querySelectorAll("#screening-mobile-list > div").forEach(n=>{n.style.display=!s||n.dataset.stage===s?"":"none"})})}),window.updateStage=async(t,s)=>{try{await window.api.patch(`/applicants/${t}/stage`,{stage:s}),window.showToast(`Candidate marked as ${s.toLowerCase()}`,"success"),window.loadPage("screening")}catch{window.showToast("Failed to update stage","error")}},window.viewCandidate=t=>window.loadPage("candidate-profile",{id:t})}function p(){return[{id:"1",firstName:"Alex",lastName:"Rivera",email:"alex@email.com",jobTitle:"Sr. React Engineer",stage:"NEW",yearsExperience:5,currentCompany:"Google",skills:["React","TypeScript","Node.js"]},{id:"5",firstName:"Ryan",lastName:"Patel",email:"ryan@email.com",jobTitle:"Sr. React Engineer",stage:"NEW",yearsExperience:3,currentCompany:"Startup",skills:["React","CSS"]},{id:"2",firstName:"Priya",lastName:"Sharma",email:"priya@email.com",jobTitle:"Product Manager",stage:"SCREENING",yearsExperience:7,currentCompany:"Meta",skills:["Product Strategy","Agile","Data Analysis"]},{id:"8",firstName:"David",lastName:"Lee",email:"david@email.com",jobTitle:"Backend Engineer",stage:"SCREENING",yearsExperience:4,currentCompany:"Stripe",skills:["Java","Spring Boot","PostgreSQL"]},{id:"6",firstName:"Sofia",lastName:"Martinez",email:"sofia@email.com",jobTitle:"UX Designer",stage:"SHORTLISTED",yearsExperience:6,currentCompany:"Adobe",skills:["Figma","User Research"]},{id:"7",firstName:"James",lastName:"Wong",email:"james@email.com",jobTitle:"Security Analyst",stage:"REJECTED",yearsExperience:2,currentCompany:"Unknown",skills:["Networking"]}]}export{m as render};
