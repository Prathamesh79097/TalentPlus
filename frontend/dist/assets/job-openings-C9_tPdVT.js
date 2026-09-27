async function E(e){let s=[];try{s=await window.api.get("/jobs")}catch{s=S()}e.innerHTML=g(s),y(e)}const c={"Engineering & IT":["Software Engineering","Frontend Development","Backend Development","Fullstack Development","Mobile App Development (iOS/Android)","Data Science & AI/ML","DevOps & Cloud Architecture","Cybersecurity & Network","Quality Assurance / QA Testing","Database & Infrastructure"],"Product & Design":["Product Management","UI/UX Design","Product Marketing","User Research & Analytics","Graphic & Brand Design"],"Human Resources":["Talent Acquisition / Recruiting","HR Operations & Compliance","Compensation & Benefits","Learning & Development","Employee Relations"],"Sales & Marketing":["Business Development & Sales","Digital Marketing & SEO","Content & Brand Marketing","Customer Success & Support","Account Management"],"Finance & Accounting":["Financial Planning & Analysis (FP&A)","Accounting & Audit","Corporate Finance","Tax & Payroll"],"Operations & Business":["Supply Chain & Logistics","Project / Program Management","Business Operations","Legal & Compliance"],"Healthcare & Medical":["Clinical & Nursing","Medical Research","Pharmaceuticals","Healthcare Administration"]};function g(e){return`
  <!-- ═══ DESKTOP ═══ -->
  <div class="hidden lg:block p-8 max-w-7xl mx-auto w-full">
    <div class="flex flex-col gap-space-xl">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">Job Openings</h1>
          <p class="font-body-md text-body-md text-on-surface-variant">Manage all active and draft job requisitions</p>
        </div>
        <button id="new-job-btn" class="h-10 px-space-lg flex items-center gap-space-xs rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-secondary transition-all shadow-md">
          <span class="material-symbols-outlined text-[18px]">add</span>
          <span>Post New Job</span>
        </button>
      </div>

      <!-- Filters & Search -->
      <div class="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-wrap items-center gap-space-md">
        <div class="relative flex-1 min-w-[200px]">
          <span class="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">search</span>
          <input id="job-search" class="w-full h-10 pl-10 pr-space-md bg-surface-container-low rounded-lg text-on-surface placeholder:text-outline text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary transition-all" placeholder="Search job title, field..."/>
        </div>
        <select id="status-filter" class="h-10 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-sm font-body-sm focus:outline-none focus:ring-2 focus:ring-secondary appearance-none cursor-pointer pr-8">
          <option value="">All Status</option>
          <option value="OPEN">Open</option>
          <option value="DRAFT">Draft</option>
          <option value="PAUSED">Paused</option>
          <option value="CLOSED">Closed</option>
        </select>
        <select id="dept-filter" class="h-10 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-sm font-body-sm focus:outline-none focus:ring-2 focus:ring-secondary appearance-none cursor-pointer pr-8">
          <option value="">All Fields</option>
          ${Object.keys(c).map(s=>`<option value="${s}">${s}</option>`).join("")}
        </select>
        <select id="type-filter" class="h-10 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-sm font-body-sm focus:outline-none focus:ring-2 focus:ring-secondary appearance-none cursor-pointer pr-8">
          <option value="">All Types</option>
          <option value="FULL_TIME">Full Time</option>
          <option value="PART_TIME">Part Time</option>
          <option value="CONTRACT">Contract</option>
          <option value="INTERNSHIP">Internship</option>
        </select>
      </div>

      <!-- Jobs Table -->
      <div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        <table class="w-full">
          <thead class="bg-surface-container-low border-b border-outline-variant/30">
            <tr>
              <th class="text-left px-space-xl py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Job Title</th>
              <th class="text-left px-space-md py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Field / Sub-field</th>
              <th class="text-left px-space-md py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Type</th>
              <th class="text-left px-space-md py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Applicants</th>
              <th class="text-left px-space-md py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Status</th>
              <th class="text-left px-space-md py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Posted</th>
              <th class="text-right px-space-xl py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody id="jobs-table-body" class="divide-y divide-outline-variant/20">
            ${e.map(f).join("")}
          </tbody>
        </table>
        ${e.length===0?h("No job openings found","Post your first job to start receiving applications."):""}
      </div>
    </div>
  </div>

  <!-- ═══ MOBILE ═══ -->
  <div class="lg:hidden flex flex-col w-full px-margin py-space-md space-y-space-lg pb-24">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-headline-sm text-headline-sm text-on-surface">Job Openings</h1>
        <p class="font-body-sm text-body-sm text-on-surface-variant">${e.length} active roles</p>
      </div>
      <button id="new-job-btn-mobile" class="h-10 px-space-md flex items-center gap-space-xs rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold active:scale-95 transition-transform">
        <span class="material-symbols-outlined text-[18px]">add</span>
        <span>Post Job</span>
      </button>
    </div>

    <!-- Search & Filter -->
    <div class="relative">
      <span class="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">search</span>
      <input id="job-search-mobile" class="w-full h-11 pl-10 pr-space-md bg-surface-container-lowest rounded-lg text-on-surface placeholder:text-outline text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary transition-all shadow-sm" placeholder="Search jobs..."/>
    </div>

    <!-- Status Pills -->
    <div class="flex gap-space-sm overflow-x-auto no-scrollbar -mx-margin px-margin pb-space-xs">
      ${["All","Open","Draft","Paused","Closed"].map((s,t)=>`
        <button class="status-pill shrink-0 px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all ${t===0?"bg-primary text-on-primary":"bg-surface-container-lowest text-on-surface-variant border border-outline-variant/40"}" data-status="${s==="All"?"":s.toUpperCase()}">${s}</button>
      `).join("")}
    </div>

    <!-- Jobs List -->
    <div id="jobs-mobile-list" class="flex flex-col gap-space-md">
      ${e.map(x).join("")}
    </div>
  </div>

  <!-- Post Job Modal -->
  <div id="post-job-modal" class="modal-overlay hidden">
    <div class="modal-box">
      ${u()}
    </div>
  </div>`}function f(e){const s=e.field||e.department||"Engineering & IT",t=e.subField?` (${e.subField})`:"";return`
  <tr class="hover:bg-surface-container-low transition-colors">
    <td class="px-space-xl py-space-md">
      <div>
        <p class="font-headline-sm text-headline-sm text-on-surface">${e.title}</p>
        <p class="font-body-sm text-body-sm text-outline">${e.location||"Remote"}</p>
      </div>
    </td>
    <td class="px-space-md py-space-md">
      <span class="font-body-sm text-body-sm text-on-surface">${s}${t}</span>
    </td>
    <td class="px-space-md py-space-md">
      <span class="font-body-sm text-body-sm text-on-surface">${w(e.jobType)}</span>
    </td>
    <td class="px-space-md py-space-md">
      <div class="flex items-center gap-space-sm">
        <span class="font-body-sm text-body-sm text-on-surface font-semibold">${e.applicantCount||0}</span>
        ${e.newApplicants>0?`<span class="font-label-sm text-label-sm text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">+${e.newApplicants} new</span>`:""}
      </div>
    </td>
    <td class="px-space-md py-space-md">
      ${window.statusBadge(e.status?.toLowerCase()||"open")}
    </td>
    <td class="px-space-md py-space-md">
      <span class="font-body-sm text-body-sm text-outline">${window.fmtDate(e.postedDate||e.createdAt)}</span>
    </td>
    <td class="px-space-xl py-space-md text-right">
      <div class="flex items-center justify-end gap-space-sm">
        <button onclick="window.openGoogleFormModal('${e.id}')" class="px-space-md py-space-xs rounded-lg bg-secondary/10 text-secondary font-label-md text-label-md hover:bg-secondary/20 transition-colors flex items-center gap-1" title="Configure Google Form Application">
          <span class="material-symbols-outlined text-[16px]">description</span>Form
        </button>
        <button onclick="window.viewJobApplicants('${e.id}')" class="px-space-md py-space-xs rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors">View</button>
        <button onclick="window.editJob('${e.id}')" class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors">
          <span class="material-symbols-outlined text-[18px]">edit</span>
        </button>
        <button onclick="window.deleteJob('${e.id}')" class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-error-container hover:text-error transition-colors">
          <span class="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    </td>
  </tr>`}function x(e){const s=e.field||e.department||"Engineering & IT",t=e.subField?` • ${e.subField}`:"";return`
  <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer" onclick="window.viewJobApplicants('${e.id}')">
    <div class="flex items-start justify-between mb-space-sm">
      <div class="flex-1 min-w-0">
        <h3 class="font-headline-sm text-headline-sm text-on-surface truncate">${e.title}</h3>
        <p class="font-body-sm text-body-sm text-on-surface-variant">${s}${t} • ${e.location||"Remote"}</p>
      </div>
      ${window.statusBadge(e.status?.toLowerCase()||"open")}
    </div>
    <div class="flex items-center justify-between pt-space-sm border-t border-outline-variant/20">
      <div class="flex items-center gap-space-sm">
        <span class="material-symbols-outlined text-outline text-[16px]">group</span>
        <span class="font-body-sm text-body-sm text-on-surface-variant">${e.applicantCount||0} applicants</span>
        ${e.newApplicants>0?`<span class="font-label-sm text-label-sm text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">+${e.newApplicants} new</span>`:""}
      </div>
      <div class="flex items-center gap-space-sm">
        <button onclick="event.stopPropagation(); window.openGoogleFormModal('${e.id}')" class="px-space-xs py-0.5 rounded bg-secondary/10 text-secondary font-label-sm text-label-sm hover:bg-secondary/20 transition-colors flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">description</span>Form
        </button>
        <span class="font-label-sm text-label-sm text-outline">${window.fmtDate(e.postedDate||e.createdAt)}</span>
      </div>
    </div>
  </div>`}function u(e={}){const s=e.field||e.department||"Engineering & IT",t=e.subField||"",o=c[s]||Object.values(c)[0];return`
  <div class="p-6 flex flex-col gap-space-lg">
    <div class="flex items-center justify-between">
      <h2 class="font-headline-md text-headline-md text-on-surface">${e.id?"Edit Job":"Post New Job"}</h2>
      <button onclick="window.closeModal()" class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <form id="job-form" class="flex flex-col gap-space-lg">
      <input type="hidden" id="job-id" value="${e.id||""}"/>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        <div class="sm:col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Job Title *</label>
          <input id="job-title" type="text" required value="${e.title||""}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="e.g. Senior Software Engineer"/>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Field *</label>
          <select id="job-field" required class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary appearance-none">
            <option value="">Select Field</option>
            ${Object.keys(c).map(a=>`<option value="${a}" ${s===a?"selected":""}>${a}</option>`).join("")}
          </select>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Sub-field / Specialization *</label>
          <select id="job-subfield" required class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary appearance-none">
            <option value="">Select Sub-field</option>
            ${o.map(a=>`<option value="${a}" ${t===a?"selected":""}>${a}</option>`).join("")}
          </select>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Job Type *</label>
          <select id="job-type" required class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary appearance-none">
            <option value="">Select type</option>
            ${[["FULL_TIME","Full Time"],["PART_TIME","Part Time"],["CONTRACT","Contract"],["INTERNSHIP","Internship"]].map(([a,n])=>`<option value="${a}" ${e.jobType===a?"selected":""}>${n}</option>`).join("")}
          </select>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Location</label>
          <input id="job-location" type="text" value="${e.location||""}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="Remote / City, Country"/>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Salary Range</label>
          <input id="job-salary" type="text" value="${e.salaryRange||""}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="e.g. $80k - $120k"/>
        </div>
        <div class="sm:col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Job Description *</label>
          <textarea id="job-desc" rows="4" required
            class="px-space-md py-space-sm bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
            placeholder="Describe responsibilities, requirements, and benefits...">${e.description||""}</textarea>
        </div>
        <div class="sm:col-span-2 flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Required Skills (comma separated)</label>
          <input id="job-skills" type="text" value="${(e.skills||[]).join(", ")}"
            class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="React, Node.js, TypeScript..."/>
        </div>
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Status</label>
          <select id="job-status" class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary appearance-none">
            <option value="OPEN" ${e.status==="OPEN"?"selected":""}>Open</option>
            <option value="DRAFT" ${e.status==="DRAFT"?"selected":""}>Draft</option>
            <option value="PAUSED" ${e.status==="PAUSED"?"selected":""}>Paused</option>
            <option value="CLOSED" ${e.status==="CLOSED"?"selected":""}>Closed</option>
          </select>
        </div>
      </div>
      <div id="job-form-error" class="hidden text-error font-body-sm text-body-sm bg-error-container/40 px-space-md py-space-sm rounded-lg"></div>
      <div class="flex gap-space-sm justify-end pt-space-sm border-t border-outline-variant/20">
        <button type="button" onclick="window.closeModal()" class="px-space-lg py-space-sm rounded-lg border border-outline-variant text-on-surface font-body-sm text-body-sm hover:bg-surface-container-low">Cancel</button>
        <button type="submit" id="job-submit" class="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-secondary transition-colors shadow-md flex items-center gap-space-xs">
          <span class="material-symbols-outlined text-[18px]">save</span>
          ${e.id?"Save Changes":"Post Job"}
        </button>
      </div>
    </form>
  </div>`}function y(e){["new-job-btn","new-job-btn-mobile"].forEach(t=>{e.querySelector(`#${t}`)?.addEventListener("click",()=>{window.openModal(u()),m()})});const s=window.debounce(t=>v(e,t),300);e.querySelector("#job-search")?.addEventListener("input",t=>s(t.target.value)),e.querySelector("#job-search-mobile")?.addEventListener("input",t=>s(t.target.value)),["status-filter","dept-filter","type-filter"].forEach(t=>{e.querySelector(`#${t}`)?.addEventListener("change",()=>b(e))}),e.querySelectorAll(".status-pill").forEach(t=>{t.addEventListener("click",()=>{e.querySelectorAll(".status-pill").forEach(o=>{o.classList.remove("bg-primary","text-on-primary"),o.classList.add("bg-surface-container-lowest","text-on-surface-variant","border","border-outline-variant/40")}),t.classList.add("bg-primary","text-on-primary"),t.classList.remove("bg-surface-container-lowest","text-on-surface-variant"),b(e,t.dataset.status)})}),window.viewJobApplicants=t=>{window.loadPage("applicants",{jobId:t})},window.editJob=async t=>{try{const o=await window.api.get(`/jobs/${t}`);window.openModal(u(o)),m(t)}catch{window.showToast("Failed to load job details","error")}},window.deleteJob=t=>{window.confirmDialog("Are you sure you want to delete this job posting?",async()=>{try{await window.api.delete(`/jobs/${t}`),window.showToast("Job deleted successfully","success"),window.loadPage("job-openings")}catch{window.showToast("Failed to delete job","error")}})},window.openGoogleFormModal=async t=>{let o=null;try{o=await window.api.get(`/jobs/${t}`)}catch{o={id:t,title:"Job Requisition",googleFormUrl:""}}const n=`${window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"https://chilly-readers-post.loca.lt":"https://talentplus.onrender.com"}/api/webhooks/google-form`,l=`// ─────────────────────────────────────────────────────────────
// TalentPulse Google Form Integration Script for Job: ${o.title||"Requisition"}
// ─────────────────────────────────────────────────────────────

const WEBHOOK_URL = "${n}";
const WEBHOOK_SECRET = "talentpulse-secret-key";
const JOB_ID = "${o.id}";

function onFormSubmit(e) {
  if (!e || !e.namedValues) {
    Logger.log("No form submit values found.");
    return;
  }
  const itemResponses = e.namedValues;
  
  // Build 1:1 raw spreadsheet response object (preserves all headers & values)
  const rawFormResponses = {};
  for (let key in itemResponses) {
    const val = itemResponses[key];
    rawFormResponses[key] = Array.isArray(val) ? val.join(", ") : (val || "");
  }

  const payload = {
    jobId: JOB_ID,
    firstName: getVal(itemResponses, ["First Name", "First name", "Name", "Full Name"]) || "Applicant",
    lastName: getVal(itemResponses, ["Last Name", "Last name", "Surname"]) || "",
    email: getVal(itemResponses, ["Email", "Email Address", "Email address"]),
    phone: getVal(itemResponses, ["Phone", "Phone Number", "Mobile", "Contact Number"]),
    skills: parseSkills(getVal(itemResponses, ["Skills", "Required Skills", "Key Skills"])),
    yearsExperience: parseInt(getVal(itemResponses, ["Experience", "Years of Experience"])) || 0,
    education: getVal(itemResponses, ["Education", "Degree", "Qualification"]),
    currentCompany: getVal(itemResponses, ["Current Company", "Company"]),
    linkedinUrl: getVal(itemResponses, ["LinkedIn", "LinkedIn URL", "LinkedIn Profile"]),
    githubUrl: getVal(itemResponses, ["GitHub", "GitHub URL", "Portfolio"]),
    resumeUrl: getVal(itemResponses, ["Resume", "CV", "Upload Resume", "Resume Link"]),
    source: "Google Form",
    notes: "Submitted via Google Form on " + new Date().toLocaleString(),
    rawFormResponses: rawFormResponses
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: { "X-Webhook-Secret": WEBHOOK_SECRET },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const res = UrlFetchApp.fetch(WEBHOOK_URL, options);
    Logger.log("Response: " + res.getContentText());
  } catch (err) {
    Logger.log("Error sending webhook: " + err.toString());
  }
}

function getVal(responses, keys) {
  for (let k of keys) {
    for (let key in responses) {
      if (key.toLowerCase().includes(k.toLowerCase())) {
        const val = responses[key];
        return Array.isArray(val) ? val[0] : val;
      }
    }
  }
  return "";
}

function parseSkills(str) {
  if (!str) return [];
  return str.split(",").map(s => s.trim()).filter(Boolean);
}`,i=`
    <div class="p-6 flex flex-col gap-space-lg max-w-2xl w-full">
      <div class="flex items-center justify-between border-b border-outline-variant/30 pb-space-md">
        <div class="flex items-center gap-space-md">
          <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-[24px]">description</span>
          </div>
          <div>
            <h2 class="font-headline-md text-headline-md text-on-surface">Google Form Integration</h2>
            <p class="font-body-sm text-body-sm text-on-surface-variant">${o.title} (ID: <code class="bg-surface-container px-1.5 py-0.5 rounded text-primary font-mono text-xs">${o.id}</code>)</p>
          </div>
        </div>
        <button onclick="window.closeModal()" class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="flex flex-col gap-space-lg">
        <div class="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface font-semibold">Google Form Applicant Link</label>
          <div class="flex gap-space-xs">
            <input id="gf-url-input" type="url" value="${o.googleFormUrl||""}" placeholder="https://forms.gle/..."
              class="flex-1 h-10 px-space-md bg-surface-container-lowest rounded-lg text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary"/>
            <button id="gf-save-btn" class="h-10 px-space-md bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-secondary transition-colors shrink-0">Save Link</button>
            ${o.googleFormUrl?`<a href="${o.googleFormUrl}" target="_blank" class="h-10 px-space-md bg-surface-container text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container-high transition-colors flex items-center gap-1 shrink-0"><span class="material-symbols-outlined text-[16px]">open_in_new</span>Open</a>`:""}
          </div>
        </div>

        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">Webhook Endpoint URL</label>
          <div class="flex items-center gap-space-xs bg-surface-container-low p-2 rounded-lg">
            <input type="text" readonly value="${n}" class="flex-1 bg-transparent text-body-sm font-mono text-on-surface px-2 focus:outline-none"/>
            <button onclick="navigator.clipboard.writeText('${n}'); window.showToast('Webhook URL copied!', 'success')" class="px-space-md py-1.5 bg-surface-container-lowest text-on-surface rounded font-label-sm text-label-sm hover:bg-surface-container-high shadow-sm shrink-0">Copy URL</button>
          </div>
        </div>

        <div class="flex flex-col gap-space-xs">
          <div class="flex items-center justify-between">
            <label class="font-label-md text-label-md text-on-surface-variant">Google Apps Script Code (Configured for Job)</label>
            <button id="copy-script-btn" class="text-secondary font-label-md text-label-md hover:underline flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">content_copy</span> Copy Code
            </button>
          </div>
          <textarea id="apps-script-textarea" readonly rows="7" class="w-full p-space-md bg-surface-container-lowest rounded-lg font-mono text-body-xs text-on-surface border border-outline-variant/30 focus:outline-none resize-none">${l}</textarea>
        </div>

        <div class="bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant/30 flex flex-col gap-space-xs">
          <span class="font-headline-sm text-headline-sm text-on-surface mb-1">Integration Instructions</span>
          <ol class="list-decimal list-inside font-body-sm text-body-sm text-on-surface-variant space-y-1">
            <li>Open Google Form → Responses → Link to Sheets.</li>
            <li>In Google Sheet → Extensions → Apps Script.</li>
            <li>Paste code above & click <b>Save</b> (💾 icon).</li>
            <li>Go to <b>Triggers</b> (⏰ icon) → Add Trigger → Select <code>onFormSubmit</code> → Event: <code>On form submit</code> → Save.</li>
          </ol>
        </div>
      </div>
    </div>`;window.openModal(i);const r=document.getElementById("gf-save-btn");r?.addEventListener("click",async()=>{const d=document.getElementById("gf-url-input").value.trim();r.disabled=!0;try{await window.api.patch(`/jobs/${t}`,{googleFormUrl:d}),window.showToast("Google Form link saved for job!","success"),window.closeModal(),window.loadPage("job-openings")}catch{window.showToast("Failed to save Google Form link","error"),r.disabled=!1}}),document.getElementById("copy-script-btn")?.addEventListener("click",()=>{navigator.clipboard.writeText(l),window.showToast("Google Apps Script copied!","success")})}}function m(e=null){const s=document.getElementById("job-form");if(!s)return;const t=document.getElementById("job-field"),o=document.getElementById("job-subfield");t?.addEventListener("change",a=>{const n=a.target.value,l=c[n]||[];o.innerHTML='<option value="">Select Sub-field</option>'+l.map(i=>`<option value="${i}">${i}</option>`).join("")}),s.addEventListener("submit",async a=>{a.preventDefault();const n=document.getElementById("job-submit"),l=document.getElementById("job-form-error");n.disabled=!0,n.innerHTML='<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>',l.classList.add("hidden");const i=document.getElementById("job-field").value,r=document.getElementById("job-subfield").value,d={title:document.getElementById("job-title").value,field:i,subField:r,department:i,jobType:document.getElementById("job-type").value,location:document.getElementById("job-location").value,salaryRange:document.getElementById("job-salary").value,description:document.getElementById("job-desc").value,skills:document.getElementById("job-skills").value.split(",").map(p=>p.trim()).filter(Boolean),status:document.getElementById("job-status").value};try{e?(await window.api.put(`/jobs/${e}`,d),window.showToast("Job updated successfully!","success")):(await window.api.post("/jobs",d),window.showToast("Job posted successfully!","success")),window.closeModal(),window.loadPage("job-openings")}catch(p){l.textContent=p.message,l.classList.remove("hidden"),n.disabled=!1,n.innerHTML=`<span class="material-symbols-outlined text-[18px]">save</span> ${e?"Save Changes":"Post Job"}`}})}async function b(e,s){const t=s??e.querySelector("#status-filter")?.value??"",o=e.querySelector("#dept-filter")?.value??"",a=e.querySelector("#type-filter")?.value??"";let n="/jobs?";t&&(n+=`status=${t}&`),o&&(n+=`department=${encodeURIComponent(o)}&`),a&&(n+=`jobType=${a}&`);try{const l=await window.api.get(n),i=e.querySelector("#jobs-table-body");i&&(i.innerHTML=l.map(f).join(""));const r=e.querySelector("#jobs-mobile-list");r&&(r.innerHTML=l.map(x).join(""))}catch{}}function v(e,s){const t=s.toLowerCase();e.querySelectorAll("#jobs-table-body tr").forEach(o=>{o.style.display=o.textContent.toLowerCase().includes(t)?"":"none"}),e.querySelectorAll("#jobs-mobile-list > div").forEach(o=>{o.style.display=o.textContent.toLowerCase().includes(t)?"":"none"})}function w(e){return{FULL_TIME:"Full Time",PART_TIME:"Part Time",CONTRACT:"Contract",INTERNSHIP:"Internship"}[e]||e||"Full Time"}function h(e,s){return`<div class="flex flex-col items-center justify-center py-16 gap-space-md text-on-surface-variant">
    <span class="material-symbols-outlined text-[48px]">work_off</span>
    <p class="font-headline-sm text-headline-sm">${e}</p>
    <p class="font-body-sm text-body-sm text-outline">${s}</p>
  </div>`}function S(){return[{id:"1",title:"Senior React Engineer",department:"Engineering",jobType:"FULL_TIME",location:"Remote",applicantCount:47,newApplicants:8,status:"OPEN",postedDate:new Date(Date.now()-7*864e5).toISOString()},{id:"2",title:"Product Manager",department:"Product",jobType:"FULL_TIME",location:"New York, NY",applicantCount:31,newApplicants:3,status:"OPEN",postedDate:new Date(Date.now()-14*864e5).toISOString()},{id:"3",title:"DevOps Lead",department:"Engineering",jobType:"FULL_TIME",location:"Remote",applicantCount:22,newApplicants:0,status:"OPEN",postedDate:new Date(Date.now()-21*864e5).toISOString()},{id:"4",title:"UX Designer",department:"Design",jobType:"CONTRACT",location:"San Francisco, CA",applicantCount:18,newApplicants:2,status:"OPEN",postedDate:new Date(Date.now()-5*864e5).toISOString()},{id:"5",title:"Security Analyst",department:"Operations",jobType:"FULL_TIME",location:"Austin, TX",applicantCount:12,newApplicants:1,status:"PAUSED",postedDate:new Date(Date.now()-30*864e5).toISOString()},{id:"6",title:"Backend Engineer (Node.js)",department:"Engineering",jobType:"FULL_TIME",location:"Remote",applicantCount:0,newApplicants:0,status:"DRAFT",postedDate:new Date().toISOString()}]}export{E as render};
