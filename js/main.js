document.addEventListener('DOMContentLoaded', () => {
  const welcomeScreen = document.getElementById('welcome-screen');
  const introScreen   = document.getElementById('intro-screen');
  const main          = document.querySelector('main');
  const footer        = document.querySelector('footer');
  const nav           = document.querySelector('nav');

  // Safety fallback
  const safetyTimer = setTimeout(() => {
    if (main)   main.style.visibility = 'visible';
    if (footer) footer.style.visibility = 'visible';
    if (nav)    nav.classList.add('instant');
    if (welcomeScreen) welcomeScreen.style.display = 'none';
    if (introScreen)   introScreen.style.display = 'none';
  }, 10000);

  if (welcomeScreen && introScreen) {
    if (main)   main.style.visibility = 'hidden';
    if (footer) footer.style.visibility = 'hidden';

    // Phase 1: Earth screen — "Welcome" fades in via CSS animation (2.5s)
    // Hold for 3.8s total then fade out
    setTimeout(() => {
      welcomeScreen.classList.add('fade-out');

      setTimeout(() => {
        welcomeScreen.style.display = 'none';

        // Phase 2: Moon intro screen — Aeilus fades in
        introScreen.classList.add('active');
        const logo    = introScreen.querySelector('.intro-logo');
        const tagline = introScreen.querySelector('.intro-tagline');
        if (logo)    logo.classList.add('animate');
        if (tagline) tagline.classList.add('animate');

        // Hold then dissolve into page
        setTimeout(() => {
          introScreen.classList.add('fade-out');
          setTimeout(() => {
            clearTimeout(safetyTimer);
            introScreen.style.display = 'none';
            if (main)   main.style.visibility = 'visible';
            if (footer) footer.style.visibility = 'visible';
            revealPageEntry();
          }, 1000);
        }, 3400);

      }, 900);
    }, 3800);

  } else {
    clearTimeout(safetyTimer);
    if (nav) nav.classList.add('instant');
  }
});

function revealPageEntry() {
  const nav = document.querySelector('nav');
  if (nav) setTimeout(() => nav.classList.add('visible'), 100);
  document.querySelectorAll('.entry-reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 300 + i * 300);
  });
}

// === MOBILE NAV TOGGLE ===
const hamburger = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('navMobileMenu');
const overlay = document.getElementById('navOverlay');

function closeMobileMenu() {
  if (hamburger) hamburger.classList.remove('open');
  if (mobileMenu) mobileMenu.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

if (hamburger && mobileMenu && overlay) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    overlay.classList.toggle('open');
  });
  overlay.addEventListener('click', closeMobileMenu);
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Bot protection for MailerLite signup forms.
// Adds a hidden "honeypot" field that people never see but bots fill in,
// and ignores submissions sent within 3 seconds of the page loading.
(function () {
  const loadedAt = Date.now();
  const MIN_MS = 3000;

  document.querySelectorAll('form.ml-block-form').forEach(form => {
    const trap = document.createElement('div');
    trap.setAttribute('aria-hidden', 'true');
    trap.style.cssText = 'position:absolute!important;left:-10000px!important;top:auto!important;width:1px!important;height:1px!important;overflow:hidden!important;';
    trap.innerHTML = '<label>Leave this field empty <input type="text" name="aeilus_hp" value="" tabindex="-1" autocomplete="off"></label>';
    form.appendChild(trap);
  });

  function guard(e) {
    const form = e.target.closest && e.target.closest('form.ml-block-form');
    if (!form) return;
    if (e.type === 'click' && !e.target.closest('button[type="submit"], input[type="submit"]')) return;
    const hp = form.querySelector('input[name="aeilus_hp"]');
    const isBot = (hp && hp.value.trim() !== '') || (Date.now() - loadedAt < MIN_MS);
    if (isBot) {
      e.preventDefault();
      e.stopImmediatePropagation();
    } else if (hp) {
      hp.disabled = true; // keep the trap field out of what gets sent to MailerLite
    }
  }

  document.addEventListener('submit', guard, true);
  document.addEventListener('click', guard, true);
})();
