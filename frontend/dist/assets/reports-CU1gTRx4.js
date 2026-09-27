async function d(a){let l={};try{l=await window.api.get("/dashboard/stats")}catch{}a.innerHTML=`
  <div class="p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24">
    <div class="mb-space-xl">
      <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">Reports & Analytics</h1>
      <p class="font-body-md text-body-md text-on-surface-variant">Insights into your recruitment pipeline performance</p>
    </div>

    <!-- KPI Summary -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-space-lg mb-space-xl">
      ${[["Time to Hire","21.4 days","avg","schedule"],["Offer Acceptance","82%","rate","check_circle"],["Pipeline Efficiency","94%","on schedule","trending_up"],["Cost per Hire","$4,200","avg","payments"]].map(([e,s,t,n])=>`
        <div class="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
          <div class="flex items-center justify-between mb-space-sm">
            <span class="material-symbols-outlined text-secondary text-[24px]">${n}</span>
          </div>
          <span class="font-headline-md text-headline-md text-on-surface font-bold block">${s}</span>
          <span class="font-label-sm text-label-sm text-outline block">${e}</span>
          <span class="font-label-sm text-label-sm text-secondary block">${t}</span>
        </div>
      `).join("")}
    </div>

    <!-- Charts (Placeholder visual bars) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-space-xl mb-space-xl">
      <div class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm">
        <h3 class="font-headline-sm text-headline-sm text-on-surface mb-space-lg">Hires by Department</h3>
        ${[["Engineering",8,22],["Product & Design",3,8],["Operations",4,11],["Sales",2,5],["HR",1,3]].map(([e,s,t])=>`
          <div class="mb-space-md">
            <div class="flex justify-between mb-space-xs">
              <span class="font-body-sm text-body-sm text-on-surface">${e}</span>
              <span class="font-label-md text-label-md text-outline">${s} / ${t}</span>
            </div>
            <div class="w-full h-2 bg-surface-container rounded-full overflow-hidden">
              <div class="h-full bg-secondary rounded-full transition-all" style="width:${Math.round(s/t*100)}%"></div>
            </div>
          </div>
        `).join("")}
      </div>

      <div class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm">
        <h3 class="font-headline-sm text-headline-sm text-on-surface mb-space-lg">Pipeline Stage Distribution</h3>
        ${[["New",140,"#1e3a8a"],["Screening",85,"#0051d5"],["Interview",32,"#316bf3"],["Selection",12,"#b4c5ff"],["Offer",8,"#dce1ff"],["Hired",5,"#ecfdf5"]].map(([e,s,t])=>`
          <div class="mb-space-md">
            <div class="flex justify-between mb-space-xs">
              <span class="font-body-sm text-body-sm text-on-surface">${e}</span>
              <span class="font-label-md text-label-md text-outline">${s}</span>
            </div>
            <div class="w-full h-2 bg-surface-container rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all" style="width:${Math.round(s/140*100)}%;background:${t}"></div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Recent Hires Table -->
    <div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
      <div class="p-space-xl border-b border-outline-variant/30">
        <h3 class="font-headline-sm text-headline-sm text-on-surface">Recent Hires</h3>
      </div>
      <table class="w-full">
        <thead class="bg-surface-container-low">
          <tr>
            <th class="text-left px-space-xl py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Candidate</th>
            <th class="text-left px-space-md py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider hidden md:table-cell">Role</th>
            <th class="text-left px-space-md py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider hidden md:table-cell">Department</th>
            <th class="text-left px-space-md py-space-md font-label-sm text-label-sm text-outline uppercase tracking-wider">Hired Date</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-outline-variant/20">
          ${[{name:"Jennifer Kim",role:"Backend Engineer",dept:"Engineering",date:new Date(Date.now()-3*864e5)},{name:"Alex Rivera",role:"Sr. React Engineer",dept:"Engineering",date:new Date(Date.now()-10*864e5)},{name:"Tom Wilson",role:"Product Manager",dept:"Product",date:new Date(Date.now()-20*864e5)}].map(e=>`
            <tr class="hover:bg-surface-container-low">
              <td class="px-space-xl py-space-md">
                <div class="flex items-center gap-space-md">
                  <div class="w-8 h-8 rounded-full bg-status-hired flex items-center justify-center text-white font-semibold text-sm shrink-0">${e.name[0]}</div>
                  <span class="font-body-md text-body-md text-on-surface">${e.name}</span>
                </div>
              </td>
              <td class="px-space-md py-space-md hidden md:table-cell"><span class="font-body-sm text-body-sm text-on-surface">${e.role}</span></td>
              <td class="px-space-md py-space-md hidden md:table-cell"><span class="font-body-sm text-body-sm text-outline">${e.dept}</span></td>
              <td class="px-space-md py-space-md"><span class="font-body-sm text-body-sm text-outline">${window.fmtDate(e.date)}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  </div>`}export{d as render};
