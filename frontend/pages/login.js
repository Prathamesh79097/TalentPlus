// ─────────────────────────────────────────────────────────────────
// Login / Auth Page
// ─────────────────────────────────────────────────────────────────

export async function render(container) {
  container.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-primary via-primary-container to-secondary flex items-center justify-center p-space-xl">
      <div class="w-full max-w-md">
        <!-- Card -->
        <div class="bg-surface-container-lowest rounded-2xl shadow-[0_24px_48px_rgba(0,0,0,0.18)] overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-primary to-secondary px-8 py-10 text-center">
            <div class="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-on-primary text-[36px]">bolt</span>
            </div>
            <h1 class="font-headline-lg text-headline-lg text-on-primary tracking-tight">TalentPulse</h1>
            <p class="font-body-sm text-body-sm text-on-primary/70 mt-1">Recruitment Management System</p>
          </div>

          <!-- Form -->
          <div class="p-8">
            <!-- Toggle -->
            <div class="flex bg-surface-container rounded-lg p-1 mb-6">
              <button id="signin-tab" class="flex-1 py-2 rounded-md font-label-md text-label-md transition-all bg-surface-container-lowest text-on-surface shadow-sm">Sign In</button>
              <button id="signup-tab" class="flex-1 py-2 rounded-md font-label-md text-label-md transition-all text-on-surface-variant">Sign Up</button>
            </div>

            <!-- Sign In Form -->
            <form id="signin-form" class="flex flex-col gap-space-lg">
              <div class="flex flex-col gap-space-xs">
                <label class="font-label-md text-label-md text-on-surface-variant">Email Address</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[20px]">email</span>
                  <input id="signin-email" type="email" required autocomplete="email"
                    class="w-full h-12 pl-11 pr-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md font-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                    placeholder="recruiter@company.com"/>
                </div>
              </div>
              <div class="flex flex-col gap-space-xs">
                <label class="font-label-md text-label-md text-on-surface-variant">Password</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                  <input id="signin-password" type="password" required autocomplete="current-password"
                    class="w-full h-12 pl-11 pr-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md font-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                    placeholder="••••••••"/>
                </div>
              </div>
              <div id="signin-error" class="hidden text-error font-body-sm text-body-sm bg-error-container/40 px-space-md py-space-sm rounded-lg"></div>
              <button type="submit" id="signin-btn"
                class="w-full h-12 bg-primary text-on-primary rounded-lg font-headline-sm text-headline-sm hover:bg-secondary transition-colors shadow-md flex items-center justify-center gap-space-sm">
                <span class="material-symbols-outlined text-[20px]">login</span>
                Sign In
              </button>
            </form>

            <!-- Sign Up Form -->
            <form id="signup-form" class="flex flex-col gap-space-lg hidden">
              <div class="grid grid-cols-2 gap-space-md">
                <div class="flex flex-col gap-space-xs">
                  <label class="font-label-md text-label-md text-on-surface-variant">First Name</label>
                  <input id="signup-firstname" type="text" required
                    class="h-12 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md font-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                    placeholder="Sarah"/>
                </div>
                <div class="flex flex-col gap-space-xs">
                  <label class="font-label-md text-label-md text-on-surface-variant">Last Name</label>
                  <input id="signup-lastname" type="text" required
                    class="h-12 px-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md font-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                    placeholder="Jenkins"/>
                </div>
              </div>
              <div class="flex flex-col gap-space-xs">
                <label class="font-label-md text-label-md text-on-surface-variant">Work Email</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[20px]">email</span>
                  <input id="signup-email" type="email" required
                    class="w-full h-12 pl-11 pr-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md font-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                    placeholder="sarah@company.com"/>
                </div>
              </div>
              <div class="flex flex-col gap-space-xs">
                <label class="font-label-md text-label-md text-on-surface-variant">Password</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                  <input id="signup-password" type="password" required minlength="8"
                    class="w-full h-12 pl-11 pr-space-md bg-surface-container-low rounded-lg text-on-surface text-body-md font-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                    placeholder="Min. 8 characters"/>
                </div>
              </div>
              <div id="signup-error" class="hidden text-error font-body-sm text-body-sm bg-error-container/40 px-space-md py-space-sm rounded-lg"></div>
              <button type="submit" id="signup-btn"
                class="w-full h-12 bg-primary text-on-primary rounded-lg font-headline-sm text-headline-sm hover:bg-secondary transition-colors shadow-md flex items-center justify-center gap-space-sm">
                <span class="material-symbols-outlined text-[20px]">person_add</span>
                Create Account
              </button>
            </form>
          </div>
        </div>
        <p class="text-center font-label-sm text-label-sm text-on-primary/60 mt-6">© 2025 TalentPulse · Secure & Encrypted</p>
      </div>
    </div>`;

  // Tab toggle
  const signinTab = container.querySelector('#signin-tab');
  const signupTab = container.querySelector('#signup-tab');
  const signinForm = container.querySelector('#signin-form');
  const signupForm = container.querySelector('#signup-form');

  const activateTab = (active, inactive, activeForm, inactiveForm) => {
    active.classList.add('bg-surface-container-lowest', 'text-on-surface', 'shadow-sm');
    active.classList.remove('text-on-surface-variant');
    inactive.classList.remove('bg-surface-container-lowest', 'text-on-surface', 'shadow-sm');
    inactive.classList.add('text-on-surface-variant');
    activeForm.classList.remove('hidden');
    inactiveForm.classList.add('hidden');
  };

  signinTab.addEventListener('click', () => activateTab(signinTab, signupTab, signinForm, signupForm));
  signupTab.addEventListener('click', () => activateTab(signupTab, signinTab, signupForm, signinForm));

  // Sign In
  signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = container.querySelector('#signin-email').value;
    const password = container.querySelector('#signin-password').value;
    const btn = container.querySelector('#signin-btn');
    const errEl = container.querySelector('#signin-error');
    btn.disabled = true;
    btn.innerHTML = '<div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>';
    errEl.classList.add('hidden');
    try {
      await window.signInWithEmailAndPassword(window.firebaseAuth, email, password);
    } catch (err) {
      errEl.textContent = formatAuthError(err);
      errEl.classList.remove('hidden');
      btn.disabled = false;
      btn.innerHTML = '<span class="material-symbols-outlined text-[20px]">login</span> Sign In';
    }
  });

  // Sign Up
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = container.querySelector('#signup-firstname').value;
    const lastName = container.querySelector('#signup-lastname').value;
    const email = container.querySelector('#signup-email').value;
    const password = container.querySelector('#signup-password').value;
    const btn = container.querySelector('#signup-btn');
    const errEl = container.querySelector('#signup-error');
    btn.disabled = true;
    btn.innerHTML = '<div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>';
    errEl.classList.add('hidden');
    try {
      const cred = await window.createUserWithEmailAndPassword(window.firebaseAuth, email, password);
      // Update display name via Spring Boot backend
      await window.api.post('/users/profile', {
        uid: cred.user.uid,
        firstName, lastName,
        email, role: 'RECRUITER'
      }).catch(() => {});
      showToast('Account created successfully!', 'success');
    } catch (err) {
      errEl.textContent = formatAuthError(err);
      errEl.classList.remove('hidden');
      btn.disabled = false;
      btn.innerHTML = '<span class="material-symbols-outlined text-[20px]">person_add</span> Create Account';
    }
  });
}

function formatAuthError(err) {
  console.error('[Auth Error]', err);
  const code = typeof err === 'string' ? err : (err?.code || err?.message);
  const msgs = {
    'auth/invalid-email': 'Invalid email address format.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'This email is already registered. Please switch to "Sign In".',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/operation-not-allowed': 'Email/Password sign-in is disabled in Firebase Console.',
    'auth/configuration-not-found': 'Firebase Authentication is not enabled in Firebase Console.',
    'CONFIGURATION_NOT_FOUND': 'Firebase Authentication is not initialized in Firebase Console. Enable Email/Password under Authentication -> Sign-in method.',
  };
  return msgs[code] || err?.message || 'Authentication failed. Please try again.';
}
