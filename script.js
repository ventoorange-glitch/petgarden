/* ══════════════════════════════════════
   PET GARDEN – script.js
══════════════════════════════════════ */

/* ── Hamburger ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
const btnNav    = document.querySelector('.btn-nav');

hamburger?.addEventListener('click', () => {
  navLinks?.classList.toggle('open');
  btnNav?.classList.toggle('open');
});

/* ── Smooth active nav highlight ── */
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');

function activateNav() {
  const scrollY = window.scrollY;
  sections.forEach(section => {
    const top    = section.offsetTop - 100;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navAs.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }
  });
}
window.addEventListener('scroll', activateNav, { passive: true });

/* ── Scroll-reveal animation ── */
const revealEls = document.querySelectorAll(
  '.service-card, .social-card, .info-card, .reel-card, ' +
  '.nosotros-info, .nosotros-map, .contacto-text, .contacto-cards'
);

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);

revealEls.forEach((el, i) => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(24px)';
  el.style.transition = `opacity .5s ease ${i * 0.05}s, transform .5s ease ${i * 0.05}s`;
  observer.observe(el);
});

/*
  ══════════════════════════════════════
  HOW TO UPDATE THE REELS
  ══════════════════════════════════════
  1. Open Instagram on your phone
  2. Go to @petgardenveterinaria → Reels tab
  3. For each reel you want to show:
       a. Take a screenshot (portrait, like the reel itself)
       b. Save the screenshot into the /reels/ folder:
            reels/reel1.jpg
            reels/reel2.jpg
            reels/reel3.jpg
            reels/reel4.jpg
            reels/reel5.jpg
            reels/reel6.jpg
       c. To link directly to that reel, tap Share → Copy link,
          then paste the URL into the matching href in index.html
  ══════════════════════════════════════
*/
