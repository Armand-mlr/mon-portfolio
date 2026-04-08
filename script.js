/**
 * script.js — Armand Mulier Portfolio
 * Structure :
 *   1. i18n — traduction FR / EN
 *   2. Progress bar
 *   3. Header au scroll
 *   4. Scroll reveal (IntersectionObserver)
 *   5. Barres de compétences (IntersectionObserver)
 *   6. Galerie — ruban infini
 *   7. Navigation fluide
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════════════
     1. i18n — TRADUCTION FR / EN
     ════════════════════════════════ */

  const translations = {
    fr: {
      /* Navigation */
      nav_about:           'Profil',
      nav_projects:        'Projets',
      nav_skills:          'Compétences',
      nav_contact:         'Contact',
      header_cta:          'Alternance Septembre 2026',

      /* Hero */
      hero_eyebrow:        'Apprenti Ingénieur ESIEE PARIS · Disponible en alternance',
      hero_desc:           'L2 Informatique & Applications, Université Gustave Eiffel.<br>Je construis des choses qui fonctionnent vraiment.',
      hero_btn_projects:   'Voir les projets',
      hero_btn_cv:         'Télécharger le CV',

      /* About */
      about_headline:      'Je finis ce que<br><em>je commence.</em>',
      about_lead:          'Bac général avec spécialités Mathématiques, NSI et Maths expertes. Aujourd\'hui en L2 Informatique & Applications, je travaille sur des sujets allant de la vérification d\'arbres binaires en C à la théorie des automates. Futur apprenti Ingénieur à l\'ESIEE PARIS et en recherche d\'alternance pour septembre 2026.',
      about_p2:            'Quand je commence quelque chose, j\'essaie d\'aller jusqu\'au bout — même si ça prend du temps. J\'aime comprendre comment les choses fonctionnent, pas seulement les utiliser.',
      about_p3:            'À côté du code : cuisine, piano, plaisir à prendre des photos, DJing. Des pratiques qui demandent chacune leur forme de patience et d\'attention — et qui, sans que j\'y pense forcément, influencent la façon dont j\'aborde un projet.',
      about_code_label:    'en bref',
      about_code:          'formation  : L2 Informatique & Applications, Gustave Eiffel\nobjectif   : Alternance — septembre 2026\napprend    : vite, seul, en profondeur\natout      : junior sans mauvaises habitudes',
      stat_years_unit:     'ans',
      stat_years_label:    'd\'études supérieures en informatique',
      stat_projects_label: 'projets terminés, de zéro à livraison',
      stat_location_label: 'disponible en présentiel et télétravail',

      /* Projects — titres de section */
      projects_title:      'Ce que<br><em>j\'ai construit.</em>',

      /* Colonnes récurrentes */
      col_did:             'Ce que j\'ai fait',
      col_limits:          'Limites honnêtes',
      col_would:           'Ce que j\'ajouterais',
      col_learned:         'Ce qui m\'a appris le plus',
      col_proud:           'Ce qui m\'a rendu fier',

      /* Projet 1 */
      p1_type:             'Structures de données · Analyse',
      p1_name:             'Comparaison de<br>Structures de Données',
      p1_desc:             'Étude comparative en C de plusieurs structures de données : tableaux statiques, tableaux dynamiques et listes chaînées. Implémentation complète de chaque structure, mesure expérimentale des performances, et analyse des compromis selon les cas d\'usage.',
      p1_did:              'Implémentation rigoureuse des trois structures. Protocole de benchmark reproductible. Comparaison des coûts d\'insertion, suppression et accès selon la taille des données.',
      p1_limits:           'Tests limités à des jeux de données synthétiques. Pas de benchmarks multi-threadés.',
      p1_would:            'Intégration d\'arbres et de tables de hachage pour un panorama plus complet. Visualisation des résultats via matplotlib.',
      tag_dynarray:        'Tableaux dynamiques',
      tag_linkedlist:      'Listes chaînées',
      tag_memory:          'Gestion mémoire',

      /* Projet 2 */
      p2_name:             'Portfolio Web',
      p2_desc:             'Portfolio web entièrement conçu et développé de zéro. Galerie dynamique avec filtres, dark mode, traduction FR/EN, animations CSS avancées et design responsive mobile-first.',
      p2_did:              'Architecture modulaire (6 fichiers). Filtres dynamiques avec rendu conditionnel. IntersectionObserver pour les animations. Persistance localStorage.',
      p2_limits:           'Pas de framework JS. Pas de backend. Pas de CI/CD automatisé.',
      p2_would:            'Migration React. Backend Node.js pour les données. Pipeline de déploiement.',

      /* Projet 3 */
      p3_type:             'Base de données',
      p3_name:             'Application Web<br>SPA — Refuges',
      p3_desc:             'Conception et développement complet d\'une application web pour la gestion des refuges de la SPA. Du schéma entité-association jusqu\'au site fonctionnel : modélisation, implémentation PostgreSQL, et interface Flask permettant aux employés de gérer les animaux, les soins et les transferts entre refuges.',
      p3_did:              'Modélisation relationnelle complète sous PostgreSQL. Interface employé sécurisée (login/mot de passe). Fonctionnalités CRUD : ajout de pensionnaires, saisie de soins, transferts. Suivi des vaccins avec génération de listes de rappel.',
      p3_learned:          'Garantir l\'intégrité des données au niveau de la base (contraintes, clés étrangères) et non seulement au niveau applicatif. Dissocier la logique métier des vues Flask.',
      p3_snippet_label:    'vaccins à rappeler — requête SQL',
      tag_db:              'Modélisation BDD',

      /* Projet 4 */
      p4_type:             'Analyse',
      p4_name:             'Arbres Binaires<br>de Recherche',
      p4_desc:             'Projet allant au-delà de l\'implémentation : vérification et génération d\'ABR, analyse de complexité formelle, benchmarking sur des milliers d\'arbres générés (presque complets, filiformes, quelconques), visualisations matplotlib et rapport complet avec preuves algorithmiques.',
      p4_did:              'Trois méthodes de vérification en C (naïve, définition optimisée, parcours infixe). Génération aléatoire d\'arbres selon leur morphologie. Scripts Python de benchmarking et figures matplotlib automatisées.',
      p4_proud:            'Passer de « ça marche » à « je prouve pourquoi ça marche en O(n) et pas O(n²) », et confronter les complexités théoriques aux mesures expérimentales.',
      p4_snippet_label:    'vérification ABR — O(n)',
      tag_induction:       'Induction structurelle',

      /* Compétences */
      skills_title:        'Ce que<br><em>je maîtrise.</em>',
      skills_languages:    'Langages',
      skills_theory:       'Théorie & Algorithmique',
      skills_tools:        'Outils & Pratiques',
      skills_lang_spoken:  'Langues',
      sk_ds:               'Structures de données',
      sk_complexity:       'Complexité algorithmique',
      sk_automata:         'Automates & Langages',
      sk_induction:        'Induction structurelle',
      sk_english:          'Anglais',
      sk_spanish:          'Espagnol',

      /* Galerie */
      gallery_label:       'Ailleurs',
      gallery_title:       'Au-delà<br><em>du code.</em>',
      gallery_desc:        'La cuisine apprend la précision. Prendre des photos apprend à cadrer. Le piano apprend la patience. Ces pratiques forment la même logique que le développement — et je les emmène au travail.',

      /* Contact */
      contact_title:       'Travaillons<br><em>ensemble.</em>',
      contact_desc:        'Je cherche une alternance à partir de septembre 2026. Quelqu\'un qui comprend vite, pose les bonnes questions, et ne lâche pas un problème avant de l\'avoir résolu.',
      contact_email_label: 'Email',
      contact_phone_label: 'Téléphone',
      contact_location_label: 'Localisation',
      contact_btn:         'Envoyer un message',

      /* Footer */
      footer_avail:        'Disponible en alternance — Île-de-France',
    },

    en: {
      /* Navigation */
      nav_about:           'Profile',
      nav_projects:        'Projects',
      nav_skills:          'Skills',
      nav_contact:         'Contact',
      header_cta:          'Work-Study · September 2026',

      /* Hero */
      hero_eyebrow:        'Engineering Apprentice ESIEE PARIS · Open to work-study',
      hero_desc:           'BSc Computer Science & Applications, Université Gustave Eiffel.<br>I build things that actually work.',
      hero_btn_projects:   'See my projects',
      hero_btn_cv:         'Download CV',

      /* About */
      about_headline:      'I finish what<br><em>I start.</em>',
      about_lead:          'High school diploma with majors in Mathematics, Computer Science and Advanced Maths. Currently in my second year of BSc Computer Science & Applications, working on topics ranging from binary tree verification in C to automata theory. Future engineering apprentice at ESIEE PARIS, seeking a work-study placement from September 2026.',
      about_p2:            'When I start something, I try to see it through — even when it takes time. I like understanding how things work, not just using them.',
      about_p3:            'Outside of code: cooking, piano, photography, DJing. Each of these takes its own form of patience and attention — and, without always thinking about it, they shape the way I approach a project.',
      about_code_label:    'in short',
      about_code:          'degree     : BSc Computer Science & Applications, Gustave Eiffel\ngoal       : Work-study — September 2026\nlearns     : fast, independently, in depth\nstrength   : junior with no bad habits',
      stat_years_unit:     'yrs',
      stat_years_label:    'of higher education in computer science',
      stat_projects_label: 'projects completed, from scratch to delivery',
      stat_location_label: 'available on-site and remote',

      /* Projects */
      projects_title:      'What I\'ve<br><em>built.</em>',

      /* Recurring column headers */
      col_did:             'What I did',
      col_limits:          'Honest limitations',
      col_would:           'What I\'d add',
      col_learned:         'What I learned most',
      col_proud:           'What made me proud',

      /* Project 1 */
      p1_type:             'Data structures · Analysis',
      p1_name:             'Data Structure<br>Comparison',
      p1_desc:             'Comparative study in C of several data structures: static arrays, dynamic arrays, and linked lists. Full implementation of each structure, experimental performance benchmarking, and analysis of trade-offs per use case.',
      p1_did:              'Rigorous implementation of all three structures. Reproducible benchmark protocol. Comparison of insertion, deletion and access costs across data sizes.',
      p1_limits:           'Tests limited to synthetic datasets. No multi-threaded benchmarks.',
      p1_would:            'Add trees and hash tables for a broader comparison. Visualise results with matplotlib.',
      tag_dynarray:        'Dynamic arrays',
      tag_linkedlist:      'Linked lists',
      tag_memory:          'Memory management',

      /* Project 2 */
      p2_name:             'Web Portfolio',
      p2_desc:             'Portfolio website fully designed and built from scratch. Dynamic gallery with filters, dark mode, FR/EN translation, advanced CSS animations, and mobile-first responsive design.',
      p2_did:              'Modular architecture (6 files). Dynamic filters with conditional rendering. IntersectionObserver for animations. localStorage persistence.',
      p2_limits:           'No JS framework. No backend. No automated CI/CD.',
      p2_would:            'Migrate to React. Add a Node.js backend. Set up a deployment pipeline.',

      /* Project 3 */
      p3_type:             'Database',
      p3_name:             'Web App<br>SPA — Animal Shelters',
      p3_desc:             'Full design and development of a web application for managing SPA animal shelters. From entity-relationship diagram to working site: data modelling, PostgreSQL implementation, and a Flask interface allowing staff to manage animals, medical care, and inter-shelter transfers.',
      p3_did:              'Full relational modelling in PostgreSQL. Secure staff interface (login/password). CRUD features: adding residents, logging care, managing transfers. Vaccine tracking with automated reminder lists.',
      p3_learned:          'Enforcing data integrity at the database level (constraints, foreign keys) rather than relying solely on application-side checks. Cleanly separating business logic from Flask views.',
      p3_snippet_label:    'upcoming vaccines — SQL query',
      tag_db:              'DB Modelling',

      /* Project 4 */
      p4_type:             'Analysis',
      p4_name:             'Binary Search<br>Trees',
      p4_desc:             'A project going beyond implementation: BST verification and generation, formal complexity analysis, benchmarking across thousands of generated trees (near-complete, degenerate, random), matplotlib visualisations, and a full report with algorithmic proofs.',
      p4_did:              'Three verification methods in C (naïve, optimised definition, in-order traversal). Random tree generation across morphologies. Python benchmarking scripts and automated matplotlib figures.',
      p4_proud:            'Going from "it works" to "I can prove why it works in O(n) and not O(n²)", and confirming the theoretical complexity against real experimental data.',
      p4_snippet_label:    'BST verification — O(n)',
      tag_induction:       'Structural induction',

      /* Skills */
      skills_title:        'What I<br><em>know.</em>',
      skills_languages:    'Languages',
      skills_theory:       'Theory & Algorithms',
      skills_tools:        'Tools & Practices',
      skills_lang_spoken:  'Spoken languages',
      sk_ds:               'Data structures',
      sk_complexity:       'Algorithmic complexity',
      sk_automata:         'Automata & Formal languages',
      sk_induction:        'Structural induction',
      sk_english:          'English',
      sk_spanish:          'Spanish',

      /* Gallery */
      gallery_label:       'Beyond code',
      gallery_title:       'Beyond<br><em>the code.</em>',
      gallery_desc:        'Cooking teaches precision. Photography teaches framing. Piano teaches patience. These practices follow the same logic as development — and I bring them to work.',

      /* Contact */
      contact_title:       'Let\'s work<br><em>together.</em>',
      contact_desc:        'Looking for a work-study placement from September 2026. Someone who picks things up fast, asks the right questions, and doesn\'t drop a problem until it\'s solved.',
      contact_email_label: 'Email',
      contact_phone_label: 'Phone',
      contact_location_label: 'Location',
      contact_btn:         'Send a message',

      /* Footer */
      footer_avail:        'Open to work-study — Île-de-France',
    }
  };

  let currentLang = 'fr';

  function applyTranslations(lang) {
    const t = translations[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) {
        el.innerHTML = t[key];
      }
    });
    document.documentElement.lang = lang;
    // Met à jour le label du bouton pour indiquer la langue cible
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = lang === 'fr' ? 'EN' : 'FR';
  }

  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      currentLang = currentLang === 'fr' ? 'en' : 'fr';
      applyTranslations(currentLang);
    });
  }

  // Langue initiale
  applyTranslations('fr');


  /* ════════════════════════════════
     2. PROGRESS BAR
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
     3. HEADER — opacité au scroll
     ════════════════════════════════ */
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        header.style.background = 'rgba(248,247,245,.96)';
      } else {
        header.style.background = '';
      }
    }, { passive: true });
  }


  /* ════════════════════════════════
     4. SCROLL REVEAL
     ════════════════════════════════ */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ════════════════════════════════
     5. BARRES DE COMPÉTENCES
     ════════════════════════════════ */
  const skillBars = document.querySelectorAll('.skill-bar');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('animated'), 150);
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  skillBars.forEach(bar => skillObserver.observe(bar));


  /* ════════════════════════════════
     6. GALERIE — ruban infini
     ════════════════════════════════ */
  const galleryData = [
    { emoji: '🥩', cat: 'Cuisine · Salé',    caption: 'Côte de Boeuf',           src: 'photos/coteBoeuf.jpg' },
    { emoji: '📸', cat: 'Photo · Décor',     caption: "Cage d'escalier étoilé",  src: 'photos/escalier.jpg' },
    { emoji: '🍰', cat: 'Cuisine · Sucré',   caption: 'Fraisier',                src: 'photos/fraisier.jpg' },
    { emoji: '🚗', cat: 'Photo · Décor',     caption: 'Porsche',                 src: 'photos/porsche.jpg' },
    { emoji: '🍝', cat: 'Cuisine · Salé',    caption: 'Carbonara',               src: 'photos/carbonara.jpg' },
    { emoji: '🌊', cat: 'Photo · Décor',     caption: "L'Horizon",               src: 'photos/mer.jpg' },
    { emoji: '🍩', cat: 'Cuisine · Sucré',   caption: 'Profiteroles',            src: 'photos/profiteroles1.jpg' },
    { emoji: '🏙️', cat: 'Photo · Décor',    caption: 'Fête Foraine',            src: 'photos/fete.jpg' },
    { emoji: '🎹', cat: 'Photo · Portrait',  caption: 'Piano',                   src: 'photos/portrait2.jpg' },
    { emoji: '🍔', cat: 'Cuisine · Salé',    caption: 'Burger Maison',           src: 'photos/burger.jpg' },
    { emoji: '🌲', cat: 'Photo · Décor',     caption: 'Sapin de Noël',           src: 'photos/sapin.jpg' },
    { emoji: '⛵', cat: 'Photo · Décor',     caption: "Bateau sur l'eau",        src: 'photos/bateau.jpg' },
    { emoji: '⛽️', cat: 'Photo · Décor',    caption: 'Puit de pétrole',         src: 'photos/petrole.jpg' },
    { emoji: '🥗', cat: 'Cuisine · Salé',    caption: 'Salade César',            src: 'photos/saladeCesar.jpg' },
    { emoji: '🎬', cat: 'Photo · Décor',     caption: "Cinema à l'ancienne",     src: 'photos/cinema.jpg' },
    { emoji: '🥘', cat: 'Cuisine · Salé',    caption: 'Le veau Marengo',         src: 'photos/VeauMarengo.jpg' },
    { emoji: '🪨', cat: 'Photo · Décor',     caption: 'La crique',               src: 'photos/crique.jpg' },
    /* ── Nouvelles photos ── */
    { emoji: '🏫', cat: 'Photo · Décor',     caption: 'ESIEE Paris',             src: 'photos/esiee.jpeg' },
    { emoji: '🕳️', cat: 'Photo · Décor',    caption: 'Grotte',                  src: 'photos/grotte.jpeg' },
    { emoji: '🍅', cat: 'Cuisine · Salé',    caption: 'Poulet tomate',           src: 'photos/tomatoeChicken.jpeg' },
    { emoji: '🌁', cat: 'Photo · Décor',     caption: 'Fog Tower',               src: 'photos/fogtower.jpeg' },
    { emoji: '🪞', cat: 'Photo · Décor',     caption: "Reflet sur l'eau",        src: 'photos/watermiror.jpeg' },
    { emoji: '🍗', cat: 'Cuisine · Salé',    caption: 'Poulet petits pois',      src: 'photos/chicken&peas.jpeg' },
    { emoji: '🍔', cat: 'Cuisine · Salé',    caption: 'Burger Maison v2',        src: 'photos/homemadeBurger.jpeg' },
  ];

  const ribbon = document.getElementById('gallery-ribbon');
  if (ribbon) {
    function makeCard(item) {
      const card = document.createElement('div');
      card.className = 'gallery-card';

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

    [...galleryData, ...galleryData].forEach(item => {
      ribbon.appendChild(makeCard(item));
    });
  }


  /* ════════════════════════════════
     7. NAVIGATION FLUIDE
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
