async function w(e){let a=[],l=[];try{[a,l]=await Promise.all([window.api.get("/interviews"),window.api.get("/applicants")])}catch{a=[],l=[]}e.innerHTML=f(a,l),g(e,l)}function f(e,a){const s=new Date().toDateString();return v(e),`
  <!-- ═══ DESKTOP ═══ -->
  <div class="hidden lg:block p-8 max-w-7xl mx-auto w-full">
    <div class="flex flex-col gap-space-xl">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">Interview Schedule</h1>
          <p class="font-body-md text-body-md text-on-surface-variant">${e.length} scheduled interviews</p>
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
            ${["ALL","SCHEDULED","COMPLETED","CANCELLED"].map(t=>`
              <button class="iv-filter px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all ${t==="ALL"?"bg-primary text-on-primary":"bg-surface-container text-on-surface-variant hover:bg-surface-container-high"}" data-filter="${t}">${t[0]+t.slice(1).toLowerCase()}</button>
            `).join("")}
          </div>
        </div>
        <div id="interviews-list" class="divide-y divide-outline-variant/20">
          ${e.length>0?e.map(x).join(""):'<div class="p-8 text-center text-on-surface-variant font-body-md text-body-md">No interviews scheduled.</div>'}
        </div>
      </div>
    </div>
  </div>

  <!-- ═══ MOBILE ═══ -->
  <div class="lg:hidden flex flex-col w-full px-margin py-space-md space-y-space-lg pb-24">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-headline-sm text-headline-sm text-on-surface">Interviews</h1>
        <p class="font-body-sm text-body-sm text-on-surface-variant">${e.filter(t=>new Date(t.scheduledAt).toDateString()===s).length} today</p>
      </div>
      <button id="schedule-btn-mobile" class="h-10 px-space-md flex items-center gap-space-xs rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold active:scale-95 transition-transform">
        <span class="material-symbols-outlined text-[18px]">add</span>
        <span>Schedule</span>
      </button>
    </div>

    <!-- Status Pills -->
    <div class="flex gap-space-sm overflow-x-auto no-scrollbar -mx-margin px-margin">
      ${["All","Today","This Week","Scheduled","Completed"].map((t,n)=>`
        <button class="iv-mobile-filter shrink-0 px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all ${n===0?"bg-primary text-on-primary":"bg-surface-container-lowest text-on-surface-variant border border-outline-variant/40"}" data-filter="${t}">${t}</button>
      `).join("")}
    </div>

    <div id="interviews-mobile-list" class="flex flex-col gap-space-md">
      ${e.map(b).join("")}
    </div>
  </div>

  <!-- Schedule Modal -->
  <div id="schedule-modal" class="modal-overlay hidden">
    <div class="modal-box">
      ${m(a)}
    </div>
  </div>`}function x(e){const a=new Date(e.scheduledAt),l=a.toDateString()===new Date().toDateString();return`
  <div class="flex items-center gap-space-xl px-space-xl py-space-md hover:bg-surface-container-low transition-colors">
    <div class="flex flex-col items-center min-w-[56px]">
      <span class="font-label-sm text-label-sm text-outline uppercase">${a.toLocaleDateString("en-US",{weekday:"short"})}</span>
      <span class="font-headline-md text-headline-md text-on-surface font-bold">${a.getDate()}</span>
      ${l?'<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>':""}
    </div>
    <div class="flex items-center gap-space-md flex-1">
      <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-semibold text-sm shrink-0">
        ${(e.candidateName||"C")[0]?.toUpperCase()}
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-headline-sm text-headline-sm text-on-surface">${e.candidateName}</p>
        <p class="font-body-sm text-body-sm text-on-surface-variant">${e.position} • ${e.interviewType||"Technical"}</p>
      </div>
    </div>
    <div class="flex items-center gap-space-xl">
      <div class="text-right">
        <p class="font-body-sm text-body-sm text-on-surface">${window.fmtTime(e.scheduledAt)}</p>
        <p class="font-label-sm text-label-sm text-outline">${e.duration||60} min</p>
      </div>
      ${window.statusBadge((e.status||"scheduled").toLowerCase())}
      <div class="flex gap-space-xs">
        ${e.meetingUrl?`<a href="${e.meetingUrl}" target="_blank" class="px-space-md py-space-xs rounded-lg bg-secondary text-on-secondary font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">video_call</span>Join</a>`:""}
        <button onclick="window.editInterview('${e.id}')" class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high">
          <span class="material-symbols-outlined text-[18px]">edit</span>
        </button>
        <button onclick="window.cancelInterview('${e.id}')" class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-error-container hover:text-error">
          <span class="material-symbols-outlined text-[18px]">cancel</span>
        </button>
      </div>
    </div>
  </div>`}function b(e){const l=new Date(e.scheduledAt).toDateString()===new Date().toDateString();return`
  <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
    <div class="flex items-start justify-between mb-space-sm">
      <div class="flex items-center gap-space-md min-w-0">
        <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-semibold text-sm shrink-0">
          ${(e.candidateName||"C")[0]?.toUpperCase()}
        </div>
        <div class="min-w-0">
          <h3 class="font-headline-sm text-headline-sm text-on-surface truncate">${e.candidateName}</h3>
          <p class="font-body-sm text-body-sm text-on-surface-variant truncate">${e.position}</p>
        </div>
      </div>
      ${window.statusBadge((e.status||"scheduled").toLowerCase())}
    </div>
    <div class="bg-surface-container-low p-space-sm rounded-lg mb-space-sm flex items-center justify-between">
      <div class="flex items-center gap-space-sm">
        <span class="material-symbols-outlined text-secondary text-[18px]">schedule</span>
        <span class="font-body-sm text-body-sm text-on-surface">${l?"Today, ":window.fmtDate(e.scheduledAt)+", "}${window.fmtTime(e.scheduledAt)}</span>
      </div>
      <span class="font-label-sm text-label-sm text-outline">${e.duration||60} min</span>
    </div>
    <div class="flex items-center gap-space-sm">
      ${e.meetingUrl?`<a href="${e.meetingUrl}" target="_blank" class="flex-1 bg-secondary text-on-secondary py-2 rounded-lg font-label-md text-label-md flex items-center justify-center gap-1 min-h-[44px] active:scale-95 transition-transform"><span class="material-symbols-outlined text-[18px]">video_call</span>Join</a>`:""}
      <button onclick="window.editInterview('${e.id}')" class="flex-1 bg-surface-container text-on-surface py-2 rounded-lg font-label-md text-label-md flex items-center justify-center gap-1 min-h-[44px] active:scale-95 transition-transform">
        <span class="material-symbols-outlined text-[18px]">edit</span>Brief
      </button>
    </div>
  </div>`}function m(e=[],a={}){const l=e&&e.length>0?e.map(s=>{const t=`${s.firstName||""} ${s.lastName||""}`.trim()||s.email||"Applicant",n=s.jobTitle||s.appliedRole||"";return`<option value="${s.id}" data-name="${t}" data-role="${n}" ${a.candidateId===s.id?"selected":""}>${t}${n?` — ${n}`:""}</option>`}).join(""):'<option value="" disabled>No applicants available. Add or sync applicants first.</option>';return`
  <div class="p-6 flex flex-col gap-space-lg">
    <div class="flex items-center justify-between">
      <h2 class="font-headline-md text-headline-md text-on-surface">${a.id?"Edit Interview":"Schedule Interview"}</h2>
      <button onclick="window.closeModal()" class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <form id="schedule-form" class="flex flex-col gap-space-lg">
      <input type="hidden" id="iv-id" value="${a.id||""}"/>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        <div class="sm:col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Candidate *</label>
          <select id="iv-candidate" required class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary appearance-none">
            <option value="">Select candidate</option>
            ${l}
          </select>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Interview Type</label>
          <select id="iv-type" class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary appearance-none">
            ${["Technical","HR/Culture","System Design","Case Study","Final Round"].map(s=>`<option value="${s}" ${a.interviewType===s?"selected":""}>${s}</option>`).join("")}
          </select>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Duration (minutes)</label>
          <select id="iv-duration" class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary appearance-none">
            ${[30,45,60,90,120].map(s=>`<option value="${s}" ${a.duration===s?"selected":""}>${s} min</option>`).join("")}
          </select>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Date *</label>
          <input id="iv-date" type="date" required value="${a.scheduledAt?new Date(a.scheduledAt).toISOString().split("T")[0]:""}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"/>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Time *</label>
          <input id="iv-time" type="time" required value="${a.scheduledAt?new Date(a.scheduledAt).toTimeString().slice(0,5):""}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"/>
        </div>
        <div class="sm:col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Interviewer(s)</label>
          <input id="iv-interviewers" type="text" value="${(a.interviewers||[]).join(", ")}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="John Smith, Jane Doe (comma separated)"/>
        </div>
        <div class="sm:col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Meeting Link</label>
          <input id="iv-meeting" type="url" value="${a.meetingUrl||""}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="https://meet.google.com/..."/>
        </div>
        <div class="sm:col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Notes</label>
          <textarea id="iv-notes" rows="3" class="px-space-md py-space-sm bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary resize-none" placeholder="Interview agenda, notes...">${a.notes||""}</textarea>
        </div>
      </div>
      <div id="iv-form-error" class="hidden text-error font-body-sm text-body-sm bg-error-container/40 px-space-md py-space-sm rounded-lg"></div>
      <div class="flex gap-space-sm justify-end pt-space-sm border-t border-outline-variant/20">
        <button type="button" onclick="window.closeModal()" class="px-space-lg py-space-sm rounded-lg border border-outline-variant text-on-surface font-body-sm text-body-sm hover:bg-surface-container-low">Cancel</button>
        <button type="submit" id="iv-submit" class="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-secondary transition-colors shadow-md flex items-center gap-space-xs">
          <span class="material-symbols-outlined text-[18px]">calendar_add_on</span>
          ${a.id?"Update":"Schedule"}
        </button>
      </div>
    </form>
  </div>`}function v(e){const a={};return e.forEach(l=>{const s=new Date(l.scheduledAt).toDateString();a[s]||(a[s]=[]),a[s].push(l)}),a}function g(e,a){["schedule-btn","schedule-btn-mobile"].forEach(t=>{e.querySelector(`#${t}`)?.addEventListener("click",async()=>{let n=a;try{n=await window.api.get("/applicants")}catch(o){console.warn("Could not refresh candidates:",o)}window.openModal(m(n)),p()})}),e.querySelectorAll(".iv-filter").forEach(t=>{t.addEventListener("click",()=>{e.querySelectorAll(".iv-filter").forEach(o=>{o.classList.remove("bg-primary","text-on-primary"),o.classList.add("bg-surface-container","text-on-surface-variant")}),t.classList.add("bg-primary","text-on-primary"),t.classList.remove("bg-surface-container","text-on-surface-variant");const n=t.dataset.filter;e.querySelectorAll("#interviews-list > div").forEach(o=>{o.style.display=n==="ALL"||o.textContent.toUpperCase().includes(n)?"":"none"})})}),e.querySelectorAll(".iv-mobile-filter").forEach(t=>{t.addEventListener("click",()=>{e.querySelectorAll(".iv-mobile-filter").forEach(n=>{n.classList.remove("bg-primary","text-on-primary"),n.classList.add("bg-surface-container-lowest","text-on-surface-variant","border","border-outline-variant/40")}),t.classList.add("bg-primary","text-on-primary"),t.classList.remove("bg-surface-container-lowest","text-on-surface-variant")})});let l=0;function s(){const t=new Date,n=new Date(t);n.setDate(t.getDate()-t.getDay()+l*7),document.getElementById("week-label").textContent=`Week of ${n.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}`;const o=document.getElementById("week-grid");if(!o)return;const c=Array.from({length:7},(i,d)=>{const r=new Date(n);return r.setDate(n.getDate()+d),r});o.innerHTML=c.map(i=>{const d=i.toDateString()===t.toDateString();return`
      <div class="flex flex-col gap-space-xs ${d?"bg-surface-container-high rounded-xl p-space-xs":""}">
        <div class="text-center ${d?"text-primary font-semibold":"text-on-surface-variant"}">
          <p class="font-label-sm text-label-sm">${i.toLocaleDateString("en-US",{weekday:"short"})}</p>
          <p class="font-headline-md text-headline-md">${i.getDate()}</p>
        </div>
      </div>`}).join("")}s(),document.getElementById("prev-week")?.addEventListener("click",()=>{l--,s()}),document.getElementById("next-week")?.addEventListener("click",()=>{l++,s()}),document.getElementById("today-btn")?.addEventListener("click",()=>{l=0,s()}),window.editInterview=async t=>{try{const n=await window.api.get(`/interviews/${t}`);window.openModal(m(a,n)),p(a,t)}catch{window.showToast("Failed to load interview","error")}},window.cancelInterview=t=>{window.confirmDialog("Cancel this interview?",async()=>{try{await window.api.patch(`/interviews/${t}/cancel`,{}),window.showToast("Interview cancelled","info"),window.loadPage("interviews")}catch{window.showToast("Failed to cancel interview","error")}})}}function p(e,a=null){const l=document.getElementById("schedule-form");l&&l.addEventListener("submit",async s=>{s.preventDefault();const t=document.getElementById("iv-submit"),n=document.getElementById("iv-form-error");t.disabled=!0,t.innerHTML='<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>',n.classList.add("hidden");const o=document.getElementById("iv-candidate"),c=o.options[o.selectedIndex],i=document.getElementById("iv-date").value,d=document.getElementById("iv-time").value,r={candidateId:o.value,candidateName:c.dataset.name,position:c.dataset.role,interviewType:document.getElementById("iv-type").value,duration:parseInt(document.getElementById("iv-duration").value),scheduledAt:new Date(`${i}T${d}`).toISOString(),interviewers:document.getElementById("iv-interviewers").value.split(",").map(u=>u.trim()).filter(Boolean),meetingUrl:document.getElementById("iv-meeting").value,notes:document.getElementById("iv-notes").value,status:"SCHEDULED"};try{a?(await window.api.put(`/interviews/${a}`,r),window.showToast("Interview updated!","success")):(await window.api.post("/interviews",r),window.showToast("Interview scheduled!","success")),window.closeModal(),window.loadPage("interviews")}catch(u){n.textContent=u.message,n.classList.remove("hidden"),t.disabled=!1,t.innerHTML='<span class="material-symbols-outlined text-[18px]">calendar_add_on</span> Schedule'}})}export{w as render};
