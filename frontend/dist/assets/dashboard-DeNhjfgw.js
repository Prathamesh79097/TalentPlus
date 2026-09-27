async function A(e){let s={activeJobs:0,totalApplicants:0,todayInterviews:0,pendingOffers:0,funnelData:{}},t=[],n=[],a=[];try{[s,t,n,a]=await Promise.all([window.api.get("/dashboard/stats"),window.api.get("/interviews/today"),window.api.get("/activity/recent"),window.api.get("/jobs/urgent")])}catch{s={activeJobs:18,totalApplicants:342,unreadApplicants:24,todayInterviews:6,doneInterviews:2,pendingOffers:5,signedOffers:3,acceptanceRate:82,pipelineHealth:"94% On Schedule",funnelSourced:140,funnelScreening:85,funnelInterviews:32,funnelSelection:12,funnelOffers:8,funnelHired:5},t=[],n=[],a=[]}const l=window.currentUser,i=l?.displayName||l?.email?.split("@")[0]||"Recruiter",d=new Date().getHours(),m=d<12?"Good morning":d<18?"Good afternoon":"Good evening",f=document.getElementById("sidebar-pipeline-health");f&&(f.textContent=s.pipelineHealth||"94% On Schedule"),e.innerHTML=`
  <!-- ═══ DESKTOP LAYOUT ═══ -->
  <div class="hidden lg:block">
    <div class="p-8 flex flex-col gap-space-xl max-w-7xl mx-auto w-full">

      <!-- Page Header -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg pb-space-xs">
        <div class="flex flex-col">
          <div class="flex items-center gap-space-sm mb-space-xs">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm">
              <span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              Live Pipeline Cycle
            </span>
            <span class="text-outline font-label-sm text-label-sm">Updated just now</span>
          </div>
          <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">${m}, ${i}</h1>
          <p class="font-body-md text-body-md text-on-surface-variant">Q3 Hiring Cycle • ${s.activeJobs||18} Active Requisitions</p>
        </div>
        <div class="flex flex-wrap items-center gap-space-sm">
          <button onclick="window.loadPage('job-openings')" class="h-10 px-space-md flex items-center gap-space-xs rounded-lg bg-surface-container-lowest text-primary font-body-sm text-body-sm hover:bg-surface-container-high transition-colors shadow-sm font-medium">
            <span class="material-symbols-outlined text-[18px]">calendar_add_on</span>
            <span>Schedule</span>
          </button>
          <button onclick="window.openPostJobModal()" class="h-10 px-space-lg flex items-center gap-space-xs rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-secondary transition-all shadow-md">
            <span class="material-symbols-outlined text-[18px]">add</span>
            <span>Post New Job</span>
          </button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-lg">
        ${r("Total Active Jobs",s.activeJobs??18,"/ 22 Target","work","+2 this week","14 Active • 4 Draft","trending_up","text-secondary")}
        ${r("Total Applicants",s.totalApplicants??342,`<span class="inline-flex items-center font-label-sm text-label-sm text-primary font-bold bg-surface-container-high px-2 py-0.5 rounded-full">${s.unreadApplicants??24} unread</span>`,"group","+14% vs last cycle","High volume","north_east","text-secondary")}
        ${r("Today's Sessions",s.todayInterviews??6,"Interviews","event_available","Next in 45m",`${s.doneInterviews??2} done • ${(s.todayInterviews??6)-(s.doneInterviews??2)} upcoming`,"schedule","text-secondary")}
        ${r("Pending Offers",s.pendingOffers??5,"Active","verified_user",`${s.acceptanceRate??82}% Acceptance`,`${s.signedOffers??3} Signed • ${(s.pendingOffers??5)-(s.signedOffers??3)} In Review`,"local_offer","text-primary")}
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">

        <!-- Left Column (8 cols) -->
        <div class="lg:col-span-8 flex flex-col gap-space-xl">

          <!-- Candidate Velocity Funnel -->
          <div class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-lg">
              <div>
                <div class="flex items-center gap-space-sm">
                  <span class="font-headline-md text-headline-md text-on-surface">Candidate Velocity Funnel</span>
                  <span class="px-2 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold">Active Cycle</span>
                </div>
                <p class="font-body-sm text-body-sm text-outline mt-0.5">Average cycle duration: 21.4 days across technical requisitions</p>
              </div>
              <button onclick="window.loadPage('reports')" class="flex items-center gap-space-xs text-body-sm font-body-sm text-secondary font-medium cursor-pointer hover:underline">
                <span>View analytics</span>
                <span class="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-space-sm">
              ${o("1. Sourced",s.funnelSourced??140,100,"100% pool")}
              ${o("2. Screening",s.funnelScreening??85,60.7,"60.7% pass")}
              ${o("3. Interviews",s.funnelInterviews??32,37.6,"37.6% screen")}
              ${o("4. Selection",s.funnelSelection??12,37.5,"37.5% final")}
              ${o("5. Offers",s.funnelOffers??8,66.7,"66.7% select")}
              ${o("6. Hired",s.funnelHired??5,62.5,"62.5% offer",!0)}
            </div>
          </div>

          <!-- Today's Interviews -->
          <div class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm">
            <div class="flex items-center justify-between pb-space-lg">
              <div>
                <span class="font-headline-md text-headline-md text-on-surface">Today's Interview Schedule</span>
                <p class="font-body-sm text-body-sm text-outline mt-0.5">All upcoming sessions for today</p>
              </div>
              <button onclick="window.loadPage('interviews')" class="font-label-md text-label-md text-secondary hover:underline">View all</button>
            </div>
            <div id="desktop-interviews-list" class="flex flex-col gap-space-md">
              ${t.length>0?t.map(b).join(""):h()}
            </div>
          </div>

          <!-- Recent Activity Feed -->
          <div class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm">
            <div class="flex items-center justify-between pb-space-lg">
              <span class="font-headline-md text-headline-md text-on-surface">Recent Activity</span>
            </div>
            <div id="desktop-activity-list" class="flex flex-col divide-y divide-outline-variant/30">
              ${n.length>0?n.map(g).join(""):k()}
            </div>
          </div>
        </div>

        <!-- Right Column (4 cols) -->
        <div class="lg:col-span-4 flex flex-col gap-space-xl">

          <!-- Urgent Requisitions -->
          <div class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm">
            <div class="flex items-center justify-between pb-space-lg">
              <span class="font-headline-md text-headline-md text-on-surface">Urgent Requisitions</span>
              <button onclick="window.loadPage('job-openings')" class="font-label-md text-label-md text-secondary hover:underline">All jobs</button>
            </div>
            <div class="flex flex-col gap-space-md">
              ${a.length>0?a.map(v).join(""):j()}
            </div>
          </div>

          <!-- Hiring by Department -->
          <div class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm">
            <div class="pb-space-lg">
              <span class="font-headline-md text-headline-md text-on-surface">Hiring by Department</span>
            </div>
            <div class="flex flex-col gap-space-md">
              ${c("Engineering",8,22,"#0051d5")}
              ${c("Product & Design",3,8,"#4059aa")}
              ${c("Operations",4,11,"#264191")}
              ${c("Sales",2,5,"#316bf3")}
              ${c("HR",1,3,"#b4c5ff")}
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm">
            <div class="pb-space-lg">
              <span class="font-headline-md text-headline-md text-on-surface">Quick Actions</span>
            </div>
            <div class="grid grid-cols-2 gap-space-sm">
              <button onclick="window.openPostJobModal()" class="flex flex-col items-center gap-space-xs p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors group">
                <span class="material-symbols-outlined text-primary text-[28px] group-hover:scale-110 transition-transform">add_circle</span>
                <span class="font-label-md text-label-md text-on-surface text-center">Post Job</span>
              </button>
              <button onclick="window.loadPage('applicants')" class="flex flex-col items-center gap-space-xs p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors group">
                <span class="material-symbols-outlined text-secondary text-[28px] group-hover:scale-110 transition-transform">person_add</span>
                <span class="font-label-md text-label-md text-on-surface text-center">Add Candidate</span>
              </button>
              <button onclick="window.loadPage('interviews')" class="flex flex-col items-center gap-space-xs p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors group">
                <span class="material-symbols-outlined text-primary text-[28px] group-hover:scale-110 transition-transform">calendar_add_on</span>
                <span class="font-label-md text-label-md text-on-surface text-center">Schedule</span>
              </button>
              <button onclick="window.loadPage('reports')" class="flex flex-col items-center gap-space-xs p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors group">
                <span class="material-symbols-outlined text-secondary text-[28px] group-hover:scale-110 transition-transform">insights</span>
                <span class="font-label-md text-label-md text-on-surface text-center">Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══ MOBILE LAYOUT ═══ -->
  <div class="lg:hidden flex flex-col w-full px-margin py-space-md space-y-space-lg pb-24">

    <!-- Welcome Banner -->
    <section class="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex items-center justify-between">
      <div class="flex items-center gap-space-md min-w-0">
        <div class="relative shrink-0">
          <div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-lg">${i[0]?.toUpperCase()||"?"}</div>
          <span class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-secondary-container rounded-full ring-2 ring-surface-container-lowest flex items-center justify-center">
            <span class="w-1.5 h-1.5 bg-on-secondary rounded-full"></span>
          </span>
        </div>
        <div class="flex flex-col min-w-0">
          <div class="flex items-center gap-space-xs">
            <span class="font-body-sm text-body-sm text-on-surface-variant truncate">${m},</span>
            <span class="font-label-sm text-label-sm text-secondary bg-surface-container px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">Q3 Cycle</span>
          </div>
          <h2 class="font-headline-md text-headline-md text-on-surface truncate">${i}</h2>
        </div>
      </div>
      <button onclick="window.loadPage('reports')" aria-label="Analytics" class="w-10 h-10 rounded-lg bg-surface-container-low text-secondary flex items-center justify-center active:scale-95 transition-transform shrink-0">
        <span class="material-symbols-outlined text-[20px]">insights</span>
      </button>
    </section>

    <!-- 4 KPI Cards (2x2) -->
    <section class="grid grid-cols-2 gap-space-sm">
      ${p("18","Total Jobs","work","+2 wk","secondary","14 Active • 4 Draft",s.activeJobs)}
      ${p("342","Applicants","group","↑14%","secondary-container text-on-secondary","24 unread new",s.totalApplicants)}
      ${p("6","Interviews Today","event_available","●","secondary-container animate-pulse","2 done • 4 next",s.todayInterviews)}
      ${p("5","Pending Offers","local_offer","60% Win","surface-container","3 signed • 2 wait",s.pendingOffers)}
    </section>

    <!-- Quick Actions -->
    <section class="grid grid-cols-2 gap-space-sm">
      <button onclick="window.openPostJobModal()" class="bg-primary text-on-primary py-2.5 px-space-md rounded-lg shadow-sm flex items-center justify-center gap-space-xs active:scale-95 transition-transform min-h-[44px]">
        <span class="material-symbols-outlined text-[20px]">add_circle</span>
        <span class="font-headline-sm text-headline-sm tracking-wide">Post Job</span>
      </button>
      <button onclick="window.loadPage('interviews')" class="bg-surface-container-lowest text-secondary py-2.5 px-space-md rounded-lg shadow-sm flex items-center justify-center gap-space-xs active:scale-95 transition-transform min-h-[44px]">
        <span class="material-symbols-outlined text-[20px]">calendar_add_on</span>
        <span class="font-headline-sm text-headline-sm tracking-wide">Schedule</span>
      </button>
    </section>

    <!-- Funnel Breakdown -->
    <section class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-space-md">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-space-xs">
          <span class="material-symbols-outlined text-secondary text-[20px]">stacked_bar_chart</span>
          <h3 class="font-headline-sm text-headline-sm text-on-surface">Hiring Funnel</h3>
        </div>
        <span class="font-label-sm text-label-sm text-on-surface-variant">Active Pipeline</span>
      </div>
      <div class="w-full h-3 rounded-full bg-surface-container overflow-hidden flex">
        <div class="h-full bg-primary-container" style="width:52%" title="Sourced:52%"></div>
        <div class="h-full bg-secondary-container" style="width:31%" title="Screened:31%"></div>
        <div class="h-full bg-secondary" style="width:12%" title="Interviewed:12%"></div>
        <div class="h-full bg-surface-tint" style="width:3%" title="Offer:3%"></div>
        <div class="h-full bg-primary" style="width:2%" title="Hired:2%"></div>
      </div>
      <div class="grid grid-cols-5 gap-1 text-center pt-space-xs">
        ${["140","85","32","8","5"].map((u,x)=>`
          <div class="flex flex-col items-center bg-surface-container-low py-1.5 px-1 rounded">
            <span class="font-headline-sm text-headline-sm text-${["primary-container","secondary-container","secondary","surface-tint","primary"][x]}">${u}</span>
            <span class="font-label-sm text-label-sm text-on-surface-variant" style="font-size:10px">${["Sourced","Screen","Interv.","Offer","Hired"][x]}</span>
          </div>`).join("")}
      </div>
    </section>

    <!-- Today's Interviews Carousel -->
    <section class="space-y-space-sm">
      <div class="flex items-center justify-between px-space-xs">
        <div class="flex items-center gap-space-xs">
          <span class="material-symbols-outlined text-secondary text-[20px]">videocam</span>
          <h3 class="font-headline-sm text-headline-sm text-on-surface">Today's Interviews</h3>
        </div>
        <button onclick="window.loadPage('interviews')" class="font-label-sm text-label-sm text-secondary bg-surface-container px-2 py-0.5 rounded-full font-semibold">View All</button>
      </div>
      <div class="flex gap-space-md overflow-x-auto pb-space-xs -mx-margin px-margin no-scrollbar">
        ${t.length>0?t.map(w).join(""):$()}
      </div>
    </section>

    <!-- Urgent Requisitions -->
    <section class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-space-md">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-space-xs">
          <span class="material-symbols-outlined text-error text-[20px]">priority_high</span>
          <h3 class="font-headline-sm text-headline-sm text-on-surface">Urgent Reqs.</h3>
        </div>
        <button onclick="window.loadPage('job-openings')" class="font-label-sm text-label-sm text-secondary">All Jobs</button>
      </div>
      <div class="flex flex-col gap-space-sm">
        ${a.length>0?a.map(y).join(""):S()}
      </div>
    </section>
  </div>`,window.openPostJobModal=()=>{window.loadPage("job-openings")}}function r(e,s,t,n,a,l,i,d){return`
  <div class="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
    <div class="flex items-start justify-between">
      <div class="flex flex-col">
        <span class="font-label-sm text-label-sm text-outline uppercase tracking-wider">${e}</span>
        <div class="flex items-baseline gap-space-xs mt-1">
          <span class="font-headline-lg text-headline-lg text-on-surface font-bold">${s}</span>
          <span class="font-body-sm text-body-sm text-outline">${t}</span>
        </div>
      </div>
      <div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
        <span class="material-symbols-outlined text-[20px]">${n}</span>
      </div>
    </div>
    <div class="mt-space-md pt-space-sm flex items-center justify-between">
      <span class="inline-flex items-center gap-1 text-label-sm font-label-sm ${d} font-semibold bg-surface-container px-2 py-0.5 rounded-full">
        <span class="material-symbols-outlined text-sm">${i}</span>${a}
      </span>
      <span class="font-label-sm text-label-sm text-outline">${l}</span>
    </div>
  </div>`}function p(e,s,t,n,a,l,i){return`
  <div class="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between space-y-space-sm">
    <div class="flex items-center justify-between">
      <span class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
        <span class="material-symbols-outlined text-[20px]">${t}</span>
      </span>
      <span class="font-label-sm text-label-sm px-1.5 py-0.5 rounded-full bg-${a} font-semibold">${n}</span>
    </div>
    <div>
      <span class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface block tracking-tight">${i!==void 0?i:e}</span>
      <span class="font-label-md text-label-md text-on-surface-variant block">${s}</span>
    </div>
    <div class="pt-space-xs bg-surface-container-low rounded-lg p-1.5 text-center">
      <span class="font-body-sm text-body-sm text-on-surface-variant">${l}</span>
    </div>
  </div>`}function o(e,s,t,n,a=!1){return`
  <div class="bg-surface-container-low p-space-md rounded-lg flex flex-col justify-between relative group hover:bg-surface-container-high transition-colors">
    <span class="font-label-sm text-label-sm text-outline uppercase font-semibold">${e}</span>
    <div class="my-space-sm">
      <span class="font-headline-md text-headline-md font-bold text-on-surface">${s}</span>
      <div class="w-full bg-surface-container-highest h-1.5 rounded-full mt-2 overflow-hidden">
        <div class="${a?"bg-secondary":"bg-primary"} h-full rounded-full" style="width:${t}%"></div>
      </div>
    </div>
    <span class="font-label-sm text-label-sm text-secondary font-medium">${n}</span>
  </div>`}function c(e,s,t,n){const a=Math.round(s/t*100);return`
  <div class="flex flex-col gap-1">
    <div class="flex items-center justify-between">
      <span class="font-body-sm text-body-sm text-on-surface">${e}</span>
      <span class="font-label-md text-label-md text-outline">${s}/${t}</span>
    </div>
    <div class="w-full h-2 bg-surface-container rounded-full overflow-hidden">
      <div class="h-full rounded-full" style="width:${a}%;background:${n}"></div>
    </div>
  </div>`}function b(e){return`
  <div class="flex items-center justify-between p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors">
    <div class="flex items-center gap-space-md">
      <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-semibold text-sm shrink-0">
        ${(e.candidateName||"C")[0]}
      </div>
      <div>
        <p class="font-headline-sm text-headline-sm text-on-surface">${e.candidateName}</p>
        <p class="font-body-sm text-body-sm text-on-surface-variant">${e.position}</p>
      </div>
    </div>
    <div class="flex items-center gap-space-md">
      <span class="font-label-sm text-label-sm text-outline">${window.fmtTime(e.scheduledAt)}</span>
      <span class="${window.statusBadge(e.status)}">${e.status}</span>
      <button onclick="window.loadPage('interviews')" class="px-space-md py-1 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md hover:opacity-90 transition-opacity">Join</button>
    </div>
  </div>`}function w(e){return`
  <div class="min-w-[280px] max-w-[290px] bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between space-y-space-md shrink-0">
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-space-sm">
        <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-semibold text-sm">${(e.candidateName||"C")[0]}</div>
        <div class="min-w-0">
          <h4 class="font-headline-sm text-headline-sm text-on-surface truncate">${e.candidateName}</h4>
          <p class="font-body-sm text-body-sm text-on-surface-variant truncate">${e.position}</p>
        </div>
      </div>
      <span class="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary font-semibold shrink-0">${window.fmtTime(e.scheduledAt)}</span>
    </div>
    <div class="flex items-center gap-space-sm">
      <button class="flex-1 bg-secondary text-on-secondary py-2 px-space-sm rounded-md font-label-md text-label-md flex items-center justify-center gap-1 active:scale-95 transition-transform min-h-[44px]">
        <span class="material-symbols-outlined text-[18px]">video_call</span> Join
      </button>
    </div>
  </div>`}function g(e){return`
  <div class="flex items-center gap-space-md py-space-md">
    <div class="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
      <span class="material-symbols-outlined text-[16px]">${{applied:"person_add",moved:"arrow_forward",scheduled:"calendar_month",hired:"celebration",offer_sent:"local_offer"}[e.type]||"circle"}</span>
    </div>
    <div class="flex-1 min-w-0">
      <p class="font-body-sm text-body-sm text-on-surface">${e.message}</p>
      <p class="font-label-sm text-label-sm text-outline">${window.timeAgo(e.timestamp)}</p>
    </div>
  </div>`}function v(e){return`
  <div class="flex items-center justify-between p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer" onclick="window.loadPage('job-openings')">
    <div>
      <p class="font-headline-sm text-headline-sm text-on-surface">${e.title}</p>
      <p class="font-body-sm text-body-sm text-on-surface-variant">${e.department} • ${e.daysOpen}d open</p>
    </div>
    <span class="inline-flex items-center gap-1 font-label-sm text-label-sm text-error bg-error-container/40 px-2 py-0.5 rounded-full font-semibold shrink-0">
      ${e.applicants} apps
    </span>
  </div>`}function y(e){return`
  <div class="flex items-center justify-between py-space-sm border-b border-outline-variant/30 last:border-0">
    <div class="min-w-0">
      <p class="font-body-md text-body-md text-on-surface truncate">${e.title}</p>
      <p class="font-body-sm text-body-sm text-outline">${e.department}</p>
    </div>
    <span class="font-label-sm text-label-sm text-error bg-error-container/40 px-2 py-0.5 rounded-full font-semibold shrink-0 ml-space-sm">${e.daysOpen}d open</span>
  </div>`}function h(){return[{candidateName:"Alex Rivera",position:"Sr. React Engineer",scheduledAt:new Date().toISOString(),status:"Scheduled"},{candidateName:"Priya Sharma",position:"Product Manager",scheduledAt:new Date().toISOString(),status:"Confirmed"},{candidateName:"Marcus Chen",position:"DevOps Lead",scheduledAt:new Date().toISOString(),status:"Scheduled"}].map(b).join("")}function $(){return[{candidateName:"Alex Rivera",position:"Sr. React Engineer",scheduledAt:"10:30 AM"},{candidateName:"Priya Sharma",position:"Product Manager",scheduledAt:"2:00 PM"}].map(e=>`
  <div class="min-w-[280px] max-w-[290px] bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between space-y-space-md shrink-0">
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-space-sm">
        <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-semibold text-sm">${e.candidateName[0]}</div>
        <div class="min-w-0">
          <h4 class="font-headline-sm text-headline-sm text-on-surface truncate">${e.candidateName}</h4>
          <p class="font-body-sm text-body-sm text-on-surface-variant truncate">${e.position}</p>
        </div>
      </div>
      <span class="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary font-semibold shrink-0">${e.scheduledAt}</span>
    </div>
    <div class="flex items-center gap-space-sm">
      <button class="flex-1 bg-secondary text-on-secondary py-2 px-space-sm rounded-md font-label-md text-label-md flex items-center justify-center gap-1 min-h-[44px]">
        <span class="material-symbols-outlined text-[18px]">video_call</span> Join
      </button>
      <button class="bg-surface-container text-on-surface py-2 px-space-md rounded-md font-label-md text-label-md min-h-[44px]">Brief</button>
    </div>
  </div>`).join("")}function k(){return[{type:"applied",message:"Alex Rivera applied for Sr. React Engineer",timestamp:new Date(Date.now()-3e5).toISOString()},{type:"moved",message:"Priya Sharma moved to Interview stage",timestamp:new Date(Date.now()-18e5).toISOString()},{type:"offer_sent",message:"Offer sent to Marcus Chen for DevOps Lead",timestamp:new Date(Date.now()-36e5).toISOString()},{type:"hired",message:"Jennifer Kim accepted offer — Backend Engineer",timestamp:new Date(Date.now()-864e5).toISOString()}].map(g).join("")}function j(){return[{title:"Sr. Backend Engineer",department:"Engineering",daysOpen:28,applicants:47},{title:"Product Manager",department:"Product",daysOpen:35,applicants:31},{title:"Security Analyst",department:"Operations",daysOpen:42,applicants:18}].map(v).join("")}function S(){return[{title:"Sr. Backend Engineer",department:"Engineering",daysOpen:28},{title:"Product Manager",department:"Product",daysOpen:35}].map(y).join("")}export{A as render};
