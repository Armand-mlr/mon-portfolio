/**
 * script.js — Armand Mulier Portfolio
 * Structure :
 *   1. Progress bar
 *   2. Header au scroll
 *   3. Scroll reveal (IntersectionObserver)
 *   4. Barres de compétences (IntersectionObserver)
 *   5. Galerie — ruban infini
 *   6. Navigation fluide
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════════════
     1. PROGRESS BAR
     ════════════════════════════════ */
  const progressBar = document.getElementById('progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const total    = document.body.scrollHeight - window.innerHeight;
      progressBar.style.width = (scrolled / total * 100) + '%';
    }, { passive: true });
  }


  /* ════════════════════════════════
     2. HEADER — opacité au scroll
     ════════════════════════════════ */
  const header = document.getElementById('site-header');
  if (header) {
    // Le backdrop-filter CSS se charge du flou.
    // On renforce simplement le background après le premier scroll.
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        header.style.background = 'rgba(248,247,245,.96)';
      } else {
        header.style.background = '';
      }
    }, { passive: true });
  }


  /* ════════════════════════════════
     3. SCROLL REVEAL
     ════════════════════════════════ */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // On n'observe qu'une seule fois — l'animation ne se rejoue pas
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ════════════════════════════════
     4. BARRES DE COMPÉTENCES
     Déclenchées quand la section
     entre dans le viewport
     ════════════════════════════════ */
  const skillBars = document.querySelectorAll('.skill-bar');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Petit délai pour que l'animation soit perceptible
        setTimeout(() => entry.target.classList.add('animated'), 150);
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  skillBars.forEach(bar => skillObserver.observe(bar));


  /* ════════════════════════════════
     5. GALERIE — ruban infini
     Les items sont injectés en JS
     et dupliqués pour la boucle
     ════════════════════════════════ */
  const galleryData = [
    { emoji: '🥩', cat: 'Cuisine · Salé',  caption: 'Côte de Boeuf', src : 'photos/coteBoeuf.jpg'},
    { emoji: '📸', cat: 'Photo · Décor',    caption: 'Cage d\'escalier étoilé', src : 'photos/escalier.jpg' },
    { emoji: '🍰', cat: 'Cuisine · Sucré',  caption: 'Fraisier', src : 'photos/fraisier.jpg'},
    { emoji: '🚗', cat: 'Photo · Décor',    caption: 'Porsche', src : 'photos/porsche.jpg'},
    { emoji: '🍝', cat: 'Cuisine · Salé',   caption: 'Carbonara', src : 'photos/carbonara.jpg'},
    { emoji: '🌊', cat: 'Photo · Décor',    caption: 'L\'Horizon', src : 'photos/mer.jpg'},
    { emoji: '🍩', cat: 'Cuisine · Sucré',  caption: 'Profiteroles', src : 'photos/profiteroles1.jpg'},
    { emoji: '🏙️', cat: 'Photo · Décor',    caption: 'Fête Foraine', src : 'photos/fete.jpg'},
    { emoji: '🎹', cat: 'Photo · portrait', caption: 'Piano', src : 'photos/portrait2.jpg'},
    { emoji: '🍔', cat: 'Cuisine · Salé',   caption: 'Burger Maison', src : 'photos/burger.jpg'},
    { emoji: '🌲', cat: 'Photo · Décor',   caption: 'Sapin de Noël', src : 'photos/sapin.jpg'},
    { emoji: '⛵', cat: 'Photo · Décor',    caption: 'Bateau sur l\'eau', src : 'photos/bateau.jpg'},
    { emoji: '⛽️', cat: 'Photo · Décor',    caption: 'Puit de pétrole', src : 'photos/petrole.jpg'},
    { emoji: '🥗', cat: 'Cuisine · Salé',    caption: 'Salade César', src : 'photos/saladeCesar.jpg'},
    { emoji: '🎬', cat: 'Photo · Décor',    caption: 'Cinema à l\'ancienne', src : 'photos/cinema.jpg'},
    { emoji: '🥘', cat: 'Cuisine · Salé',    caption: 'Le veau Marengo', src : 'photos/VeauMarengo.jpg'},
    { emoji: '🪨', cat: 'Photo · Décor',    caption: 'La crique', src : 'photos/crique.jpg'}

  ];

  const ribbon = document.getElementById('gallery-ribbon');
  if (ribbon) {
    // Création d'une carte galerie
    function makeCard(item) {
      const card = document.createElement('div');
      card.className = 'gallery-card';

      // Si une vraie photo est disponible, remplacer l'emoji par une <img>
      // ex: item.src = 'photos/CoteBoeuf.jpg'
      const thumbContent = item.src
        ? `<img src="${item.src}" alt="${item.caption}" loading="lazy">`
        : `<span style="font-size:2.5rem;user-select:none">${item.emoji}</span>`;

      card.innerHTML = `
        <div class="gallery-thumb">${thumbContent}</div>
        <div class="gallery-info">
          <div class="gallery-cat">${item.cat}</div>
          <div class="gallery-caption">${item.caption}</div>
        </div>`;
      return card;
    }

    // Injection × 2 pour la boucle CSS infinie
    [...galleryData, ...galleryData].forEach(item => {
      ribbon.appendChild(makeCard(item));
    });
  }


  /* ════════════════════════════════
     6. NAVIGATION FLUIDE
     Scroll doux vers les ancres
     ════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = header ? header.offsetHeight + 16 : 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

}); // fin DOMContentLoaded
