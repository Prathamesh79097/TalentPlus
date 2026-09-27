async function w(e){let t=[],a=[];try{[t,a]=await Promise.all([window.api.get("/interviews"),window.api.get("/applicants?stages=SHORTLISTED,INTERVIEW")])}catch{t=y(),a=[{id:"1",firstName:"Alex",lastName:"Rivera",jobTitle:"Sr. React Engineer"},{id:"2",firstName:"Priya",lastName:"Sharma",jobTitle:"Product Manager"},{id:"6",firstName:"Sofia",lastName:"Martinez",jobTitle:"UX Designer"}]}e.innerHTML=f(t,a),v(e,a)}function f(e,t){const i=new Date().toDateString();return b(e),`
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
            ${["ALL","SCHEDULED","COMPLETED","CANCELLED"].map(s=>`
              <button class="iv-filter px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all ${s==="ALL"?"bg-primary text-on-primary":"bg-surface-container text-on-surface-variant hover:bg-surface-container-high"}" data-filter="${s}">${s[0]+s.slice(1).toLowerCase()}</button>
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
        <p class="font-body-sm text-body-sm text-on-surface-variant">${e.filter(s=>new Date(s.scheduledAt).toDateString()===i).length} today</p>
      </div>
      <button id="schedule-btn-mobile" class="h-10 px-space-md flex items-center gap-space-xs rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold active:scale-95 transition-transform">
        <span class="material-symbols-outlined text-[18px]">add</span>
        <span>Schedule</span>
      </button>
    </div>

    <!-- Status Pills -->
    <div class="flex gap-space-sm overflow-x-auto no-scrollbar -mx-margin px-margin">
      ${["All","Today","This Week","Scheduled","Completed"].map((s,n)=>`
        <button class="iv-mobile-filter shrink-0 px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all ${n===0?"bg-primary text-on-primary":"bg-surface-container-lowest text-on-surface-variant border border-outline-variant/40"}" data-filter="${s}">${s}</button>
      `).join("")}
    </div>

    <div id="interviews-mobile-list" class="flex flex-col gap-space-md">
      ${e.map(g).join("")}
    </div>
  </div>

  <!-- Schedule Modal -->
  <div id="schedule-modal" class="modal-overlay hidden">
    <div class="modal-box">
      ${m(t)}
    </div>
  </div>`}function x(e){const t=new Date(e.scheduledAt),a=t.toDateString()===new Date().toDateString();return`
  <div class="flex items-center gap-space-xl px-space-xl py-space-md hover:bg-surface-container-low transition-colors">
    <div class="flex flex-col items-center min-w-[56px]">
      <span class="font-label-sm text-label-sm text-outline uppercase">${t.toLocaleDateString("en-US",{weekday:"short"})}</span>
      <span class="font-headline-md text-headline-md text-on-surface font-bold">${t.getDate()}</span>
      ${a?'<span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>':""}
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
  </div>`}function g(e){const a=new Date(e.scheduledAt).toDateString()===new Date().toDateString();return`
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
        <span class="font-body-sm text-body-sm text-on-surface">${a?"Today, ":window.fmtDate(e.scheduledAt)+", "}${window.fmtTime(e.scheduledAt)}</span>
      </div>
      <span class="font-label-sm text-label-sm text-outline">${e.duration||60} min</span>
    </div>
    <div class="flex items-center gap-space-sm">
      ${e.meetingUrl?`<a href="${e.meetingUrl}" target="_blank" class="flex-1 bg-secondary text-on-secondary py-2 rounded-lg font-label-md text-label-md flex items-center justify-center gap-1 min-h-[44px] active:scale-95 transition-transform"><span class="material-symbols-outlined text-[18px]">video_call</span>Join</a>`:""}
      <button onclick="window.editInterview('${e.id}')" class="flex-1 bg-surface-container text-on-surface py-2 rounded-lg font-label-md text-label-md flex items-center justify-center gap-1 min-h-[44px] active:scale-95 transition-transform">
        <span class="material-symbols-outlined text-[18px]">edit</span>Brief
      </button>
    </div>
  </div>`}function m(e,t={}){return`
  <div class="p-6 flex flex-col gap-space-lg">
    <div class="flex items-center justify-between">
      <h2 class="font-headline-md text-headline-md text-on-surface">${t.id?"Edit Interview":"Schedule Interview"}</h2>
      <button onclick="window.closeModal()" class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <form id="schedule-form" class="flex flex-col gap-space-lg">
      <input type="hidden" id="iv-id" value="${t.id||""}"/>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        <div class="sm:col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Candidate *</label>
          <select id="iv-candidate" required class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary appearance-none">
            <option value="">Select candidate</option>
            ${e.map(a=>`<option value="${a.id}" data-name="${a.firstName} ${a.lastName}" data-role="${a.jobTitle||""}" ${t.candidateId===a.id?"selected":""}>${a.firstName} ${a.lastName} — ${a.jobTitle||""}</option>`).join("")}
          </select>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Interview Type</label>
          <select id="iv-type" class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary appearance-none">
            ${["Technical","HR/Culture","System Design","Case Study","Final Round"].map(a=>`<option value="${a}" ${t.interviewType===a?"selected":""}>${a}</option>`).join("")}
          </select>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Duration (minutes)</label>
          <select id="iv-duration" class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary appearance-none">
            ${[30,45,60,90,120].map(a=>`<option value="${a}" ${t.duration===a?"selected":""}>${a} min</option>`).join("")}
          </select>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Date *</label>
          <input id="iv-date" type="date" required value="${t.scheduledAt?new Date(t.scheduledAt).toISOString().split("T")[0]:""}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"/>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Time *</label>
          <input id="iv-time" type="time" required value="${t.scheduledAt?new Date(t.scheduledAt).toTimeString().slice(0,5):""}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"/>
        </div>
        <div class="sm:col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Interviewer(s)</label>
          <input id="iv-interviewers" type="text" value="${(t.interviewers||[]).join(", ")}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="John Smith, Jane Doe (comma separated)"/>
        </div>
        <div class="sm:col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Meeting Link</label>
          <input id="iv-meeting" type="url" value="${t.meetingUrl||""}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="https://meet.google.com/..."/>
        </div>
        <div class="sm:col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Notes</label>
          <textarea id="iv-notes" rows="3" class="px-space-md py-space-sm bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary resize-none" placeholder="Interview agenda, notes...">${t.notes||""}</textarea>
        </div>
      </div>
      <div id="iv-form-error" class="hidden text-error font-body-sm text-body-sm bg-error-container/40 px-space-md py-space-sm rounded-lg"></div>
      <div class="flex gap-space-sm justify-end pt-space-sm border-t border-outline-variant/20">
        <button type="button" onclick="window.closeModal()" class="px-space-lg py-space-sm rounded-lg border border-outline-variant text-on-surface font-body-sm text-body-sm hover:bg-surface-container-low">Cancel</button>
        <button type="submit" id="iv-submit" class="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-secondary transition-colors shadow-md flex items-center gap-space-xs">
          <span class="material-symbols-outlined text-[18px]">calendar_add_on</span>
          ${t.id?"Update":"Schedule"}
        </button>
      </div>
    </form>
  </div>`}function b(e){const t={};return e.forEach(a=>{const i=new Date(a.scheduledAt).toDateString();t[i]||(t[i]=[]),t[i].push(a)}),t}function v(e,t){["schedule-btn","schedule-btn-mobile"].forEach(s=>{e.querySelector(`#${s}`)?.addEventListener("click",()=>{window.openModal(m(t)),p()})}),e.querySelectorAll(".iv-filter").forEach(s=>{s.addEventListener("click",()=>{e.querySelectorAll(".iv-filter").forEach(o=>{o.classList.remove("bg-primary","text-on-primary"),o.classList.add("bg-surface-container","text-on-surface-variant")}),s.classList.add("bg-primary","text-on-primary"),s.classList.remove("bg-surface-container","text-on-surface-variant");const n=s.dataset.filter;e.querySelectorAll("#interviews-list > div").forEach(o=>{o.style.display=n==="ALL"||o.textContent.toUpperCase().includes(n)?"":"none"})})}),e.querySelectorAll(".iv-mobile-filter").forEach(s=>{s.addEventListener("click",()=>{e.querySelectorAll(".iv-mobile-filter").forEach(n=>{n.classList.remove("bg-primary","text-on-primary"),n.classList.add("bg-surface-container-lowest","text-on-surface-variant","border","border-outline-variant/40")}),s.classList.add("bg-primary","text-on-primary"),s.classList.remove("bg-surface-container-lowest","text-on-surface-variant")})});let a=0;function i(){const s=new Date,n=new Date(s);n.setDate(s.getDate()-s.getDay()+a*7),document.getElementById("week-label").textContent=`Week of ${n.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}`;const o=document.getElementById("week-grid");if(!o)return;const c=Array.from({length:7},(l,d)=>{const r=new Date(n);return r.setDate(n.getDate()+d),r});o.innerHTML=c.map(l=>{const d=l.toDateString()===s.toDateString();return`
      <div class="flex flex-col gap-space-xs ${d?"bg-surface-container-high rounded-xl p-space-xs":""}">
        <div class="text-center ${d?"text-primary font-semibold":"text-on-surface-variant"}">
          <p class="font-label-sm text-label-sm">${l.toLocaleDateString("en-US",{weekday:"short"})}</p>
          <p class="font-headline-md text-headline-md">${l.getDate()}</p>
        </div>
      </div>`}).join("")}i(),document.getElementById("prev-week")?.addEventListener("click",()=>{a--,i()}),document.getElementById("next-week")?.addEventListener("click",()=>{a++,i()}),document.getElementById("today-btn")?.addEventListener("click",()=>{a=0,i()}),window.editInterview=async s=>{try{const n=await window.api.get(`/interviews/${s}`);window.openModal(m(t,n)),p(t,s)}catch{window.showToast("Failed to load interview","error")}},window.cancelInterview=s=>{window.confirmDialog("Cancel this interview?",async()=>{try{await window.api.patch(`/interviews/${s}/cancel`,{}),window.showToast("Interview cancelled","info"),window.loadPage("interviews")}catch{window.showToast("Failed to cancel interview","error")}})}}function p(e,t=null){const a=document.getElementById("schedule-form");a&&a.addEventListener("submit",async i=>{i.preventDefault();const s=document.getElementById("iv-submit"),n=document.getElementById("iv-form-error");s.disabled=!0,s.innerHTML='<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>',n.classList.add("hidden");const o=document.getElementById("iv-candidate"),c=o.options[o.selectedIndex],l=document.getElementById("iv-date").value,d=document.getElementById("iv-time").value,r={candidateId:o.value,candidateName:c.dataset.name,position:c.dataset.role,interviewType:document.getElementById("iv-type").value,duration:parseInt(document.getElementById("iv-duration").value),scheduledAt:new Date(`${l}T${d}`).toISOString(),interviewers:document.getElementById("iv-interviewers").value.split(",").map(u=>u.trim()).filter(Boolean),meetingUrl:document.getElementById("iv-meeting").value,notes:document.getElementById("iv-notes").value,status:"SCHEDULED"};try{t?(await window.api.put(`/interviews/${t}`,r),window.showToast("Interview updated!","success")):(await window.api.post("/interviews",r),window.showToast("Interview scheduled!","success")),window.closeModal(),window.loadPage("interviews")}catch(u){n.textContent=u.message,n.classList.remove("hidden"),s.disabled=!1,s.innerHTML='<span class="material-symbols-outlined text-[18px]">calendar_add_on</span> Schedule'}})}function y(){const e=new Date,t=(a,i)=>{const s=new Date(e);return s.setHours(a,i,0,0),s.toISOString()};return[{id:"1",candidateName:"Alex Rivera",position:"Sr. React Engineer",interviewType:"Technical",duration:60,scheduledAt:t(10,30),status:"SCHEDULED",meetingUrl:"https://meet.google.com/abc-defg-hij"},{id:"2",candidateName:"Priya Sharma",position:"Product Manager",interviewType:"HR/Culture",duration:45,scheduledAt:t(14,0),status:"SCHEDULED",meetingUrl:"https://meet.google.com/xyz-uvwx-yz1"},{id:"3",candidateName:"Sofia Martinez",position:"UX Designer",interviewType:"Case Study",duration:90,scheduledAt:t(16,0),status:"COMPLETED"},{id:"4",candidateName:"Marcus Chen",position:"DevOps Lead",interviewType:"System Design",duration:60,scheduledAt:new Date(e.getTime()+864e5).toISOString(),status:"SCHEDULED"}]}export{w as render};
