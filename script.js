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

/* ── Smooth active nav ── */
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');

function activateNav() {
  let scrollY = window.scrollY;
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
  '.service-card, .social-card, .info-card, .reel-card, .nosotros-info, .nosotros-map, .contacto-text, .contacto-cards'
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity    = '1';
        entry.target.style.transform  = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

revealEls.forEach((el, i) => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(28px)';
  el.style.transition = `opacity .55s ease ${i * 0.06}s, transform .55s ease ${i * 0.06}s`;
  observer.observe(el);
});

/* ══════════════════════════════════════
   INSTAGRAM REELS FEED
   ──────────────────────────────────────
   To connect REAL reels:
   1. Create a Facebook Developer App
   2. Get an Instagram Basic Display API token
   3. Set ACCESS_TOKEN below
   The feed will automatically load your
   latest 6 reels from @petgardenveterinaria
══════════════════════════════════════ */

const ACCESS_TOKEN = ''; // ← Paste your Instagram Basic Display API token here
const IG_HANDLE    = 'petgardenveterinaria';
const IG_PROFILE   = `https://www.instagram.com/${IG_HANDLE}/`;
const REELS_COUNT  = 6;

const grid = document.getElementById('reels-grid');

/* Paw emojis for placeholder variety */
const placeholderEmojis = ['🐶', '🐱', '🐾', '🩺', '✂️', '💊'];
const placeholderCaptions = [
  '¡Mira nuestro último reel! 🐾',
  'El mejor cuidado para tu mascota ❤️',
  'Grooming de primera calidad ✂️',
  'Vacunación y salud preventiva 💉',
  'Conoce nuestras instalaciones 🏥',
  '¡Síguenos para más contenido! 🌿',
];

/* ── Render placeholder cards (shown before API or when no token) ── */
function renderPlaceholders() {
  grid.innerHTML = '';
  for (let i = 0; i < REELS_COUNT; i++) {
    const card = createReelCard({
      id: `placeholder-${i}`,
      media_url: null,
      permalink: IG_PROFILE,
      caption: placeholderCaptions[i],
      emoji: placeholderEmojis[i],
      index: i + 1,
    });
    grid.appendChild(card);
  }
}

/* ── Fetch real reels from Instagram Basic Display API ── */
async function loadReels() {
  if (!ACCESS_TOKEN) {
    renderPlaceholders();
    return;
  }

  // Show spinner
  grid.innerHTML = `
    <div class="reels-loading">
      <div class="spinner"></div>
      Cargando reels…
    </div>`;

  try {
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
    const url    = `https://graph.instagram.com/me/media?fields=${fields}&access_token=${ACCESS_TOKEN}`;
    const res    = await fetch(url);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();

    // Filter to reels only, take first 6
    const reels = (data.data || [])
      .filter(m => m.media_type === 'VIDEO' || m.media_type === 'REEL')
      .slice(0, REELS_COUNT);

    if (reels.length === 0) {
      renderPlaceholders();
      return;
    }

    grid.innerHTML = '';
    reels.forEach((reel, i) => {
      const card = createReelCard({
        id: reel.id,
        media_url: reel.thumbnail_url || reel.media_url,
        permalink: reel.permalink,
        caption: reel.caption || '',
        emoji: null,
        index: i + 1,
      });
      grid.appendChild(card);
    });

  } catch (err) {
    console.warn('Instagram API unavailable, showing placeholders.', err);
    renderPlaceholders();
  }
}

/* ── Build a reel card DOM element ── */
function createReelCard({ id, media_url, permalink, caption, emoji, index }) {
  const card = document.createElement('a');
  card.className = 'reel-card';
  card.href      = permalink;
  card.target    = '_blank';
  card.rel       = 'noopener noreferrer';
  card.setAttribute('aria-label', `Ver reel ${index} en Instagram`);

  const thumb = media_url
    ? `<img class="reel-thumb" src="${media_url}" alt="Reel ${index}" loading="lazy" />`
    : `<div class="reel-placeholder">
        <div class="paw-bg">${emoji || '🐾'}</div>
        <span class="reel-num">REEL #${index}</span>
       </div>`;

  const shortCaption = caption.length > 60 ? caption.slice(0, 60) + '…' : caption;

  card.innerHTML = `
    ${thumb}
    <div class="reel-overlay"></div>
    <div class="reel-play">
      <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
    </div>
    <span class="reel-badge">REEL</span>
    <div class="reel-footer">
      <div class="reel-user">@${IG_HANDLE}</div>
      ${shortCaption ? `<div class="reel-caption">${shortCaption}</div>` : ''}
    </div>
  `;

  return card;
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', loadReels);
