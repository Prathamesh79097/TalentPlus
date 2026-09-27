async function o(t){const e=window.currentUser;t.innerHTML=`
  <div class="p-6 lg:p-8 max-w-3xl mx-auto w-full pb-24">
    <div class="mb-space-xl">
      <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">Settings</h1>
      <p class="font-body-md text-body-md text-on-surface-variant">Manage your account and application preferences</p>
    </div>

    <!-- Profile Section -->
    <div class="bg-surface-container-lowest rounded-xl shadow-sm mb-space-xl overflow-hidden">
      <div class="p-space-xl border-b border-outline-variant/20">
        <h2 class="font-headline-sm text-headline-sm text-on-surface">Profile Settings</h2>
      </div>
      <div class="p-space-xl flex flex-col gap-space-lg">
        <div class="flex items-center gap-space-xl">
          <div class="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-2xl">
            ${(e?.displayName||e?.email||"U")[0]?.toUpperCase()}
          </div>
          <div>
            <p class="font-headline-sm text-headline-sm text-on-surface">${e?.displayName||"Recruiter"}</p>
            <p class="font-body-sm text-body-sm text-on-surface-variant">${e?.email}</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
          <div class="flex flex-col gap-space-xs">
            <label class="font-label-md text-label-md text-on-surface-variant">Display Name</label>
            <input id="setting-name" type="text" value="${e?.displayName||""}" class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"/>
          </div>
          <div class="flex flex-col gap-space-xs">
            <label class="font-label-md text-label-md text-on-surface-variant">Job Title</label>
            <input id="setting-jobtitle" type="text" placeholder="Lead Recruiter" class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary"/>
          </div>
        </div>
        <button id="save-profile-btn" class="self-end px-space-xl py-space-sm rounded-lg bg-primary text-on-primary font-body-sm text-body-sm hover:bg-secondary transition-colors shadow-md">Save Profile</button>
      </div>
    </div>

    <!-- Notifications Section -->
    <div class="bg-surface-container-lowest rounded-xl shadow-sm mb-space-xl overflow-hidden">
      <div class="p-space-xl border-b border-outline-variant/20">
        <h2 class="font-headline-sm text-headline-sm text-on-surface">Notifications</h2>
      </div>
      <div class="p-space-xl flex flex-col gap-space-lg">
        ${[["New applicant received","new_applicant",!0],["Interview reminder (1 hour before)","interview_reminder",!0],["Offer accepted/declined","offer_status",!0],["Candidate stage changes","stage_change",!1],["Weekly pipeline digest","weekly_digest",!1]].map(([s,a,l])=>`
          <div class="flex items-center justify-between">
            <span class="font-body-md text-body-md text-on-surface">${s}</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer notif-toggle" data-key="${a}" ${l?"checked":""}>
              <div class="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-secondary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- App Settings -->
    <div class="bg-surface-container-lowest rounded-xl shadow-sm mb-space-xl overflow-hidden">
      <div class="p-space-xl border-b border-outline-variant/20">
        <h2 class="font-headline-sm text-headline-sm text-on-surface">Application</h2>
      </div>
      <div class="p-space-xl flex flex-col gap-space-lg">
        <div class="flex flex-col gap-space-xs">
          <label class="font-label-md text-label-md text-on-surface-variant">API Base URL</label>
          <input id="api-url" type="text" value="http://localhost:8080/api" class="h-11 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md focus:outline-none focus:ring-2 focus:ring-secondary font-mono text-sm"/>
          <p class="font-body-sm text-body-sm text-outline">The Spring Boot backend URL</p>
        </div>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="bg-surface-container-lowest rounded-xl shadow-sm border border-error/30 overflow-hidden">
      <div class="p-space-xl border-b border-error/20">
        <h2 class="font-headline-sm text-headline-sm text-error">Danger Zone</h2>
      </div>
      <div class="p-space-xl flex flex-col gap-space-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-body-md text-body-md text-on-surface">Sign Out</p>
            <p class="font-body-sm text-body-sm text-outline">Sign out of all devices</p>
          </div>
          <button onclick="window.logout()" class="px-space-lg py-space-sm rounded-lg border border-error text-error hover:bg-error-container transition-colors font-body-sm text-body-sm">Sign Out</button>
        </div>
      </div>
    </div>
  </div>`,t.querySelector("#save-profile-btn")?.addEventListener("click",async()=>{window.showToast("Profile saved!","success")})}export{o as render};
