async function b(e,s={}){let t=[],a=[];try{[t,a]=await Promise.all([window.api.get("/offers"),window.api.get("/applicants")])}catch{t=[],a=[]}if(e.innerHTML=p(t,a),x(e,a),s.candidateId){const n=a.find(l=>l.id===s.candidateId)||{id:s.candidateId};setTimeout(()=>{window.openSendOfferModal(n)},100)}}function p(e,s){const t={pending:e.filter(a=>a.status==="PENDING").length,accepted:e.filter(a=>a.status==="ACCEPTED").length,declined:e.filter(a=>a.status==="DECLINED").length,total:e.length};return`
  <!-- ═══ DESKTOP ═══ -->
  <div class="hidden lg:block p-8 max-w-7xl mx-auto w-full">
    <div class="flex flex-col gap-space-xl">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">Job Offers</h1>
          <p class="font-body-md text-body-md text-on-surface-variant">Track and manage all sent job offers</p>
        </div>
        <button id="send-offer-btn" class="h-10 px-space-lg flex items-center gap-space-xs rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-secondary transition-all shadow-md">
          <span class="material-symbols-outlined text-[18px]">send</span>
          <span>Send New Offer</span>
        </button>
      </div>

      <!-- Offer Stats -->
      <div class="grid grid-cols-4 gap-space-lg">
        ${d("Total Offers",t.total,"local_offer","primary")}
        ${d("Pending Response",t.pending,"pending","status-screening")}
        ${d("Accepted",t.accepted,"check_circle","status-hired")}
        ${d("Declined",t.declined,"cancel","error")}
      </div>

      <!-- Offers Table -->
      <div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        <div class="p-space-xl border-b border-outline-variant/30 flex items-center justify-between">
          <span class="font-headline-md text-headline-md text-on-surface">All Offers</span>
          <div class="flex gap-space-sm">
            ${["ALL","PENDING","ACCEPTED","DECLINED","EXPIRED"].map(a=>`
              <button class="offer-filter px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all ${a==="ALL"?"bg-primary text-on-primary":"bg-surface-container text-on-surface-variant hover:bg-surface-container-high"}" data-filter="${a}">${a[0]+a.slice(1).toLowerCase()}</button>
            `).join("")}
          </div>
        </div>
        <table class="w-full">
          <thead class="bg-surface-container-low border-b border-outline-variant/30">
            <tr>
              <th class="text-left px-space-xl py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Candidate</th>
              <th class="text-left px-space-md py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Role</th>
              <th class="text-left px-space-md py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Offered Package</th>
              <th class="text-left px-space-md py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Status</th>
              <th class="text-left px-space-md py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Sent / Expires</th>
              <th class="text-right px-space-xl py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody id="offers-tbody" class="divide-y divide-outline-variant/20">
            ${e.map(u).join("")}
          </tbody>
        </table>
        ${e.length===0?'<div class="flex flex-col items-center justify-center py-16 text-on-surface-variant"><span class="material-symbols-outlined text-[48px]">local_offer</span><p class="font-headline-sm text-headline-sm mt-4">No offers sent yet</p></div>':""}
      </div>
    </div>
  </div>

  <!-- ═══ MOBILE ═══ -->
  <div class="lg:hidden flex flex-col w-full px-margin py-space-md space-y-space-lg pb-24">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-headline-sm text-headline-sm text-on-surface">Job Offers</h1>
        <p class="font-body-sm text-body-sm text-on-surface-variant">${t.total} offers • ${t.accepted} accepted</p>
      </div>
      <button id="send-offer-btn-mobile" class="h-10 px-space-md flex items-center gap-space-xs rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold active:scale-95 transition-transform">
        <span class="material-symbols-outlined text-[18px]">send</span>
        <span>Send Offer</span>
      </button>
    </div>

    <!-- Offer Summary Chips -->
    <div class="flex gap-space-sm overflow-x-auto no-scrollbar -mx-margin px-margin">
      ${[["All",t.total,""],["Pending",t.pending,"PENDING"],["Accepted",t.accepted,"ACCEPTED"],["Declined",t.declined,"DECLINED"]].map(([a,n,l],o)=>`
        <button class="offer-pill shrink-0 flex items-center gap-space-xs px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all ${o===0?"bg-primary text-on-primary":"bg-surface-container-lowest text-on-surface-variant border border-outline-variant/40"}" data-filter="${l}">
          ${a} <span class="font-bold">${n}</span>
        </button>
      `).join("")}
    </div>

    <div id="offers-mobile-list" class="flex flex-col gap-space-md">
      ${e.map(m).join("")}
    </div>
  </div>

  <!-- Send Offer Modal -->
  <div id="send-offer-modal" class="modal-overlay hidden">
    <div class="modal-box">
      ${r(s)}
    </div>
  </div>`}function d(e,s,t,a){return`
  <div class="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex items-center gap-space-md">
    <div class="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-${a}">
      <span class="material-symbols-outlined text-[24px]">${t}</span>
    </div>
    <div>
      <span class="font-label-sm text-label-sm text-outline uppercase tracking-wider block">${e}</span>
      <span class="font-headline-md text-headline-md text-on-surface font-bold">${s}</span>
    </div>
  </div>`}function u(e){const s=e.expiresAt?Math.ceil((new Date(e.expiresAt)-Date.now())/864e5):null;return`
  <tr class="hover:bg-surface-container-low transition-colors">
    <td class="px-space-xl py-space-md">
      <div class="flex items-center gap-space-md">
        <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary font-semibold text-sm shrink-0">
          ${(e.candidateName||"C")[0]?.toUpperCase()}
        </div>
        <div>
          <p class="font-headline-sm text-headline-sm text-on-surface">${e.candidateName}</p>
          <p class="font-body-sm text-body-sm text-outline">${e.email||""}</p>
        </div>
      </div>
    </td>
    <td class="px-space-md py-space-md">
      <p class="font-body-sm text-body-sm text-on-surface">${e.position}</p>
    </td>
    <td class="px-space-md py-space-md">
      <p class="font-body-sm text-body-sm text-on-surface font-semibold">${e.salary||"—"}</p>
      <p class="font-label-sm text-label-sm text-outline">${e.benefits||""}</p>
    </td>
    <td class="px-space-md py-space-md">
      ${window.statusBadge((e.status||"pending").toLowerCase())}
    </td>
    <td class="px-space-md py-space-md">
      <p class="font-body-sm text-body-sm text-on-surface">${window.fmtDate(e.sentAt)}</p>
      ${s!==null?`<p class="font-label-sm text-label-sm ${s<3?"text-error":"text-outline"}">${s>0?s+"d left":"Expired"}</p>`:""}
    </td>
    <td class="px-space-xl py-space-md text-right">
      <div class="flex items-center justify-end gap-space-xs">
        ${e.status==="PENDING"?`
          <button onclick="window.updateOfferStatus('${e.id}','ACCEPTED')" class="px-space-md py-space-xs rounded-lg bg-status-hired-bg text-status-hired font-label-md text-label-md hover:opacity-80 transition-opacity">Accept</button>
          <button onclick="window.updateOfferStatus('${e.id}','DECLINED')" class="px-space-md py-space-xs rounded-lg bg-error-container text-error font-label-md text-label-md hover:opacity-80 transition-opacity">Decline</button>
        `:""}
        <button onclick="window.deleteOffer('${e.id}')" class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-error-container hover:text-error">
          <span class="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    </td>
  </tr>`}function m(e){return`
  <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm" data-status="${e.status}">
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
      ${window.statusBadge((e.status||"pending").toLowerCase())}
    </div>
    <div class="flex items-center justify-between py-space-sm border-t border-outline-variant/20">
      <div>
        <p class="font-headline-sm text-headline-sm text-on-surface">${e.salary||"Salary TBD"}</p>
        <p class="font-label-sm text-label-sm text-outline">Sent ${window.fmtDate(e.sentAt)}</p>
      </div>
      ${e.status==="PENDING"?`
        <div class="flex gap-space-xs">
          <button onclick="window.updateOfferStatus('${e.id}','ACCEPTED')" class="py-2 px-space-md rounded-lg bg-status-hired-bg text-status-hired font-label-md text-label-md min-h-[44px]">Accept</button>
          <button onclick="window.updateOfferStatus('${e.id}','DECLINED')" class="py-2 px-space-md rounded-lg bg-error-container text-error font-label-md text-label-md min-h-[44px]">Decline</button>
        </div>`:""}
    </div>
  </div>`}function r(e,s={}){return`
  <div class="p-6 flex flex-col gap-space-lg">
    <div class="flex items-center justify-between">
      <h2 class="font-headline-md text-headline-md text-on-surface">Send Job Offer</h2>
      <button onclick="window.closeModal()" class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <form id="offer-form" class="flex flex-col gap-space-lg">
      <input type="hidden" id="offer-id" value="${s.id||""}"/>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        <div class="sm:col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Candidate *</label>
          <select id="offer-candidate" required class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary appearance-none">
            <option value="">Select candidate</option>
            ${e.map(t=>`<option value="${t.id}" data-name="${t.firstName||""} ${t.lastName||""}" data-role="${t.jobTitle||""}" ${s.candidateId===t.id?"selected":""}>${t.firstName||""} ${t.lastName||""} — ${t.jobTitle||""}</option>`).join("")}
          </select>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Base Salary *</label>
          <input id="offer-salary" type="text" required value="${s.salary||""}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="e.g. $120,000 / year"/>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Start Date</label>
          <input id="offer-start" type="date" value="${s.startDate||""}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"/>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Offer Expires</label>
          <input id="offer-expires" type="date" value="${s.expiresAt?new Date(s.expiresAt).toISOString().split("T")[0]:""}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"/>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Equity / Bonus</label>
          <input id="offer-equity" type="text" value="${s.equity||""}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="e.g. 0.25% equity"/>
        </div>
        <div class="sm:col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Benefits</label>
          <input id="offer-benefits" type="text" value="${s.benefits||""}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="Health, Dental, 401k, Remote, etc."/>
        </div>
        <div class="sm:col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Offer Letter Notes</label>
          <textarea id="offer-notes" rows="3" class="px-space-md py-space-sm bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary resize-none" placeholder="Any additional information to include in the offer...">${s.notes||""}</textarea>
        </div>
      </div>
      <div id="offer-form-error" class="hidden text-error font-body-sm text-body-sm bg-error-container/40 px-space-md py-space-sm rounded-lg"></div>
      <div class="flex gap-space-sm justify-end pt-space-sm border-t border-outline-variant/20">
        <button type="button" onclick="window.closeModal()" class="px-space-lg py-space-sm rounded-lg border border-outline-variant text-on-surface font-body-sm text-body-sm hover:bg-surface-container-low">Cancel</button>
        <button type="submit" id="offer-submit" class="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-secondary transition-colors shadow-md flex items-center gap-space-xs">
          <span class="material-symbols-outlined text-[18px]">send</span>
          Send Offer
        </button>
      </div>
    </form>
  </div>`}function x(e,s){["send-offer-btn","send-offer-btn-mobile"].forEach(t=>{e.querySelector(`#${t}`)?.addEventListener("click",()=>{window.openModal(r(s)),i()})}),window.openSendOfferModal=t=>{window.openModal(r(s,{candidateId:t.id})),i(),setTimeout(()=>{const a=document.getElementById("offer-candidate");a&&(a.value=t.id)},50)},e.querySelectorAll(".offer-filter").forEach(t=>{t.addEventListener("click",()=>{e.querySelectorAll(".offer-filter").forEach(n=>{n.classList.remove("bg-primary","text-on-primary"),n.classList.add("bg-surface-container","text-on-surface-variant")}),t.classList.add("bg-primary","text-on-primary"),t.classList.remove("bg-surface-container","text-on-surface-variant");const a=t.dataset.filter;e.querySelectorAll("#offers-tbody tr").forEach(n=>{n.style.display=a==="ALL"||n.textContent.toUpperCase().includes(a)?"":"none"})})}),e.querySelectorAll(".offer-pill").forEach(t=>{t.addEventListener("click",()=>{e.querySelectorAll(".offer-pill").forEach(n=>{n.classList.remove("bg-primary","text-on-primary"),n.classList.add("bg-surface-container-lowest","text-on-surface-variant","border","border-outline-variant/40")}),t.classList.add("bg-primary","text-on-primary"),t.classList.remove("bg-surface-container-lowest","text-on-surface-variant");const a=t.dataset.filter;e.querySelectorAll("#offers-mobile-list > div").forEach(n=>{n.style.display=!a||n.dataset.status===a?"":"none"})})}),window.updateOfferStatus=async(t,a)=>{try{await window.api.patch(`/offers/${t}/status`,{status:a}),window.showToast(`Offer marked as ${a.toLowerCase()}`,a==="ACCEPTED"?"success":"info"),window.loadPage("job-offers")}catch{window.showToast("Failed to update offer status","error")}},window.deleteOffer=t=>{window.confirmDialog("Delete this offer?",async()=>{try{await window.api.delete(`/offers/${t}`),window.showToast("Offer deleted","info"),window.loadPage("job-offers")}catch{window.showToast("Failed to delete offer","error")}})}}function i(e){const s=document.getElementById("offer-form");s&&s.addEventListener("submit",async t=>{t.preventDefault();const a=document.getElementById("offer-submit"),n=document.getElementById("offer-form-error");a.disabled=!0,a.innerHTML='<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>',n.classList.add("hidden");const l=document.getElementById("offer-candidate"),o=l.options[l.selectedIndex],c={candidateId:l.value,candidateName:o.dataset.name,position:o.dataset.role,salary:document.getElementById("offer-salary").value,startDate:document.getElementById("offer-start").value,expiresAt:document.getElementById("offer-expires").value?new Date(document.getElementById("offer-expires").value).toISOString():null,equity:document.getElementById("offer-equity").value,benefits:document.getElementById("offer-benefits").value,notes:document.getElementById("offer-notes").value,status:"PENDING",sentAt:new Date().toISOString()};try{await window.api.post("/offers",c),window.showToast("Offer sent successfully!","success"),window.closeModal(),window.loadPage("job-offers")}catch(f){n.textContent=f.message,n.classList.remove("hidden"),a.disabled=!1,a.innerHTML='<span class="material-symbols-outlined text-[18px]">send</span> Send Offer'}})}export{b as render};
