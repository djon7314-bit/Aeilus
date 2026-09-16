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
