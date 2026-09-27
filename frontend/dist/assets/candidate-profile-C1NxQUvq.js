async function w(e,i={}){const l=i.id;let n=null,a=[],o=[];try{[n,a,o]=await Promise.all([window.api.get(`/applicants/${l}`),window.api.get(`/interviews?candidateId=${l}`),window.api.get(`/applicants/${l}/notes`)])}catch{n=u(l),a=b(),o=g()}if(!n){e.innerHTML='<div class="flex items-center justify-center h-64 text-on-surface-variant"><p>Candidate not found</p></div>';return}e.innerHTML=x(n,a,o),f(e,n)}function x(e,i,l){const n=["NEW","SCREENING","INTERVIEW","SELECTION","OFFER","HIRED"],a=n.indexOf(e.stage?.toUpperCase()||"NEW"),o=Array.from({length:5},(t,s)=>`<button class="star-btn text-[20px] ${s<Math.round(e.rating||0)?"text-status-screening":"text-outline"}" data-star="${s+1}">★</button>`).join("");return`
  <!-- ═══ DESKTOP ═══ -->
  <div class="hidden lg:block p-8 max-w-7xl mx-auto w-full">
    <div class="flex flex-col gap-space-xl">
      <!-- Back Button -->
      <button onclick="window.history.back(); window.loadPage('applicants')" class="flex items-center gap-space-sm text-on-surface-variant hover:text-on-surface transition-colors self-start">
        <span class="material-symbols-outlined text-[20px]">arrow_back</span>
        <span class="font-body-md text-body-md">Back to Applicants</span>
      </button>

      <!-- Profile Header -->
      <div class="bg-gradient-to-r from-primary to-secondary rounded-2xl p-space-xl flex items-center justify-between">
        <div class="flex items-center gap-space-xl">
          <div class="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-on-primary font-bold text-3xl shrink-0">
            ${(e.firstName||e.name||"C")[0]?.toUpperCase()}
          </div>
          <div>
            <h1 class="font-headline-lg text-headline-lg text-on-primary">${e.firstName||""} ${e.lastName||e.name||""}</h1>
            <p class="font-body-lg text-body-lg text-on-primary/80">${e.jobTitle||e.appliedRole||""}</p>
            <div class="flex items-center gap-space-lg mt-space-sm">
              <span class="flex items-center gap-1 text-on-primary/70 font-body-sm text-body-sm">
                <span class="material-symbols-outlined text-[16px]">email</span>${e.email}
              </span>
              ${e.phone?`<span class="flex items-center gap-1 text-on-primary/70 font-body-sm text-body-sm"><span class="material-symbols-outlined text-[16px]">phone</span>${e.phone}</span>`:""}
              ${e.linkedinUrl?`<a href="${e.linkedinUrl}" target="_blank" class="flex items-center gap-1 text-on-primary/70 hover:text-on-primary font-body-sm text-body-sm"><span class="material-symbols-outlined text-[16px]">link</span>LinkedIn</a>`:""}
            </div>
          </div>
        </div>
        <div class="flex flex-col items-end gap-space-md">
          ${window.statusBadge((e.stage||"new").toLowerCase())}
          <div class="flex items-center gap-space-xs" id="star-rating">
            ${o}
          </div>
          ${e.resumeUrl?`<a href="${e.resumeUrl}" target="_blank" class="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-white/20 text-on-primary font-label-md text-label-md hover:bg-white/30 transition-colors"><span class="material-symbols-outlined text-[18px]">description</span>View Resume</a>`:""}
        </div>
      </div>

      <!-- Pipeline Progress -->
      <div class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm">
        <span class="font-headline-sm text-headline-sm text-on-surface block mb-space-lg">Recruitment Pipeline</span>
        <div class="flex items-center gap-space-xs">
          ${n.map((t,s)=>{const d=s<a,c=s===a;return`
            <div class="flex items-center ${s<n.length-1?"flex-1":""}">
              <div class="flex flex-col items-center gap-space-xs">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${c?"bg-secondary text-on-secondary":d?"bg-status-hired text-white":"bg-surface-container text-outline"}">
                  ${d?'<span class="material-symbols-outlined text-[16px]">check</span>':s+1}
                </div>
                <span class="font-label-sm text-label-sm ${c?"text-secondary font-semibold":d?"text-status-hired":"text-outline"} whitespace-nowrap">${t[0]+t.slice(1).toLowerCase()}</span>
              </div>
              ${s<n.length-1?`<div class="flex-1 h-0.5 mx-2 ${s<a?"bg-status-hired":"bg-surface-container-highest"}"></div>`:""}
            </div>`}).join("")}
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
        <!-- Left: Details + Interviews -->
        <div class="lg:col-span-8 flex flex-col gap-space-xl">
          <!-- Professional Details -->
          <div class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm">
            <span class="font-headline-sm text-headline-sm text-on-surface block mb-space-lg">Professional Details</span>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-space-xl">
              <div class="flex flex-col gap-space-xs">
                <span class="font-label-sm text-label-sm text-outline uppercase tracking-wider">Experience</span>
                <span class="font-body-md text-body-md text-on-surface font-semibold">${e.yearsExperience||0} years</span>
              </div>
              <div class="flex flex-col gap-space-xs">
                <span class="font-label-sm text-label-sm text-outline uppercase tracking-wider">Current Company</span>
                <span class="font-body-md text-body-md text-on-surface font-semibold">${e.currentCompany||"—"}</span>
              </div>
              <div class="flex flex-col gap-space-xs">
                <span class="font-label-sm text-label-sm text-outline uppercase tracking-wider">Expected Salary</span>
                <span class="font-body-md text-body-md text-on-surface font-semibold">${e.expectedSalary||"Negotiable"}</span>
              </div>
              <div class="flex flex-col gap-space-xs">
                <span class="font-label-sm text-label-sm text-outline uppercase tracking-wider">Notice Period</span>
                <span class="font-body-md text-body-md text-on-surface font-semibold">${e.noticePeriod||"Immediate"}</span>
              </div>
              <div class="flex flex-col gap-space-xs">
                <span class="font-label-sm text-label-sm text-outline uppercase tracking-wider">Location</span>
                <span class="font-body-md text-body-md text-on-surface font-semibold">${e.location||"—"}</span>
              </div>
              <div class="flex flex-col gap-space-xs">
                <span class="font-label-sm text-label-sm text-outline uppercase tracking-wider">Applied On</span>
                <span class="font-body-md text-body-md text-on-surface font-semibold">${window.fmtDate(e.appliedDate||e.createdAt)}</span>
              </div>
            </div>
            ${(e.skills||[]).length>0?`
            <div class="mt-space-lg pt-space-lg border-t border-outline-variant/20">
              <span class="font-label-sm text-label-sm text-outline uppercase tracking-wider block mb-space-sm">Skills</span>
              <div class="flex flex-wrap gap-space-xs">
                ${e.skills.map(t=>`<span class="badge-interview px-3 py-1 rounded-full font-label-md text-label-md">${t}</span>`).join("")}
              </div>
            </div>`:""}
          </div>

          ${e.rawFormResponses&&typeof e.rawFormResponses=="object"?`
          <!-- Google Form Raw Spreadsheet Responses -->
          <div class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm">
            <div class="flex items-center gap-space-sm mb-space-lg">
              <span class="material-symbols-outlined text-purple-600 text-[24px]">description</span>
              <span class="font-headline-sm text-headline-sm text-on-surface">Google Spreadsheet Responses (Exact Entry)</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md bg-surface-container-low p-space-lg rounded-xl">
              ${Object.entries(e.rawFormResponses).map(([t,s])=>`
                <div class="flex flex-col gap-0.5 bg-surface-container-lowest p-space-md rounded-lg shadow-2xs">
                  <span class="font-label-sm text-label-sm text-outline font-medium">${t}</span>
                  <span class="font-body-md text-body-md text-on-surface font-semibold">${s!=null&&s!==""?typeof s=="object"?JSON.stringify(s):s:"—"}</span>
                </div>
              `).join("")}
            </div>
          </div>`:""}

          <!-- Interview History -->
          <div class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm">
            <span class="font-headline-sm text-headline-sm text-on-surface block mb-space-lg">Interview History (${i.length})</span>
            ${i.length>0?`
            <div class="flex flex-col gap-space-md">
              ${i.map(t=>`
              <div class="flex items-center gap-space-md p-space-md rounded-lg bg-surface-container-low">
                <div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary shrink-0">
                  <span class="material-symbols-outlined text-[20px]">video_call</span>
                </div>
                <div class="flex-1">
                  <p class="font-headline-sm text-headline-sm text-on-surface">${t.interviewType||"Interview"}</p>
                  <p class="font-body-sm text-body-sm text-on-surface-variant">${window.fmtDate(t.scheduledAt)} at ${window.fmtTime(t.scheduledAt)} • ${t.duration||60} min</p>
                </div>
                ${window.statusBadge((t.status||"scheduled").toLowerCase())}
              </div>`).join("")}
            </div>`:'<p class="font-body-md text-body-md text-outline">No interviews scheduled yet.</p>'}
          </div>
        </div>

        <!-- Right: Actions + Notes -->
        <div class="lg:col-span-4 flex flex-col gap-space-xl">
          <!-- Quick Actions -->
          <div class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm">
            <span class="font-headline-sm text-headline-sm text-on-surface block mb-space-lg">Actions</span>
            <div class="flex flex-col gap-space-sm">
              <button onclick="window.advanceCandidateStage('${e.id}','${e.stage}')" class="w-full flex items-center gap-space-md px-space-md py-space-sm rounded-lg bg-secondary text-on-secondary hover:opacity-90 transition-opacity">
                <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
                <span class="font-body-md text-body-md">Advance to Next Stage</span>
              </button>
              <button onclick="window.loadPage('interviews',{candidateId:'${e.id}'})" class="w-full flex items-center gap-space-md px-space-md py-space-sm rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors">
                <span class="material-symbols-outlined text-[20px]">calendar_add_on</span>
                <span class="font-body-md text-body-md">Schedule Interview</span>
              </button>
              <button onclick="window.loadPage('job-offers',{candidateId:'${e.id}'})" class="w-full flex items-center gap-space-md px-space-md py-space-sm rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors">
                <span class="material-symbols-outlined text-[20px]">local_offer</span>
                <span class="font-body-md text-body-md">Send Offer</span>
              </button>
              <button onclick="window.rejectFromProfile('${e.id}')" class="w-full flex items-center gap-space-md px-space-md py-space-sm rounded-lg border border-error text-error hover:bg-error-container transition-colors">
                <span class="material-symbols-outlined text-[20px]">block</span>
                <span class="font-body-md text-body-md">Reject Candidate</span>
              </button>
            </div>
          </div>

          <!-- Notes -->
          <div class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm">
            <span class="font-headline-sm text-headline-sm text-on-surface block mb-space-lg">Internal Notes</span>
            <div class="flex flex-col gap-space-md mb-space-lg" id="notes-list">
              ${l.map(t=>`
              <div class="bg-surface-container-low p-space-md rounded-lg">
                <p class="font-body-sm text-body-sm text-on-surface">${t.content}</p>
                <p class="font-label-sm text-label-sm text-outline mt-space-xs">${t.author||"You"} • ${window.timeAgo(t.createdAt)}</p>
              </div>`).join("")}
              ${l.length===0?'<p class="font-body-sm text-body-sm text-outline">No notes yet.</p>':""}
            </div>
            <div class="flex flex-col gap-space-sm">
              <textarea id="new-note" rows="3" class="px-space-md py-space-sm bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary resize-none text-body-sm" placeholder="Add a note..."></textarea>
              <button id="save-note-btn" class="w-full py-space-sm rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors flex items-center justify-center gap-space-xs">
                <span class="material-symbols-outlined text-[18px]">add</span>
                Add Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══ MOBILE ═══ -->
  <div class="lg:hidden flex flex-col w-full pb-24">
    <!-- Profile Header -->
    <div class="bg-gradient-to-r from-primary to-secondary p-space-lg">
      <button onclick="window.loadPage('applicants')" class="flex items-center gap-space-xs text-on-primary/70 hover:text-on-primary mb-space-md">
        <span class="material-symbols-outlined text-[20px]">arrow_back</span>
        <span class="font-body-sm text-body-sm">Back</span>
      </button>
      <div class="flex items-center gap-space-md">
        <div class="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-on-primary font-bold text-xl shrink-0">
          ${(e.firstName||e.name||"C")[0]?.toUpperCase()}
        </div>
        <div class="min-w-0">
          <h1 class="font-headline-sm text-headline-sm text-on-primary truncate">${e.firstName||""} ${e.lastName||e.name||""}</h1>
          <p class="font-body-sm text-body-sm text-on-primary/80 truncate">${e.jobTitle||e.appliedRole||""}</p>
          <div class="flex items-center gap-space-md mt-space-xs">
            ${window.statusBadge((e.stage||"new").toLowerCase())}
            <span class="text-status-screening">${"★".repeat(Math.round(e.rating||0))}${"☆".repeat(5-Math.round(e.rating||0))}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="px-margin py-space-md flex flex-col gap-space-lg">
      <!-- Contact Info -->
      <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
        <div class="flex flex-col gap-space-sm">
          <div class="flex items-center gap-space-md">
            <span class="material-symbols-outlined text-outline text-[20px]">email</span>
            <span class="font-body-sm text-body-sm text-on-surface">${e.email}</span>
          </div>
          ${e.phone?`<div class="flex items-center gap-space-md"><span class="material-symbols-outlined text-outline text-[20px]">phone</span><span class="font-body-sm text-body-sm text-on-surface">${e.phone}</span></div>`:""}
          ${e.linkedinUrl?`<div class="flex items-center gap-space-md"><span class="material-symbols-outlined text-outline text-[20px]">link</span><a href="${e.linkedinUrl}" target="_blank" class="font-body-sm text-body-sm text-secondary">LinkedIn Profile</a></div>`:""}
        </div>
      </div>

      <!-- Details -->
      <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
        <h2 class="font-headline-sm text-headline-sm text-on-surface mb-space-md">Details</h2>
        <div class="grid grid-cols-2 gap-space-md">
          <div><span class="font-label-sm text-label-sm text-outline block">Experience</span><span class="font-body-md text-body-md text-on-surface font-semibold">${e.yearsExperience||0}y</span></div>
          <div><span class="font-label-sm text-label-sm text-outline block">Company</span><span class="font-body-md text-body-md text-on-surface font-semibold truncate">${e.currentCompany||"—"}</span></div>
          <div><span class="font-label-sm text-label-sm text-outline block">Expected CTC</span><span class="font-body-md text-body-md text-on-surface font-semibold">${e.expectedSalary||"Negotiable"}</span></div>
          <div><span class="font-label-sm text-label-sm text-outline block">Notice</span><span class="font-body-md text-body-md text-on-surface font-semibold">${e.noticePeriod||"Immediate"}</span></div>
        </div>
        ${(e.skills||[]).length>0?`
          <div class="flex flex-wrap gap-space-xs mt-space-md pt-space-md border-t border-outline-variant/20">
            ${e.skills.map(t=>`<span class="badge-interview px-2.5 py-1 rounded-full font-label-sm text-label-sm">${t}</span>`).join("")}
          </div>`:""}
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col gap-space-sm">
        <button onclick="window.advanceCandidateStage('${e.id}','${e.stage}')" class="w-full py-3 rounded-xl bg-secondary text-on-secondary font-headline-sm text-headline-sm flex items-center justify-center gap-space-xs min-h-[48px] active:scale-95 transition-transform">
          <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
          Advance Stage
        </button>
        <div class="grid grid-cols-2 gap-space-sm">
          <button onclick="window.loadPage('interviews')" class="py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface font-label-md text-label-md flex items-center justify-center gap-1 min-h-[44px]">
            <span class="material-symbols-outlined text-[18px]">calendar_add_on</span> Interview
          </button>
          <button onclick="window.loadPage('job-offers',{candidateId:'${e.id}'})" class="py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface font-label-md text-label-md flex items-center justify-center gap-1 min-h-[44px]">
            <span class="material-symbols-outlined text-[18px]">local_offer</span> Send Offer
          </button>
        </div>
      </div>

      <!-- Notes -->
      <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
        <h2 class="font-headline-sm text-headline-sm text-on-surface mb-space-md">Notes</h2>
        <div class="flex flex-col gap-space-sm mb-space-md" id="notes-list-mobile">
          ${l.map(t=>`
          <div class="bg-surface-container-low p-space-sm rounded-lg">
            <p class="font-body-sm text-body-sm text-on-surface">${t.content}</p>
            <p class="font-label-sm text-label-sm text-outline mt-space-xs">${window.timeAgo(t.createdAt)}</p>
          </div>`).join("")}
          ${l.length===0?'<p class="font-body-sm text-body-sm text-outline">No notes yet.</p>':""}
        </div>
        <textarea id="new-note-mobile" rows="3" class="w-full px-space-md py-space-sm bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary resize-none text-body-sm mb-space-sm" placeholder="Add a note..."></textarea>
        <button id="save-note-btn-mobile" class="w-full py-space-sm rounded-lg bg-surface-container text-on-surface font-label-md text-label-md active:scale-95 transition-transform flex items-center justify-center gap-space-xs">
          <span class="material-symbols-outlined text-[18px]">add</span> Add Note
        </button>
      </div>
    </div>
  </div>`}function f(e,i,l){e.querySelectorAll(".star-btn").forEach(a=>{a.addEventListener("click",async()=>{const o=parseInt(a.dataset.star);try{await window.api.patch(`/applicants/${i.id}/rating`,{rating:o}),window.showToast("Rating updated!","success"),e.querySelectorAll(".star-btn").forEach((t,s)=>{t.className=`star-btn text-[20px] ${s<o?"text-status-screening":"text-outline"}`})}catch{window.showToast("Failed to update rating","error")}})});const n=async(a,o)=>{const t=document.getElementById(a);if(!t?.value.trim())return;const s=document.getElementById(o);s.disabled=!0;try{const d=await window.api.post(`/applicants/${i.id}/notes`,{content:t.value.trim()});t.value="";const c=`<div class="bg-surface-container-low p-space-sm rounded-lg"><p class="font-body-sm text-body-sm text-on-surface">${d.content||t.value}</p><p class="font-label-sm text-label-sm text-outline mt-space-xs">Just now</p></div>`;["notes-list","notes-list-mobile"].forEach(m=>{const r=document.getElementById(m);if(r){const p=r.querySelector("p");p&&p.remove(),r.insertAdjacentHTML("beforeend",c)}}),window.showToast("Note added!","success")}catch{window.showToast("Failed to save note","error")}finally{s.disabled=!1}};document.getElementById("save-note-btn")?.addEventListener("click",()=>n("new-note","save-note-btn")),document.getElementById("save-note-btn-mobile")?.addEventListener("click",()=>n("new-note-mobile","save-note-btn-mobile")),window.advanceCandidateStage=async(a,o)=>{const t=["NEW","SCREENING","INTERVIEW","SELECTION","OFFER","HIRED"],s=t.indexOf(o?.toUpperCase()||"NEW");if(s>=t.length-1){window.showToast("Candidate is already at final stage","info");return}const d=t[s+1];try{await window.api.patch(`/applicants/${a}/stage`,{stage:d}),window.showToast(`Advanced to ${d}`,"success"),window.loadPage("candidate-profile",{id:a})}catch{window.showToast("Failed to advance stage","error")}},window.rejectFromProfile=a=>{window.confirmDialog("Reject this candidate?",async()=>{try{await window.api.patch(`/applicants/${a}/stage`,{stage:"REJECTED"}),window.showToast("Candidate rejected","info"),window.loadPage("applicants")}catch{window.showToast("Failed to reject","error")}})}}function u(e){return{id:e||"1",firstName:"Alex",lastName:"Rivera",email:"alex.rivera@email.com",phone:"+1 (555) 234-5678",jobTitle:"Sr. React Engineer",stage:"INTERVIEW",rating:4,yearsExperience:5,currentCompany:"Google",expectedSalary:"$120k-$140k",noticePeriod:"30 days",location:"San Francisco, CA",linkedinUrl:"https://linkedin.com/in/alexrivera",skills:["React","TypeScript","Node.js","GraphQL","AWS"],appliedDate:new Date(Date.now()-6048e5).toISOString(),notes:"Strong React skills. Previous Google experience is a plus."}}function b(){return[{id:"1",interviewType:"Technical",scheduledAt:new Date(Date.now()-3*864e5).toISOString(),duration:60,status:"COMPLETED"},{id:"2",interviewType:"HR/Culture",scheduledAt:new Date(Date.now()+864e5).toISOString(),duration:45,status:"SCHEDULED"}]}function g(){return[{id:"1",content:"Excellent technical skills. Strong React background. Culture fit looks good.",author:"Sarah Jenkins",createdAt:new Date(Date.now()-2*864e5).toISOString()},{id:"2",content:"Technical round passed with high marks. Recommend for next stage.",author:"David Kim",createdAt:new Date(Date.now()-864e5).toISOString()}]}export{w as render};
