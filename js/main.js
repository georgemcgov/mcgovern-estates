// ============================================================
// PROPERTIES — now loaded live from Supabase.
// Use the Admin Panel at /admin/ to manage listings.
// The array below is kept as a fallback in case Supabase is unreachable.
// ============================================================

const SUPABASE_URL      = 'https://dbrmdeqokplohkjeslkl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicm1kZXFva3Bsb2hramVzbGtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4OTU1NTcsImV4cCI6MjA5MTQ3MTU1N30.sN_aUdU98VL7hYsT1BwHGMlJMvkKOd4qYvNbRgHcH-k';

let properties = [];

async function loadPropertiesFromSupabase() {
  try {
    const sb = window.supabase
      ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      : null;

    if (!sb) throw new Error('Supabase SDK not loaded');

    const { data, error } = await sb
      .from('properties')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Normalise: add `type` as alias for `status` so existing filter code works
    properties = (data || []).map(p => ({ ...p, type: p.status }));
  } catch (err) {
    console.warn('Supabase unavailable, using fallback listings:', err.message);
    properties = FALLBACK_PROPERTIES.map(p => ({ ...p, type: p.status }));
  }

  renderProperties();
  window.dispatchEvent(new Event('propertiesLoaded'));
}

// ============================================================
// FALLBACK — only used if Supabase cannot be reached
const FALLBACK_PROPERTIES = [
  {
    id: 1,
    name: "18 Oaklands",
    address: "Greystones, Co. Wicklow",
    price: "€585,000",
    type: "For Sale",
    status: "For Sale",
    category: "residential",
    beds: 3,
    baths: 2,
    parking: 1,
    size: "86 m²",
    link: "https://www.mcgovernestates.ie/residential/brochure/18-oaklands-greystones-wicklow/4982342",
    image: "https://photos-a.propertyimages.ie/media/2/4/3/4982342/1b52e8c5-0c9b-4dc3-9c44-07e6de8c8334_l.jpg"
  },
  {
    id: 2,
    name: "16 The Walk",
    address: "Ashford, Co. Wicklow",
    price: "€595,000",
    type: "For Sale",
    status: "For Sale",
    category: "residential",
    beds: 4,
    baths: 3,
    parking: 2,
    size: "142.5 m²",
    link: "https://www.mcgovernestates.ie/residential/brochure/16-the-walk-ashford-wicklow/4982253",
    image: "https://photos-a.propertyimages.ie/media/3/5/2/4982253/1c4c58c4-17e1-4bb3-a07a-4afd69887343_l.jpg"
  },
  {
    id: 3,
    name: "71 Priory Court",
    address: "Delgany, Co. Wicklow",
    price: "€395,000",
    type: "For Sale",
    status: "For Sale",
    category: "residential",
    beds: 2,
    baths: 1,
    parking: 1,
    size: "83.9 m²",
    link: "https://www.mcgovernestates.ie/residential/brochure/71-priory-court-delgany-wicklow/4838518",
    image: "https://photos-a.propertyimages.ie/media/8/1/5/4838518/5d6d566e-288b-43ca-8e73-49c2de7bb10a_l.jpg"
  },
  {
    id: 5,
    name: "Apt 4, Marina Village",
    address: "Greystones, Co. Wicklow",
    price: "€1,950 / month",
    type: "To Let",
    status: "To Let",
    category: "letting",
    beds: 2,
    baths: 1,
    parking: 1,
    size: "72 m²",
    link: "https://www.mcgovernestates.ie/residentiallettingservice",
    image: "https://photos-a.propertyimages.ie/media/2/4/3/4982342/1b52e8c5-0c9b-4dc3-9c44-07e6de8c8334_l.jpg"
  },
  {
    id: 4,
    name: "1 Delgany Glen",
    address: "Greystones, Co. Wicklow",
    price: "€675,000",
    type: "For Sale",
    status: "For Sale",
    category: "residential",
    beds: 3,
    baths: 2,
    parking: 2,
    size: "116.5 m²",
    link: "https://www.mcgovernestates.ie/residential/brochure/1-delgany-glen-greystones-wicklow/4981648",
    image: "https://photos-a.propertyimages.ie/media/8/4/6/4981648/ea098485-18ab-4d68-8872-51c9daa26b33_l.jpg"
  }
];
// ============================================================

loadPropertiesFromSupabase();

// Convert property names to URL-friendly filenames
function getPropertyUrl(name) {
  return `properties/${name.toLowerCase().replace(/\s+/g, '-').replace(/[,\.]/g, '')}.html`;
}

function renderProperties() {
  const grid = document.getElementById('properties-grid');
  if (!grid) return;
  grid.innerHTML = properties.map((p, i) => `
    <a class="property-card" href="${getPropertyUrl(p.name)}" style="text-decoration:none;">
      <div class="property-img-wrap">
        <img src="${p.image}" alt="${p.name}" class="property-img" loading="lazy" />
        <span class="property-badge">${p.status}</span>
      </div>
      <div class="property-body">
        ${i === 0 ? '<span class="featured-label">Featured Listing</span>' : ''}
        <div class="property-price">${p.price}</div>
        <div class="property-name">${p.name}</div>
        <div class="property-address">${p.address}</div>
        <div class="property-meta">
          <span class="meta-item">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M2 20v-3a7 7 0 017-7h6a7 7 0 017 7v3"/><path d="M2 17h20"/><rect x="7" y="4" width="4" height="5" rx="1"/><rect x="13" y="4" width="4" height="5" rx="1"/></svg>
            ${p.beds}
          </span>
          <span class="meta-divider">·</span>
          <span class="meta-item">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M4 12h16v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4z"/><path d="M4 12V6a2 2 0 012-2h2a2 2 0 012 2v6"/><path d="M4 10h6"/></svg>
            ${p.baths}
          </span>
          <span class="meta-divider">·</span>
          <span class="meta-item">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 3v18"/></svg>
            ${p.size}
          </span>
          <span class="meta-item" style="margin-left:auto; color: var(--moss); font-weight:500; font-size:0.72rem;">View →</span>
        </div>
      </div>
    </a>
  `).join('');
}

// HAMBURGER MENU
function toggleMenu() {
  const nav = document.getElementById('navLinks');
  const btn = document.getElementById('hamburger');
  nav.classList.toggle('open');
  btn.classList.toggle('open');
}
function closeMenu() {
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

// TESTIMONIALS SLIDER
let tCurrent = 0;
const tTotal = 4;

function tGetVisible() {
  return window.innerWidth <= 900 ? 1 : 3;
}

function tGo(n) {
  const track = document.getElementById('testimonialsTrack');
  const dots = document.querySelectorAll('.t-dot');
  const visible = tGetVisible();
  const maxSlide = tTotal - visible;
  tCurrent = Math.max(0, Math.min(n, maxSlide));
  const cardWidth = track.children[0].offsetWidth + 24;
  track.style.transform = `translateX(-${tCurrent * cardWidth}px)`;
  // Dot reflects which "page" we're on: 0 = first, maxSlide = last
  dots.forEach((d, i) => d.classList.toggle('active', i === (tCurrent === 0 ? 0 : 1)));
}

function tSlide(dir) {
  tGo(tCurrent + dir);
}

if (document.getElementById('testimonialsTrack')) {
  window.addEventListener('resize', () => tGo(tCurrent));
}

// CAROUSEL
let currentSlide = 0;
const totalSlides = 3;
let autoplayTimer;

function goToSlide(n) {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (n + totalSlides) % totalSlides;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function changeSlide(dir) {
  clearInterval(autoplayTimer);
  goToSlide(currentSlide + dir);
  startAutoplay();
}

function startAutoplay() {
  autoplayTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
}

if (document.querySelector('.carousel-slide')) {
  startAutoplay();
}