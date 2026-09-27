async function d(e){let t=[];try{t=await window.api.get("/applicants?stages=SELECTION")}catch{t=r()}e.innerHTML=n(t),l()}function n(e){return`
  <!-- ═══ DESKTOP ═══ -->
  <div class="hidden lg:block p-8 max-w-7xl mx-auto w-full">
    <div class="flex flex-col gap-space-xl">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">Candidate Selection</h1>
          <p class="font-body-md text-body-md text-on-surface-variant">Final review and hiring decision for shortlisted candidates</p>
        </div>
      </div>

      ${e.length===0?`
        <div class="flex flex-col items-center justify-center py-24 gap-space-md text-on-surface-variant">
          <span class="material-symbols-outlined text-[64px] text-outline">checklist</span>
          <h2 class="font-headline-md text-headline-md">No candidates in selection</h2>
          <p class="font-body-md text-body-md text-outline">Move candidates from the Screening or Interview stage to begin selection.</p>
          <button onclick="window.loadPage('screening')" class="mt-space-md px-space-xl py-space-sm rounded-lg bg-primary text-on-primary font-body-sm text-body-sm hover:bg-secondary transition-colors shadow-md">Go to Screening</button>
        </div>
      `:`
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-space-xl">
        ${e.map(i).join("")}
      </div>`}
    </div>
  </div>

  <!-- ═══ MOBILE ═══ -->
  <div class="lg:hidden flex flex-col w-full px-margin py-space-md space-y-space-lg pb-24">
    <div>
      <h1 class="font-headline-sm text-headline-sm text-on-surface">Selection</h1>
      <p class="font-body-sm text-body-sm text-on-surface-variant">${e.length} candidates in final review</p>
    </div>
    <div class="flex flex-col gap-space-md">
      ${e.length===0?`<div class="flex flex-col items-center justify-center py-16 gap-space-md text-on-surface-variant">
            <span class="material-symbols-outlined text-[48px]">checklist</span>
            <p class="font-body-md text-body-md">No candidates in selection stage</p>
          </div>`:e.map(o).join("")}
    </div>
  </div>`}function i(e){const t=Array.from({length:5},(s,a)=>`<span class="${a<Math.round(e.rating||0)?"text-status-screening":"text-outline"}">★</span>`).join("");return`
  <div class="bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
    <!-- Card Header -->
    <div class="bg-gradient-to-r from-primary to-secondary p-space-lg flex items-center gap-space-md">
      <div class="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-on-primary font-bold text-xl shrink-0">
        ${(e.firstName||e.name||"C")[0]?.toUpperCase()}
      </div>
      <div class="min-w-0">
        <h3 class="font-headline-sm text-headline-sm text-on-primary truncate">${e.firstName||""} ${e.lastName||e.name||""}</h3>
        <p class="font-body-sm text-body-sm text-on-primary/70 truncate">${e.jobTitle||e.appliedRole||""}</p>
        <div class="flex mt-1">${t}</div>
      </div>
    </div>
    <!-- Details -->
    <div class="p-space-lg flex flex-col gap-space-md">
      <div class="grid grid-cols-2 gap-space-md">
        <div class="flex flex-col gap-0.5">
          <span class="font-label-sm text-label-sm text-outline uppercase tracking-wider">Experience</span>
          <span class="font-body-md text-body-md text-on-surface font-semibold">${e.yearsExperience||"—"} years</span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="font-label-sm text-label-sm text-outline uppercase tracking-wider">Current Company</span>
          <span class="font-body-md text-body-md text-on-surface font-semibold truncate">${e.currentCompany||"—"}</span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="font-label-sm text-label-sm text-outline uppercase tracking-wider">Interviews</span>
          <span class="font-body-md text-body-md text-on-surface font-semibold">${e.interviewCount||0} rounds</span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="font-label-sm text-label-sm text-outline uppercase tracking-wider">Expected CTC</span>
          <span class="font-body-md text-body-md text-on-surface font-semibold">${e.expectedSalary||"Negotiable"}</span>
        </div>
      </div>

      ${(e.skills||[]).length>0?`
        <div class="flex flex-wrap gap-space-xs">
          ${e.skills.map(s=>`<span class="badge-interview px-2 py-0.5 rounded-full font-label-sm text-label-sm">${s}</span>`).join("")}
        </div>`:""}

      ${e.notes?`<p class="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-low px-space-md py-space-sm rounded-lg">${e.notes}</p>`:""}

      <!-- Interviewer Feedback Summary -->
      <div class="bg-surface-container p-space-md rounded-lg">
        <span class="font-label-sm text-label-sm text-outline uppercase tracking-wider block mb-space-xs">Overall Assessment</span>
        <p class="font-body-sm text-body-sm text-on-surface">${e.assessment||"Strong technical skills. Cultural fit confirmed. Recommend hiring."}</p>
      </div>

      <!-- Decision Buttons -->
      <div class="flex gap-space-sm pt-space-xs border-t border-outline-variant/20">
        <button onclick="window.hireCandidate('${e.id}')" class="flex-1 py-2.5 rounded-xl bg-status-hired text-white font-headline-sm text-headline-sm flex items-center justify-center gap-space-xs hover:opacity-90 transition-opacity active:scale-95">
          <span class="material-symbols-outlined text-[20px]">celebration</span>
          Hire
        </button>
        <button onclick="window.sendToOffer('${e.id}')" class="flex-1 py-2.5 rounded-xl bg-secondary text-on-secondary font-headline-sm text-headline-sm flex items-center justify-center gap-space-xs hover:opacity-90 transition-opacity active:scale-95">
          <span class="material-symbols-outlined text-[20px]">local_offer</span>
          Send Offer
        </button>
        <button onclick="window.rejectCandidate('${e.id}')" class="py-2.5 px-space-md rounded-xl border border-error text-error font-headline-sm text-headline-sm flex items-center justify-center gap-space-xs hover:bg-error-container transition-colors">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
    </div>
  </div>`}function o(e){return`
  <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
    <div class="flex items-start justify-between mb-space-md">
      <div class="flex items-center gap-space-md min-w-0">
        <div class="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold shrink-0">
          ${(e.firstName||e.name||"C")[0]?.toUpperCase()}
        </div>
        <div class="min-w-0">
          <h3 class="font-headline-sm text-headline-sm text-on-surface truncate">${e.firstName||""} ${e.lastName||e.name||""}</h3>
          <p class="font-body-sm text-body-sm text-on-surface-variant truncate">${e.jobTitle||e.appliedRole||""}</p>
          <p class="font-label-sm text-label-sm text-outline">${e.yearsExperience||0}y exp • ${e.currentCompany||"—"}</p>
        </div>
      </div>
      <div class="text-status-screening shrink-0">
        ${"★".repeat(Math.round(e.rating||0))}${"☆".repeat(5-Math.round(e.rating||0))}
      </div>
    </div>
    <div class="flex gap-space-sm">
      <button onclick="window.hireCandidate('${e.id}')" class="flex-1 py-2.5 rounded-xl bg-status-hired text-white font-label-md text-label-md flex items-center justify-center gap-1 min-h-[44px] active:scale-95 transition-transform">
        <span class="material-symbols-outlined text-[18px]">celebration</span> Hire
      </button>
      <button onclick="window.sendToOffer('${e.id}')" class="flex-1 py-2.5 rounded-xl bg-secondary text-on-secondary font-label-md text-label-md flex items-center justify-center gap-1 min-h-[44px] active:scale-95 transition-transform">
        <span class="material-symbols-outlined text-[18px]">local_offer</span> Offer
      </button>
      <button onclick="window.rejectCandidate('${e.id}')" class="w-11 rounded-xl border border-error text-error flex items-center justify-center min-h-[44px] active:scale-95 transition-transform">
        <span class="material-symbols-outlined text-[20px]">close</span>
      </button>
    </div>
  </div>`}function l(e){window.hireCandidate=t=>{window.confirmDialog("Mark this candidate as HIRED?",async()=>{try{await window.api.patch(`/applicants/${t}/stage`,{stage:"HIRED"}),window.showToast("🎉 Candidate hired successfully!","success"),window.loadPage("selection")}catch{window.showToast("Failed to update status","error")}})},window.sendToOffer=t=>{window.loadPage("job-offers",{candidateId:t})},window.rejectCandidate=t=>{window.confirmDialog("Reject this candidate?",async()=>{try{await window.api.patch(`/applicants/${t}/stage`,{stage:"REJECTED"}),window.showToast("Candidate rejected","info"),window.loadPage("selection")}catch{window.showToast("Failed to update status","error")}})}}function r(){return[{id:"3",firstName:"Marcus",lastName:"Chen",email:"marcus@email.com",jobTitle:"DevOps Lead",stage:"SELECTION",rating:4.5,yearsExperience:8,currentCompany:"Amazon",skills:["Kubernetes","Terraform","AWS","CI/CD"],interviewCount:3,expectedSalary:"$130k - $150k",assessment:"Excellent system design skills. Led complex migrations at scale. Strong leadership qualities."},{id:"6",firstName:"Sofia",lastName:"Martinez",email:"sofia@email.com",jobTitle:"UX Designer",stage:"SELECTION",rating:4,yearsExperience:6,currentCompany:"Adobe",skills:["Figma","User Research","Design Systems","Prototyping"],interviewCount:2,expectedSalary:"$95k - $115k",assessment:"Creative portfolio. Strong in research methodology. Good cultural fit with team."},{id:"9",firstName:"David",lastName:"Lee",email:"david@email.com",jobTitle:"Backend Engineer",stage:"SELECTION",rating:4,yearsExperience:4,currentCompany:"Stripe",skills:["Java","Spring Boot","PostgreSQL","Redis"],interviewCount:3,expectedSalary:"$110k - $130k",assessment:"Solid technical foundation. Good problem-solving. Needs more exposure to distributed systems."}]}export{d as render};
