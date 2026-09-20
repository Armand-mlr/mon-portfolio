/**
 * script.js, Armand Mulier, portfolio / V2 « Nocturne »
 *
 * Un seul objet traverse le site : un disque, posé dans une couche fixe (#rig).
 * Dans l'intro il naît d'un point de lumière. Dans le hero il attend, tourne,
 * prend le reflet de la souris. Il sort par la droite, revient au bord pendant
 * les compétences, puis entre dans la séquence « Ailleurs » où le scroll devient
 * une télécommande : plateau, disque, bras, allumage, quatre morceaux, sortie,
 * et la lumière qui ouvre la section suivante.
 *
 * Architecture (héritée de la V1)
 *   0. Outils
 *   1. i18n (FR / EN)
 *   2. Composants statiques (odomètres, révélations)
 *   3. Moteur : une seule boucle rAF, mesures en cache, temps et vitesse de scroll
 *   4. Scènes : courbes, hero, objet (rig), projets, galerie, contact, en-tête
 *   5. Son (Web Audio, désactivé par défaut)
 *   6. Curseur et micro-interactions
 *   7. Intro
 *   8. Démarrage
 */
(() => {
  'use strict';

  /* ═══════════════ 0. OUTILS ═══════════════ */
  const d = document;
  const html = d.documentElement;
  const $  = (s, r = d) => r.querySelector(s);
  const $$ = (s, r = d) => Array.from(r.querySelectorAll(s));

  const reduced  = html.classList.contains('reduced') || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp  = (a, b, t) => a + (b - a) * t;
  const seg   = (p, a, b) => clamp((p - a) / (b - a));
  const E = {
    out3:  t => 1 - Math.pow(1 - t, 3),
    in3:   t => t * t * t,
    io3:   t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    outExpo: t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    // un léger dépassement puis retour : une pièce mécanique qui se cale
    back: (t, s = 1.2) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2),
    smooth: t => t * t * (3 - 2 * t),
  };
  const RAD = Math.PI / 180;

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };
  const docTop = el => el.getBoundingClientRect().top + window.scrollY;

  function mulberry32(a) {
    return () => {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // écrit une propriété seulement si elle change (évite les recalculs de style)
  const setT = (el, v) => { if (el._t !== v) { el.style.transform = v; el._t = v; } };
  const setO = (el, v) => { v = +v.toFixed(3); if (el._o !== v) { el.style.opacity = v; el._o = v; } };
  const setV = (el, k, v) => { const key = '_' + k; if (el[key] !== v) { el.style.setProperty(k, v); el[key] = v; } };

  /* ═══════════════ 1. i18n ═══════════════ */
  const translations = {
    fr: {
      skip_content:        'Aller au contenu',
      intro_skip:          'Passer',
      menu:                'Menu',
      menu_close:          'Fermer',
      sound:               'Son',

      nav_about:           'Profil',
      nav_projects:        'Projets',
      nav_skills:          'Compétences',
      nav_contact:         'Contact',
      header_cta:          'Alternance Septembre 2026',

      hero_eyebrow:        'Apprenti Ingénieur ESIEE PARIS / Disponible en alternance',
      hero_desc:           'L2 Informatique &amp; Applications, Université Gustave Eiffel.<br>Je construis des choses qui fonctionnent vraiment.',
      hero_btn_projects:   'Voir les projets',
      hero_btn_cv:         'Télécharger le CV',

      about_headline:      'Je finis ce que<br><em>je commence.</em>',
      about_lead:          'Bac général avec spécialités Mathématiques, NSI et Maths expertes. Aujourd\'hui en L2 Informatique &amp; Applications, je travaille sur des sujets allant de la vérification d\'arbres binaires en C à la théorie des automates. Futur apprenti Ingénieur à l\'ESIEE PARIS et en recherche d\'alternance pour septembre 2026.',
      about_p2:            'Quand je commence quelque chose, j\'essaie d\'aller jusqu\'au bout, même si ça prend du temps. J\'aime comprendre comment les choses fonctionnent, pas seulement les utiliser.',
      about_p3:            'À côté du code : cuisine, piano, plaisir à prendre des photos, DJing. Des pratiques qui demandent chacune leur forme de patience et d\'attention, et qui, sans que j\'y pense forcément, influencent la façon dont j\'aborde un projet.',
      about_code_label:    'en bref',
      about_code:          'formation  : L2 Informatique &amp; Applications, Gustave Eiffel\nobjectif   : Alternance, septembre 2026\napprend    : vite, seul, en profondeur\natout      : junior sans mauvaises habitudes',
      stat_years_unit:     'ans',
      stat_years_label:    'd\'études supérieures en informatique',
      stat_projects_label: 'projets terminés, de zéro à livraison',
      stat_location_label: 'disponible en présentiel et télétravail',

      projects_title:      'Ce que<br><em>j\'ai construit.</em>',
      col_did:             'Ce que j\'ai fait',
      col_limits:          'Limites honnêtes',
      col_would:           'Ce que j\'ajouterais',
      col_learned:         'Ce qui m\'a appris le plus',
      col_proud:           'Ce qui m\'a rendu fier',

      p1_type:             'Structures de données / Analyse',
      p1_name:             'Comparaison de<br>Structures de Données',
      p1_desc:             'Étude comparative en C de plusieurs structures de données : tableaux statiques, tableaux dynamiques et listes chaînées. Implémentation complète de chaque structure, mesure expérimentale des performances, et analyse des compromis selon les cas d\'usage.',
      p1_did:              'Implémentation rigoureuse des trois structures. Protocole de benchmark reproductible. Comparaison des coûts d\'insertion, suppression et accès selon la taille des données.',
      p1_limits:           'Tests limités à des jeux de données synthétiques. Pas de benchmarks multi-threadés.',
      p1_would:            'Intégration d\'arbres et de tables de hachage pour un panorama plus complet. Visualisation des résultats via matplotlib.',
      tag_dynarray:        'Tableaux dynamiques',
      tag_linkedlist:      'Listes chaînées',
      tag_memory:          'Gestion mémoire',

      p2_name:             'Portfolio Web',
      p2_desc:             'Portfolio web entièrement conçu et développé de zéro. Galerie dynamique avec filtres, dark mode, traduction FR/EN, animations CSS avancées et design responsive mobile-first.',
      p2_did:              'Architecture modulaire (6 fichiers). Filtres dynamiques avec rendu conditionnel. IntersectionObserver pour les animations. Persistance localStorage.',
      p2_limits:           'Pas de framework JS. Pas de backend. Pas de CI/CD automatisé.',
      p2_would:            'Migration React. Backend Node.js pour les données. Pipeline de déploiement.',

      p3_type:             'Base de données',
      p3_name:             'Application Web<br>SPA / Refuges',
      p3_desc:             'Conception et développement complet d\'une application web pour la gestion des refuges de la SPA. Du schéma entité-association jusqu\'au site fonctionnel : modélisation, implémentation PostgreSQL, et interface Flask permettant aux employés de gérer les animaux, les soins et les transferts entre refuges.',
      p3_did:              'Modélisation relationnelle complète sous PostgreSQL. Interface employé sécurisée (login/mot de passe). Fonctionnalités CRUD : ajout de pensionnaires, saisie de soins, transferts. Suivi des vaccins avec génération de listes de rappel.',
      p3_learned:          'Garantir l\'intégrité des données au niveau de la base (contraintes, clés étrangères) et non seulement au niveau applicatif. Dissocier la logique métier des vues Flask.',
      p3_snippet_label:    'vaccins à rappeler / requête SQL',
      tag_db:              'Modélisation BDD',

      p4_type:             'Analyse',
      p4_name:             'Arbres Binaires<br>de Recherche',
      p4_desc:             'Projet allant au-delà de l\'implémentation : vérification et génération d\'ABR, analyse de complexité formelle, benchmarking sur des milliers d\'arbres générés (presque complets, filiformes, quelconques), visualisations matplotlib et rapport complet avec preuves algorithmiques.',
      p4_did:              'Trois méthodes de vérification en C (naïve, définition optimisée, parcours infixe). Génération aléatoire d\'arbres selon leur morphologie. Scripts Python de benchmarking et figures matplotlib automatisées.',
      p4_proud:            'Passer de « ça marche » à « je prouve pourquoi ça marche en O(n) et pas O(n²) », et confronter les complexités théoriques aux mesures expérimentales.',
      p4_snippet_label:    'vérification ABR / O(n)',
      tag_induction:       'Induction structurelle',

      p5_type:             'Data Visualization',
      p5_name:             'Dashboard<br>Crypto-Explorer',
      p5_desc:             'Application front-end de visualisation de données financières en temps réel. Consommation de l\'API REST publique CoinGecko pour le suivi de dizaines d\'actifs, gestion des états asynchrones et affichage de graphiques interactifs (historiques de prix et volumes).',
      p5_did:              'Développement de l\'interface dynamique (SPA) mobile-first avec Tailwind CSS. Gestion de l\'état et de l\'asynchronisme via les Hooks React. Intégration de la librairie Chart.js pour le rendu visuel des données.',
      p5_learned:          'Comprendre le cycle de vie des composants pour éviter les re-rendus inutiles et gérer proprement les appels asynchrones face aux limites de requêtes (Rate Limits) d\'une API.',
      p5_snippet_label:    'actualisation asynchrone / react hook',
      tag_api:             'API REST',

      skills_title:        'Ce que<br><em>je maîtrise.</em>',
      skills_languages:    'Langages',
      skills_theory:       'Théorie &amp; Algorithmique',
      skills_tools:        'Outils &amp; Pratiques',
      skills_lang_spoken:  'Langues',
      sk_ds:               'Structures de données',
      sk_complexity:       'Complexité algorithmique',
      sk_automata:         'Automates &amp; Langages',
      sk_induction:        'Induction structurelle',
      sk_english:          'Anglais',
      sk_spanish:          'Espagnol',

      gallery_label:       'Ailleurs',
      gallery_title:       'Au-delà<br><em>du code.</em>',
      gallery_desc:        'La cuisine apprend la précision. Prendre des photos apprend à cadrer. Le piano apprend la patience. Ces pratiques forment la même logique que le développement, et je les emmène au travail.',
      row_cuisine:         'Cuisine',
      row_piano:           'Piano',
      row_photo:           'Photo',
      row_dj:              'DJing',
      sig_cuisine:         'La cuisine apprend la précision.',
      sig_piano:           'Le piano apprend la patience.',
      sig_photo:           'Prendre des photos apprend à cadrer.',
      sig_outro:           'Ces pratiques forment la même logique que le développement, et je les emmène au travail.',
      sig_hint:            'Continuez à faire défiler',
      gal_cuisine:         'Cuisine',
      gal_photo:           'Photo',
      intro_words:         'code|cuisine|piano|photo|DJing',

      contact_title:       'Travaillons<br><em>ensemble.</em>',
      contact_desc:        'Je cherche une alternance à partir de septembre 2026. Quelqu\'un qui comprend vite, pose les bonnes questions, et ne lâche pas un problème avant de l\'avoir résolu.',
      contact_email_label: 'Email',
      contact_phone_label: 'Téléphone',
      contact_location_label: 'Localisation',
      contact_btn:         'Envoyer un message',

      footer_avail:        'Disponible en alternance, Île-de-France',
    },

    en: {
      skip_content:        'Skip to content',
      intro_skip:          'Skip',
      menu:                'Menu',
      menu_close:          'Close',
      sound:               'Sound',

      nav_about:           'Profile',
      nav_projects:        'Projects',
      nav_skills:          'Skills',
      nav_contact:         'Contact',
      header_cta:          'Work-Study, September 2026',

      hero_eyebrow:        'Engineering Apprentice ESIEE PARIS / Open to work-study',
      hero_desc:           'BSc Computer Science &amp; Applications, Université Gustave Eiffel.<br>I build things that actually work.',
      hero_btn_projects:   'See my projects',
      hero_btn_cv:         'Download CV',

      about_headline:      'I finish what<br><em>I start.</em>',
      about_lead:          'High school diploma with majors in Mathematics, Computer Science and Advanced Maths. Currently in my second year of BSc Computer Science &amp; Applications, working on topics ranging from binary tree verification in C to automata theory. Future engineering apprentice at ESIEE PARIS, seeking a work-study placement from September 2026.',
      about_p2:            'When I start something, I try to see it through, even when it takes time. I like understanding how things work, not just using them.',
      about_p3:            'Outside of code: cooking, piano, photography, DJing. Each of these takes its own form of patience and attention, and, without always thinking about it, they shape the way I approach a project.',
      about_code_label:    'in short',
      about_code:          'degree     : BSc Computer Science &amp; Applications, Gustave Eiffel\ngoal       : Work-study, September 2026\nlearns     : fast, independently, in depth\nstrength   : junior with no bad habits',
      stat_years_unit:     'yrs',
      stat_years_label:    'of higher education in computer science',
      stat_projects_label: 'projects completed, from scratch to delivery',
      stat_location_label: 'available on-site and remote',

      projects_title:      'What I\'ve<br><em>built.</em>',
      col_did:             'What I did',
      col_limits:          'Honest limitations',
      col_would:           'What I\'d add',
      col_learned:         'What I learned most',
      col_proud:           'What made me proud',

      p1_type:             'Data structures / Analysis',
      p1_name:             'Data Structure<br>Comparison',
      p1_desc:             'Comparative study in C of several data structures: static arrays, dynamic arrays, and linked lists. Full implementation of each structure, experimental performance benchmarking, and analysis of trade-offs per use case.',
      p1_did:              'Rigorous implementation of all three structures. Reproducible benchmark protocol. Comparison of insertion, deletion and access costs across data sizes.',
      p1_limits:           'Tests limited to synthetic datasets. No multi-threaded benchmarks.',
      p1_would:            'Add trees and hash tables for a broader comparison. Visualise results with matplotlib.',
      tag_dynarray:        'Dynamic arrays',
      tag_linkedlist:      'Linked lists',
      tag_memory:          'Memory management',

      p2_name:             'Web Portfolio',
      p2_desc:             'Portfolio website fully designed and built from scratch. Dynamic gallery with filters, dark mode, FR/EN translation, advanced CSS animations, and mobile-first responsive design.',
      p2_did:              'Modular architecture (6 files). Dynamic filters with conditional rendering. IntersectionObserver for animations. localStorage persistence.',
      p2_limits:           'No JS framework. No backend. No automated CI/CD.',
      p2_would:            'Migrate to React. Add a Node.js backend. Set up a deployment pipeline.',

      p3_type:             'Database',
      p3_name:             'Web App<br>SPA / Animal Shelters',
      p3_desc:             'Full design and development of a web application for managing SPA animal shelters. From entity-relationship diagram to working site: data modelling, PostgreSQL implementation, and a Flask interface allowing staff to manage animals, medical care, and inter-shelter transfers.',
      p3_did:              'Full relational modelling in PostgreSQL. Secure staff interface (login/password). CRUD features: adding residents, logging care, managing transfers. Vaccine tracking with automated reminder lists.',
      p3_learned:          'Enforcing data integrity at the database level (constraints, foreign keys) rather than relying solely on application-side checks. Cleanly separating business logic from Flask views.',
      p3_snippet_label:    'upcoming vaccines / SQL query',
      tag_db:              'DB Modelling',

      p4_type:             'Analysis',
      p4_name:             'Binary Search<br>Trees',
      p4_desc:             'A project going beyond implementation: BST verification and generation, formal complexity analysis, benchmarking across thousands of generated trees (near-complete, degenerate, random), matplotlib visualisations, and a full report with algorithmic proofs.',
      p4_did:              'Three verification methods in C (naïve, optimised definition, in-order traversal). Random tree generation across morphologies. Python benchmarking scripts and automated matplotlib figures.',
      p4_proud:            'Going from "it works" to "I can prove why it works in O(n) and not O(n²)", and confirming the theoretical complexity against real experimental data.',
      p4_snippet_label:    'BST verification / O(n)',
      tag_induction:       'Structural induction',

      p5_type:             'Data Visualization',
      p5_name:             'Crypto-Explorer<br>Dashboard',
      p5_desc:             'Front-end application for visualising real-time financial data. Consumes the public CoinGecko REST API to track dozens of assets, handles asynchronous state, and renders interactive charts (price and volume history).',
      p5_did:              'Built the dynamic mobile-first interface (SPA) with Tailwind CSS. State and async management with React Hooks. Integrated the Chart.js library to render the data.',
      p5_learned:          'Understanding the component lifecycle to avoid unnecessary re-renders, and handling async calls cleanly within an API\'s rate limits.',
      p5_snippet_label:    'async refresh / react hook',
      tag_api:             'REST API',

      skills_title:        'What I<br><em>know.</em>',
      skills_languages:    'Languages',
      skills_theory:       'Theory &amp; Algorithms',
      skills_tools:        'Tools &amp; Practices',
      skills_lang_spoken:  'Spoken languages',
      sk_ds:               'Data structures',
      sk_complexity:       'Algorithmic complexity',
      sk_automata:         'Automata &amp; Formal languages',
      sk_induction:        'Structural induction',
      sk_english:          'English',
      sk_spanish:          'Spanish',

      gallery_label:       'Beyond code',
      gallery_title:       'Beyond<br><em>the code.</em>',
      gallery_desc:        'Cooking teaches precision. Photography teaches framing. Piano teaches patience. These practices follow the same logic as development, and I bring them to work.',
      row_cuisine:         'Cooking',
      row_piano:           'Piano',
      row_photo:           'Photography',
      row_dj:              'DJing',
      sig_cuisine:         'Cooking teaches precision.',
      sig_piano:           'Piano teaches patience.',
      sig_photo:           'Photography teaches framing.',
      sig_outro:           'These practices follow the same logic as development, and I bring them to work.',
      sig_hint:            'Keep scrolling',
      gal_cuisine:         'Cooking',
      gal_photo:           'Photography',
      intro_words:         'code|cooking|piano|photo|DJing',

      contact_title:       'Let\'s work<br><em>together.</em>',
      contact_desc:        'Looking for a work-study placement from September 2026. Someone who picks things up fast, asks the right questions, and doesn\'t drop a problem until it\'s solved.',
      contact_email_label: 'Email',
      contact_phone_label: 'Phone',
      contact_location_label: 'Location',
      contact_btn:         'Send a message',

      footer_avail:        'Open to work-study, Île-de-France',
    },
  };


  let lang = store.get('am-lang') === 'en' ? 'en' : 'fr';
  const langListeners = [];
  const t = key => translations[lang][key] ?? translations.fr[key] ?? '';

  function applyLang(next) {
    lang = next;
    const dict = translations[lang];
    $$('[data-i18n]').forEach(el => {
      const v = dict[el.dataset.i18n];
      if (v !== undefined) el.innerHTML = v;
    });
    html.lang = lang;
    $$('#lang-toggle .sw-opt').forEach(o => o.classList.toggle('is-on', o.dataset.l === lang));
    store.set('am-lang', lang);
    langListeners.forEach(fn => fn(lang));
  }


  /* ═══════════════ 2. COMPOSANTS STATIQUES ═══════════════ */
  function buildOdometers() {
    const odos = $$('.odo');
    odos.forEach(o => {
      const to = +o.dataset.to;
      o.setAttribute('aria-label', o.textContent);
      o.textContent = '';
      const strip = d.createElement('span');
      strip.className = 'odo-strip';
      strip.setAttribute('aria-hidden', 'true');
      for (let i = 0; i <= 9; i++) {
        const s = d.createElement('span'); s.textContent = i; strip.appendChild(s);
      }
      o.appendChild(strip);
      o._to = to;
      if (reduced) strip.style.setProperty('--d', to);
    });
    return odos;
  }

  // Révélations. Les positions sont lues en cache dans la boucle de scroll :
  // un IntersectionObserver ne voit pas un élément entièrement masqué par clip-path.
  function RevealScene(odos) {
    let pending = $$('.rv, .rv-t').map(el => ({ el, top: 0 }));
    let odoItems = odos.map(el => ({ el, top: 0 }));
    if (reduced) {
      pending.forEach(p => p.el.classList.add('in'));
      pending = []; odoItems = [];
    }
    return {
      measure() {
        pending.forEach(p => (p.top = docTop(p.el)));
        odoItems.forEach(o => (o.top = docTop(o.el)));
      },
      update(y) {
        if (!pending.length && !odoItems.length) return;
        if (html.classList.contains('intro-pending')) return;
        const line = y + Engine.vh * .86;
        pending = pending.filter(p => {
          if (p.top < line) { p.el.classList.add('in'); return false; }
          return true;
        });
        odoItems = odoItems.filter(o => {
          if (o.top < y + Engine.vh * .75) {
            const strip = o.el.firstElementChild;
            setTimeout(() => strip.style.setProperty('--d', o.el._to), 380);
            return false;
          }
          return true;
        });
      },
    };
  }


  /* ═══════════════ 3. MOTEUR ═══════════════ */
  const Engine = {
    scenes: [],
    y: 0, lastY: 0, vel: 0,
    vw: innerWidth, vh: innerHeight,
    time: 0, dt: 0, last: 0,
    add(scene) { this.scenes.push(scene); return scene; },
    measure() {
      this.vw = innerWidth; this.vh = innerHeight;
      this.scenes.forEach(s => s.measure && s.measure());
      this.render(true);
    },
    render(force = false) {
      const y = window.scrollY;
      this.vel = lerp(this.vel, y - this.lastY, 0.2);
      this.lastY = y;
      this.y = y;
      for (const s of this.scenes) {
        if (!force && s.range) {
          const [a, b] = s.range;
          if (y < a - this.vh * 0.2 || y > b + this.vh * 0.2) {
            if (!s._parked) { s.update && s.update(y, true); s._parked = true; }
            continue;
          }
        }
        s._parked = false;
        s.update && s.update(y, false);
      }
      frameTasks.forEach(fn => fn());
    },
    loop() {
      const tick = now => {
        this.dt = this.last ? Math.min(.05, (now - this.last) / 1000) : 0;
        this.last = now;
        this.time = now / 1000;
        this.render();
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },
  };
  const frameTasks = [];

  let measureQueued = false;
  function queueMeasure() {
    if (measureQueued) return;
    measureQueued = true;
    requestAnimationFrame(() => { measureQueued = false; Engine.measure(); });
  }

  // Position de la souris, partagée (reflets, lueurs)
  const Pointer = { x: -1, y: -1, active: false };
  if (hasHover) {
    d.addEventListener('pointermove', e => { Pointer.x = e.clientX; Pointer.y = e.clientY; Pointer.active = true; }, { passive: true });
  }


  /* ═══════════════ 4. SCÈNES ═══════════════ */

  /* 4.1 Horizons : le haut d'une section se bombe en entrant puis s'aplatit */
  function CurveScene(curve) {
    const sec = curve.parentElement;
    const inner = curve.firstElementChild;
    let top = 0;
    const s = {
      range: [0, 0],
      measure() { top = docTop(sec); s.range = [top - Engine.vh, top + Engine.vh * .2]; },
      update(y) {
        const rel = (top - y) / Engine.vh;              // 1 = en bas de l'écran, 0 = en haut
        // 0 quand la section attend en bas, maximum à mi-course, 0 une fois arrivée
        const b = reduced ? 0 : Math.pow(Math.sin(Math.PI * clamp(1 - rel)), 1.4) * .85;
        setV(inner, '--b', b.toFixed(3));
      },
    };
    return s;
  }

  /* 4.2 Hero : les lettres répondent au curseur et se dispersent à la sortie */
  function HeroScene() {
    const hero = $('#top');
    const letters = $$('.hero-title .ch');
    const rnd = mulberry32(12);
    const noise = letters.map(() => ({ a: rnd() * 2 - 1, b: rnd() * 2 - 1 }));
    const lift = letters.map(() => 0);
    const liftT = letters.map(() => 0);
    let centers = [], heroH = 1, heroW = 1, fontPx = 100;

    if (hasHover && !reduced) {
      hero.addEventListener('pointermove', e => {
        const x = e.clientX - hero.getBoundingClientRect().left;
        letters.forEach((l, i) => {
          const dx = (x - centers[i]) / (fontPx * .7);
          liftT[i] = Math.exp(-dx * dx);
        });
      });
      hero.addEventListener('pointerleave', () => liftT.fill(0));
    }

    const s = {
      range: [0, 0],
      measure() {
        heroH = hero.offsetHeight; heroW = hero.offsetWidth;
        fontPx = parseFloat(getComputedStyle($('.hero-title')).fontSize);
        centers = letters.map(l => l.offsetLeft + l.offsetWidth / 2);
        s.range = [0, heroH];
      },
      update(y, parked) {
        if (reduced) return;
        const p = parked ? 1 : clamp(y / heroH);
        const cx = heroW / 2;
        letters.forEach((l, i) => {
          lift[i] = lerp(lift[i], liftT[i], .12);
          const n = noise[i];
          const e = E.in3(p) * .6 + p * .4;
          const dx = (centers[i] - cx) * e * .22 + n.a * e * fontPx * .2;
          const dy = -e * heroH * (.08 + (n.b + 1) * .08) - lift[i] * fontPx * .07;
          const rot = n.a * e * 12;
          const sc = 1 + lift[i] * .04;
          setT(l, `translate3d(${dx.toFixed(1)}px,${dy.toFixed(1)}px,0) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(4)})`);
        });
      },
    };
    return s;
  }

  /* 4.3 L'OBJET : disque, plateau, bras, lumière. Une seule couche fixe.
     Tout est fonction de la position de scroll : on peut s'arrêter partout,
     remonter, repartir. Seule la rotation du disque vit dans le temps,
     et sa vitesse dépend elle aussi de la position (allumé / éteint / freiné). */
  function RigScene() {
    const rig = $('#rig');
    const disc = $('#disc');
    const spin = $('.disc-spin', disc);
    const sheen = $('.disc-sheen', disc);
    const shadow = $('.disc-shadow', disc);
    const core = $('.label-core', disc);
    const imgs = $$('.label-img', disc);
    const blades = $$('.disc-iris i', disc);
    const platter = $('.platter', rig);
    const pMetal = $('.platter-metal', rig);
    const pSheen = $('.platter-sheen', rig);
    const pDraw = $('.platter-draw', rig);
    const orbit = $('.orbit', rig);
    const orbitPath = $('.orbit-text', rig);
    const arm = $('.arm', rig);
    const glow = $('.rig-glow', rig);
    const wash = $('.rig-wash', rig);
    const point = $('.rig-point', rig);
    const wipe = $('.rig-wipe', rig);

    const hero = $('#top');
    const sec = $('#interests');
    const stage = $('.sig-stage', sec);
    const drumNames = $$('.drum-n', sec);
    const drumLines = $$('.drum-l', sec);
    const drumI = $('.drum-i', sec);
    const drum = $('.drum', sec);
    const sigText = $('.sig-text', sec);
    const sigH = $('.sig-text h2', sec);
    const sigOutro = $('.sig-outro', sec);
    const hint = $('.sig-hint', sec);

    imgs.forEach(im => im.addEventListener('error', () => im.classList.add('is-missing')));

    // Le texte qui tourne autour du plateau : les quatre pratiques, en boucle
    let tspans = [];
    function buildOrbit() {
      const words = ['row_cuisine', 'row_piano', 'row_photo', 'row_dj'].map(t);
      orbitPath.innerHTML = '';
      tspans = [];
      for (let rep = 0; rep < 3; rep++) {
        words.forEach((w, i) => {
          const ts = d.createElementNS('http://www.w3.org/2000/svg', 'tspan');
          ts.textContent = w + '\u2003/\u2003';
          ts.dataset.i = i;
          orbitPath.appendChild(ts);
          tspans.push(ts);
        });
      }
    }
    buildOrbit();
    langListeners.push(buildOrbit);

    // Géométrie (recalculée à chaque mesure)
    const G = {};
    // Chronologie de la séquence (fraction du scroll de la section)
    const B = [.45, .55, .65, .75];      // changements de morceau
    const END_CH = .85;

    // état continu
    let angle = 0, sheenA = -40, lastP = -1, lastCh = -2, lastPow = 0, lastLabel = -2;
    let heroH = 1, top = 0, len = 1;

    function measure() {
      const vw = Engine.vw, vh = Engine.vh;
      const mob = vw < 860;
      G.mob = mob;
      if (mob) { G.cx = vw / 2; G.cy = vh * .37; G.R = Math.min(vw * .76, vh * .43); }
      else     { G.cx = vw * .64; G.cy = vh * .52; G.R = Math.min(vh * .62, vw * .40); }
      G.P = G.R * 1.16;
      if (mob) { G.hx = vw * .86; G.hy = vh * .33; G.HD = Math.min(vw * 1.08, vh * .6); }
      else     { G.hx = vw * .75; G.hy = vh * .46; G.HD = Math.min(vh * .82, vw * .52); }
      G.B = Math.ceil(Math.max(G.R, G.HD));
      disc.style.width = disc.style.height = G.B + 'px';

      platter.style.width = platter.style.height = G.P + 'px';
      G.G = G.P * 2;
      glow.style.width = glow.style.height = G.G + 'px';
      setV(wash, '--wx', G.cx + 'px'); setV(wash, '--wy', G.cy + 'px');
      G.W = 2 * Math.hypot(Math.max(G.cx, vw - G.cx), Math.max(G.cy, vh - G.cy)) + 40;
      wipe.style.width = wipe.style.height = G.W + 'px';

      // bras : pivot en haut à droite du plateau, longueur ≈ distance au centre
      G.ax = G.cx + G.P * (mob ? .44 : .56);
      G.ay = G.cy - G.P * (mob ? .56 : .44);
      G.D = Math.hypot(G.ax - G.cx, G.ay - G.cy);
      G.L = G.D * .98;
      G.phi = Math.atan2(G.cy - G.ay, G.cx - G.ax);   // direction pivot → centre
      setV(arm, '--len', (G.L - 16).toFixed(0) + 'px');
      G.tracks = [.455, .405, .35, .295].map(k => k * G.R);
      G.park = armAngle(G.R * .8);

      // la sortie du hero et le retour au bord
      G.peekX = vw + G.R * .5 - G.R * (mob ? .16 : .2);
      G.peekY = mob ? G.cy : vh * .56;

      heroH = hero.offsetHeight;
      top = docTop(sec);
      len = Math.max(1, sec.offsetHeight - vh);
      s.range = [-1e9, 1e9];
      s.sigTop = top; s.sigLen = len;
      lastP = -1;
    }

    // angle du bras pour que la pointe tombe à la distance r du centre du disque
    function armAngle(r) {
      const c = clamp((G.D * G.D + G.L * G.L - r * r) / (2 * G.D * G.L), -1, 1);
      return G.phi + Math.acos(c);
    }

    function discTf(x, y, size) {
      const sc = size / G.B;
      return `translate3d(${(x - G.B / 2).toFixed(1)}px,${(y - G.B / 2).toFixed(1)}px,0) scale(${sc.toFixed(4)})`;
    }
    s_heroTf = () => discTf(G.hx, G.hy, G.HD);
    s_geo = G;

    function setIris(o) {
      const v = o.toFixed(3);
      if (disc._iris === v) return;
      disc._iris = v;
      const c = 50 + o * 80.6;
      const swirl = (1 - clamp(o)) * 32;
      blades.forEach((b, k) => {
        b.style.transform = `rotate(${(k * 51.43 + swirl).toFixed(2)}deg) translateX(${c.toFixed(2)}%)`;
      });
    }

    // quelle image porte l'étiquette : -1 = la lumière, 0..2 = une photo
    function setLabel(idx) {
      if (idx === lastLabel) return;
      lastLabel = idx;
      imgs.forEach((im, i) => { im.style.opacity = i === idx ? 1 : 0; });
    }

    function hideSigParts() {
      setO(platter, 0); setO(arm, 0); setO(glow, 0); setO(wash, 0); setO(point, 0); setO(wipe, 0);
    }

    function spinDisc(speed, extra) {
      angle += speed * Engine.dt + Engine.vel * .12;
      setT(spin, `rotate(${(angle + extra).toFixed(2)}deg)`);
    }

    function lightToward(x, y) {
      // le reflet en « nœud papillon » s'aligne sur la source de lumière
      let target = sheenA;
      if (Pointer.active && x !== null) target = Math.atan2(Pointer.y - y, Pointer.x - x) / RAD + 90;
      let dA = ((target - sheenA + 540) % 360) - 180;
      sheenA += dA * .08;
      setT(sheen, `rotate(${sheenA.toFixed(2)}deg)`);
    }

    /* ── Hors séquence : hero, sortie, attente au bord ── */
    function renderOutside(y) {
      hideSigParts();
      stage.style.background = '';
      if (y < heroH * 1.05) {
        const e = clamp(y / (heroH * .85));
        const ee = E.io3(e);
        const x = G.hx + (Engine.vw - G.hx + G.HD * .6) * ee;
        const yy = G.hy - Engine.vh * .12 * ee;
        setT(disc, discTf(x, yy, G.HD * (1 - .12 * ee)));
        setO(disc, 1);
        setIris(1 - E.io3(clamp(e * 1.6)) * 1.08);
        setV(core, '--core', 1);
        setLabel(-1);
        spinDisc(9, 0);
        setV(shadow, '--sy', (G.B * .05).toFixed(0) + 'px');
        lightToward(G.hx, G.hy);
      } else if (y > top - Engine.vh * .95) {
        // il revient au bord, comme s'il attendait son tour
        const tt = E.out3(seg(y, top - Engine.vh * .95, top));
        const x = Engine.vw + G.R * .6 - (Engine.vw + G.R * .6 - G.peekX) * tt;
        setT(disc, discTf(x, G.peekY, G.R));
        setO(disc, 1);
        setIris(-.08);
        setLabel(-1);
        spinDisc(6, 0);
        lightToward(null, null);
      } else {
        setO(disc, 0);
      }
    }

    /* ── La séquence : p ∈ [0, 1] ── */
    function renderSig(p) {
      const R = G.R, vw = Engine.vw, vh = Engine.vh;

      // A. un cercle se dessine, le plateau prend matière
      const draw = E.io3(seg(p, .02, .13));
      const metal = E.out3(seg(p, .07, .19));
      const out = seg(p, .88, .935);
      setO(platter, draw > 0 ? 1 - out : 0);
      setV(pDraw, '--draw', (100 * (1 - draw)).toFixed(2));
      setO(pMetal, metal);
      setO(pSheen, metal);
      const ps = G.P * (.94 + .06 * metal) * (1 - .06 * E.io3(out));
      setT(platter, `translate3d(${(G.cx - G.P / 2).toFixed(1)}px,${(G.cy - G.P / 2).toFixed(1)}px,0) scale(${(ps / G.P).toFixed(4)})`);
      setO(orbit, seg(p, .14, .23) * (1 - seg(p, .84, .89)));
      setT(orbit, `rotate(${(-p * 140 - Engine.time * 1.5).toFixed(2)}deg)`);

      // B. le disque glisse depuis le bord, tourne, ralentit, se pose
      const g = seg(p, .10, .30);
      const f = E.back(E.out3(g), .9);
      let x = lerp(G.peekX, G.cx, f);
      let y = lerp(G.peekY, G.cy, f) - Math.sin(Math.PI * g) * R * .09;
      let lift = 1 - E.io3(seg(p, .23, .31));
      let spinOff = -560 * E.out3(g);
      let size = R;

      // G. sortie : il se soulève et repart
      const ex = seg(p, .865, .925);
      if (ex > 0) {
        const up = E.out3(seg(p, .865, .885));
        lift = Math.max(lift, up);
        const m = E.in3(seg(p, .875, .925));
        x = lerp(G.cx, G.mob ? -R * .7 : -R * .6, m);
        y = lerp(G.cy, G.mob ? G.cy - vh * .1 : G.cy - vh * .28, m);
        spinOff += 420 * m;
      }
      size = R * (1 + .06 * lift);
      setT(disc, discTf(x, y, size));
      setO(disc, ex >= 1 ? 0 : 1);
      setV(shadow, '--sy', (G.B * (.025 + .09 * lift)).toFixed(1) + 'px');
      setV(shadow, '--sx', (G.B * .03 * lift).toFixed(1) + 'px');

      // E. l'allumage : une lampe qui chauffe, pas un interrupteur
      const warm = seg(p, .36, .46);
      let pow = E.io3(warm) * (1 + .14 * Math.sin(Math.PI * seg(p, .41, .49)));
      const off = seg(p, .87, .94);
      const beat = (p > B[3] + .012 && p < END_CH)
        ? Math.pow(Math.max(0, Math.sin(Engine.time * Math.PI * 2)), 10) : 0;   // DJing : une pulsation à 120 bpm

      // F. les morceaux : l'iris se ferme, l'étiquette change, l'iris s'ouvre
      let close;
      if (p < B[0]) close = 1;
      else {
        close = 1 - E.smooth(seg(p, B[0] + .004, B[0] + .035));
        for (let k = 1; k < 4; k++) {
          const dd = Math.abs(p - B[k]);
          close = Math.max(close, E.smooth(1 - clamp((dd - .007) / .026)));
        }
      }
      if (ex > 0) close = Math.max(close * (1 - ex), 0);
      setIris(1 - close * 1.08);

      let label = -1;
      if (p >= B[0] && p < B[1]) label = 0;
      else if (p >= B[1] && p < B[2]) label = 1;
      else if (p >= B[2] && p < B[3]) label = 2;
      setLabel(label);
      setV(core, '--core', (label === -1 ? .35 + .65 * Math.min(1, pow) + beat * .25 : 1).toFixed(3));

      // vitesse : à l'arrêt tant qu'il glisse, 33 tours-ish une fois allumé, freiné pendant un changement
      const brake = p >= B[0] ? close : 0;
      spinDisc(110 * Math.min(1, pow) * (1 - off) * (1 - .7 * brake), spinOff);
      // la lumière vient d'en haut à gauche et respire avec la lampe
      sheenA = lerp(sheenA, -38 + Math.sin(Engine.time * .4) * 6, .06);
      setT(sheen, `rotate(${sheenA.toFixed(2)}deg)`);

      // le bras
      const armIn = seg(p, .29, .37);
      const armOut = seg(p, .855, .885);
      const cf = clamp(E.smooth(seg(p, B[1] - .02, B[1] + .02)) + E.smooth(seg(p, B[2] - .02, B[2] + .02)) + E.smooth(seg(p, B[3] - .02, B[3] + .02)), 0, 3);
      const r = lerp(G.tracks[Math.floor(cf)], G.tracks[Math.min(3, Math.floor(cf) + 1)], cf - Math.floor(cf));
      const aPlay = armAngle(r);
      let a = lerp(G.park, aPlay, E.back(armIn, 1.1));
      a = lerp(a, G.park, E.io3(armOut));
      setO(arm, seg(p, .255, .29) * (1 - seg(p, .9, .935)));
      setT(arm, `translate3d(${G.ax.toFixed(1)}px,${G.ay.toFixed(1)}px,0) rotate(${(a / RAD).toFixed(2)}deg)`);
      setV(arm, '--led', (Math.min(1, pow) * (1 - armOut)).toFixed(3));

      // la lumière
      const gl = Math.min(1.14, pow) * (1 - E.io3(off) * .92) * (1 + beat * .08);
      const gs = (.7 + .3 * Math.min(1, pow)) * (1 - .88 * E.io3(off)) * (1 + beat * .05);
      setO(glow, gl * .95);
      setT(glow, `translate3d(${(G.cx - G.G / 2).toFixed(1)}px,${(G.cy - G.G / 2).toFixed(1)}px,0) scale(${gs.toFixed(4)})`);
      setO(wash, Math.min(1, pow) * (1 - off * .6) * .9);

      // H. il ne reste qu'un point, puis le point s'ouvre sur la section suivante
      const pt = seg(p, .9, .93);
      const w = E.io3(seg(p, .955, .995));
      setO(point, pt * (1 - seg(w, .05, .2)));
      setT(point, `translate3d(${G.cx.toFixed(1)}px,${G.cy.toFixed(1)}px,0) scale(${(1 + .25 * Math.sin(Engine.time * 2.2)).toFixed(3)})`);
      if (w > 0 && w < 1) {
        setO(wipe, 1);
        setT(wipe, `translate3d(${(G.cx - G.W / 2).toFixed(1)}px,${(G.cy - G.W / 2).toFixed(1)}px,0) scale(${Math.max(.0005, w).toFixed(4)})`);
      } else setO(wipe, 0);
      stage.style.background = w >= 1 ? 'var(--porcelain)' : '';
      s.light = w > .5;

      // le tambour de sélection : les noms tournent sur un cylindre
      const dv = seg(p, .43, .47) * (1 - seg(p, .84, .865));
      drumNames.forEach((n, i) => {
        const rel = i - cf;
        const vis = dv * clamp(1 - Math.abs(rel) * .9);
        setO(n, vis);
        if (vis > 0) setT(n, `rotateX(${(rel * 42).toFixed(2)}deg)`);
      });
      drumLines.forEach((l, i) => setO(l, dv * clamp(1 - Math.abs(i - cf) * 2.4)));
      const ci = Math.round(cf);
      if (ci !== lastCh) {
        drumI.textContent = ci + 1;
        tspans.forEach(ts => ts.classList.toggle('is-on', +ts.dataset.i === ci));
        lastCh = ci;
      }
      setO(drum, dv > 0 ? 1 : 0);

      // le texte final
      const tx = seg(p, .905, .95);
      setO(sigText, tx > 0 ? 1 : 0);
      sigH.style.clipPath = `inset(-20% -6% ${(100 - E.out3(tx) * 130).toFixed(1)}% -6%)`;
      setO(sigOutro, seg(p, .925, .955));
      setO(hint, 1 - seg(p, .01, .06));

      // son : allumage, déclic de l'iris, notes à chaque morceau
      if (lastP >= 0) {
        if ((lastP < .4) !== (p < .4) && p >= .4) Sound.play('pad');
        B.forEach((b, k) => {
          if ((lastP < b) !== (p < b)) { Sound.play('shutter'); Sound.play('keys', [0, 4, 2, 7][k]); }
        });
      }
      lastP = p;
    }

    const s = {
      range: [-1e9, 1e9],
      light: false,
      measure,
      update(y) {
        if (reduced) return;
        if (y >= top - 2 && y <= top + len + 2) renderSig(clamp((y - top) / len));
        else { s.light = false; if (y > top + len) { hideSigParts(); setO(disc, 0); stage.style.background = 'var(--porcelain)'; } else renderOutside(y); lastP = -1; }
      },
      // mouvement réduit : une composition fixe, posée dans la scène
      renderStatic() {
        stage.appendChild(rig);
        rig.classList.add('is-static');
        Engine.dt = 0;
        renderSig(.6);
        setO(drum, 0);
        setO(sigText, 1);
        sigH.style.clipPath = 'none';
        setO(sigOutro, 1);
        setO(hint, 0);
      },
    };
    return s;
  }
  let s_heroTf = () => '';
  let s_geo = null;

  /* 4.4 Projets : accordéon, lueur qui suit la souris le long de la ligne */
  function setupProjects() {
    $$('.track').forEach(tk => {
      const btn = $('.track-btn', tk);
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') !== 'true';
        btn.setAttribute('aria-expanded', open);
        tk.classList.toggle('is-open', open);
        Sound.tick(open ? 3 : 1);
        setTimeout(queueMeasure, 950);
      });
      if (hasHover) btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty('--hx', (e.clientX - r.left) + 'px');
      });
    });
    const plate = $('.plate');
    if (plate && hasHover) plate.addEventListener('pointermove', e => {
      const r = plate.getBoundingClientRect();
      plate.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      plate.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }

  /* 4.5 Galerie : deux lignes en contrepoint ; au bord de l'écran,
     chaque image se referme en cercle, comme vue à travers un objectif */
  const galleryData = [
    { cat: 'Cuisine / Salé',   caption: 'Côte de Boeuf',          src: 'photos/coteBoeuf.jpg' },
    { cat: 'Photo / Décor',    caption: "Cage d'escalier étoilé", src: 'photos/escalier.jpg' },
    { cat: 'Cuisine / Sucré',  caption: 'Fraisier',               src: 'photos/fraisier.jpg' },
    { cat: 'Photo / Décor',    caption: 'Porsche',                src: 'photos/porsche.jpg' },
    { cat: 'Cuisine / Salé',   caption: 'Carbonara',              src: 'photos/carbonara.jpg' },
    { cat: 'Photo / Décor',    caption: "L'Horizon",              src: 'photos/mer.jpg' },
    { cat: 'Cuisine / Sucré',  caption: 'Profiteroles',           src: 'photos/profiteroles1.jpg' },
    { cat: 'Photo / Décor',    caption: 'Fête Foraine',           src: 'photos/fete.jpg' },
    { cat: 'Photo / Portrait', caption: 'Piano',                  src: 'photos/portrait2.jpg' },
    { cat: 'Cuisine / Salé',   caption: 'Burger Maison',          src: 'photos/burger.jpg' },
    { cat: 'Photo / Décor',    caption: 'Sapin de Noël',          src: 'photos/sapin.jpg' },
    { cat: 'Photo / Décor',    caption: "Bateau sur l'eau",       src: 'photos/bateau.jpg' },
    { cat: 'Photo / Décor',    caption: 'Puit de pétrole',        src: 'photos/petrole.jpg' },
    { cat: 'Cuisine / Salé',   caption: 'Salade César',           src: 'photos/saladeCesar.jpg' },
    { cat: 'Photo / Décor',    caption: "Cinema à l'ancienne",    src: 'photos/cinema.jpg' },
    { cat: 'Cuisine / Salé',   caption: 'Le veau Marengo',        src: 'photos/VeauMarengo.jpg' },
    { cat: 'Photo / Décor',    caption: 'La crique',              src: 'photos/crique.jpg' },
    { cat: 'Photo / Décor',    caption: 'ESIEE Paris',            src: 'photos/esiee.jpeg' },
    { cat: 'Photo / Décor',    caption: 'Grotte',                 src: 'photos/grotte.jpeg' },
    { cat: 'Cuisine / Salé',   caption: 'Poulet tomate',          src: 'photos/tomatoeChicken.jpeg' },
    { cat: 'Photo / Décor',    caption: 'Fog Tower',              src: 'photos/fogtower.jpeg' },
    { cat: 'Photo / Décor',    caption: "Reflet sur l'eau",       src: 'photos/watermiror.jpeg' },
    { cat: 'Cuisine / Salé',   caption: 'Poulet petits pois',     src: 'photos/chicken&peas.jpeg' },
    { cat: 'Cuisine / Salé',   caption: 'Burger Maison v2',       src: 'photos/homemadeBurger.jpeg' },
  ];

  function GalleryScene() {
    const sec = $('#gallery');
    const trackEls = $$('.gal-track', sec);
    const RATIOS = [1.32, .8, 1.12, 1.5, .9, 1.25, .78];
    const native = reduced || !hasHover && innerWidth < 520;

    const tracks = trackEls.map((tr, ti) => {
      const box = $('.gal-clips', tr);
      const items = galleryData.filter(g => g.cat.startsWith(tr.dataset.cat));
      const clips = items.map((g, i) => {
        const fig = d.createElement('figure');
        fig.className = 'clip';
        const cap = g.caption.replace(/"/g, '&quot;');
        fig.innerHTML = `
          <div class="clip-frame" data-caption="${cap}" style="--ar:${RATIOS[(i + ti * 3) % RATIOS.length]}">
            <img src="${g.src}" alt="${cap}" loading="lazy" decoding="async">
          </div>
          <figcaption><span class="clip-name">${g.caption}</span><span class="clip-cat">${g.cat}</span></figcaption>`;
        $('img', fig).addEventListener('error', () => fig.classList.add('no-img'));
        box.appendChild(fig);
        return { fig, frame: $('.clip-frame', fig), img: $('img', fig), x: 0, w: 0 };
      });
      return { el: tr, box, clips, dir: ti === 0 ? -1 : 1, tw: 0, skew: 0 };
    });

    if (native) sec.classList.add('is-native');

    let top = 0, len = 1;
    const s = {
      range: [0, 0],
      measure() {
        if (native) { s.range = [-1e9, -1e9]; return; }
        const vw = Engine.vw, vh = Engine.vh;
        let maxOver = 0;
        tracks.forEach(tr => {
          tr.tw = tr.box.scrollWidth;
          tr.over = Math.max(0, tr.tw - vw);
          maxOver = Math.max(maxOver, tr.over);
          tr.clips.forEach(c => { c.x = c.fig.offsetLeft; c.w = c.fig.offsetWidth; });
        });
        sec.style.height = (vh + maxOver * 1.05) + 'px';
        top = docTop(sec);
        len = Math.max(1, sec.offsetHeight - vh);
        s.range = [top - vh, top + sec.offsetHeight];
      },
      update(y) {
        if (native) return;
        const p = clamp((y - top) / len);
        const vw = Engine.vw;
        const skewT = clamp(-Engine.vel * .04, -4, 4);
        tracks.forEach(tr => {
          const x = tr.dir < 0 ? -p * tr.over : -(1 - p) * tr.over;
          tr.skew = lerp(tr.skew, skewT * (tr.dir < 0 ? 1 : -1), .1);
          setT(tr.box, `translate3d(${x.toFixed(1)}px,0,0) skewX(${tr.skew.toFixed(2)}deg)`);
          tr.clips.forEach(c => {
            const center = c.x + c.w / 2 + x;
            if (center < -c.w || center > vw + c.w) return;
            const off = Math.abs(center - vw / 2) / (vw / 2);           // 0 au centre, 1 au bord
            const open = E.out3(clamp((1.02 - off) / .42));
            setV(c.frame, '--r', (9 + 66 * open).toFixed(1) + '%');
            setV(c.img, '--zs', (1.14 - .13 * open).toFixed(3));
            setV(c.img, '--px', (((vw / 2 - center) / vw) * c.w * .07).toFixed(1) + 'px');
          });
        });
      },
    };
    return s;
  }

  /* 4.6 Contact : un cercle se referme autour de la dernière phrase,
     le point de lumière du début fait le tour et revient. */
  function ContactScene() {
    const head = $('.contact-head');
    const halo = $('.halo');
    const hp = $('.halo-point');
    let top = 0, maxY = 1, rad = 100;

    const mail = $('.c-mail');
    if (mail && hasHover && !reduced) {
      const txt = mail.textContent.trim();
      mail.setAttribute('aria-label', txt);
      mail.innerHTML = txt.split('').map(ch => `<span class="m" aria-hidden="true">${ch}</span>`).join('');
      const ms = $$('.m', mail);
      const w = ms.map(() => 90), wT = ms.map(() => 90);
      let running = false;
      const loop = () => {
        let moving = false;
        ms.forEach((m, i) => {
          w[i] = lerp(w[i], wT[i], .16);
          if (Math.abs(w[i] - wT[i]) > .2) moving = true;
          m.style.setProperty('--w', w[i].toFixed(1));
        });
        if (moving) requestAnimationFrame(loop); else running = false;
      };
      const kick = () => { if (!running) { running = true; requestAnimationFrame(loop); } };
      mail.addEventListener('pointermove', e => {
        ms.forEach((m, i) => {
          const r = m.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / 70;
          wT[i] = 90 + 35 * Math.exp(-dx * dx);
        });
        kick();
      });
      mail.addEventListener('pointerleave', () => { wT.fill(90); kick(); });
    }

    const s = {
      range: [0, 0],
      measure() {
        top = docTop(head);
        maxY = d.documentElement.scrollHeight - Engine.vh;
        rad = halo.getBoundingClientRect().width / 2;
        setV(hp, '--hr', rad.toFixed(1) + 'px');
        s.range = [top - Engine.vh, maxY + 1];
      },
      update(y) {
        const a0 = Math.min(top - Engine.vh * .75, maxY - Engine.vh * .6);
        const q = reduced ? 1 : E.io3(seg(y, a0, maxY - 2));
        setV(halo, '--h', (100 * (1 - q)).toFixed(2));
        setV(hp, '--ha', (-100 + 360 * q).toFixed(2) + 'deg');
        setV(hp, '--ho', (q > .01 ? 1 : 0).toString());
      },
    };
    return s;
  }

  /* 4.7 En-tête, teintes, progression */
  function ChromeScene(rigScene) {
    const header = $('#site-header');
    const links = $$('.nav a');
    const pg = $('.progress');
    const toned = $$('[data-tone]').filter(el => el.tagName === 'SECTION');
    const secIds = links.map(a => a.dataset.sec);
    let bands = [], secs = [], total = 1, lastTone = '', lastHudTone = '', lastActive = -1;

    function toneAt(py) {
      if (!reduced && rigScene && rigScene.sigTop !== undefined) {
        const a = rigScene.sigTop, b = a + rigScene.sigLen + Engine.vh;
        if (py >= a && py < b && (rigScene.light || window.scrollY > a + rigScene.sigLen)) return 'light';
      }
      for (const b of bands) if (py >= b.a && py < b.b) return b.tone;
      return 'dark';
    }

    const s = {
      measure() {
        total = Math.max(1, d.documentElement.scrollHeight - Engine.vh);
        bands = toned.map(el => ({ a: docTop(el), b: docTop(el) + el.offsetHeight, tone: el.dataset.tone }));
        secs = secIds.map(id => ({ a: docTop(d.getElementById(id)) }));
      },
      update(y) {
        const pr = clamp(y / total);
        setV(pg, '--pg', (100 * (1 - pr)).toFixed(2));
        const tone = toneAt(y + 30);
        if (tone !== lastTone) { header.dataset.tone = tone; lastTone = tone; }
        header.classList.toggle('is-solid', y > 24);
        const hudTone = toneAt(y + Engine.vh - 24);
        if (hudTone !== lastHudTone) { html.dataset.tone = hudTone; lastHudTone = hudTone; }
        let act = -1;
        secs.forEach((sc, i) => { if (y + Engine.vh * .4 >= sc.a) act = i; });
        if (act !== lastActive) { links.forEach((a, i) => a.classList.toggle('is-active', i === act)); lastActive = act; }
      },
      toneAt,
    };
    return s;
  }


  /* ═══════════════ 5. SON (optionnel) ═══════════════ */
  const Sound = {
    ctx: null, out: null, noise: null, on: false,
    btn: null,
    init() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      this.ctx = new AC();
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -18; comp.ratio.value = 4;
      this.out = this.ctx.createGain();
      this.out.gain.value = .55;
      this.out.connect(comp).connect(this.ctx.destination);
      const len = this.ctx.sampleRate * .25;
      this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = this.noise.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      return true;
    },
    async toggle() {
      if (!this.ctx && !this.init()) return;
      this.on = !this.on;
      if (this.ctx.state === 'suspended') await this.ctx.resume();
      this.btn.setAttribute('aria-pressed', this.on);
      store.set('am-sound', this.on ? '1' : '0');
      if (this.on) this.play('keys', 8);
    },
    env(g, t, a, peak, dec) {
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + a);
      g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec);
    },
    tick(level = 1) {
      if (!this.on || !this.ctx) return;
      const t = this.ctx.currentTime;
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 900 + level * 180;
      this.env(g, t, .002, .08 + level * .03, .05);
      o.connect(g).connect(this.out); o.start(t); o.stop(t + .08);
    },
    play(voice, step = 0) {
      if (!this.on || !this.ctx) return;
      const c = this.ctx, t = c.currentTime;
      if (voice === 'kick') {
        const o = c.createOscillator(), g = c.createGain();
        o.frequency.setValueAtTime(150, t);
        o.frequency.exponentialRampToValueAtTime(42, t + .14);
        this.env(g, t, .003, .9, .32);
        o.connect(g).connect(this.out); o.start(t); o.stop(t + .4);
      } else if (voice === 'keys') {
        const scale = [146.83, 164.81, 174.61, 196, 220, 246.94, 261.63, 293.66];
        const f = scale[step % 8] * (step >= 8 ? 2 : 1);
        const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2200;
        const g = c.createGain();
        [1, 2].forEach((mul, k) => {
          const o = c.createOscillator();
          o.type = k ? 'sine' : 'triangle';
          o.frequency.value = f * mul;
          o.connect(lp); o.start(t); o.stop(t + .9);
        });
        this.env(g, t, .006, .28, .7);
        lp.connect(g).connect(this.out);
      } else if (voice === 'shutter') {
        [0, .05].forEach(off => {
          const src = c.createBufferSource(); src.buffer = this.noise;
          const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2600; bp.Q.value = 1.4;
          const g = c.createGain();
          this.env(g, t + off, .001, .5, .035);
          src.connect(bp).connect(g).connect(this.out);
          src.start(t + off); src.stop(t + off + .06);
        });
      } else if (voice === 'pad') {
        const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520;
        const g = c.createGain();
        [73.42, 110, 110.6].forEach(f => {
          const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f;
          o.connect(lp); o.start(t); o.stop(t + 1.6);
        });
        this.env(g, t, .08, .16, 1.3);
        lp.connect(g).connect(this.out);
      }
    },
  };


  /* ═══════════════ 6. CURSEUR & MICRO-INTERACTIONS ═══════════════ */
  function setupCursor(chrome) {
    if (!hasHover) return;
    const cur = $('#cursor');
    const dot = $('.c-dot', cur), ring = $('.c-ring-w', cur);
    html.classList.add('has-cursor');
    let mx = -100, my = -100, rx = -100, ry = -100, visible = true, lastTone = '';
    d.addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    d.addEventListener('pointerdown', () => cur.classList.add('is-down'));
    d.addEventListener('pointerup', () => cur.classList.remove('is-down'));
    d.addEventListener('mouseleave', () => { visible = false; cur.style.opacity = 0; });
    d.addEventListener('mouseenter', () => { visible = true; cur.style.opacity = 1; });
    d.addEventListener('pointerover', e => {
      const tg = e.target;
      const track = tg.closest('.track-btn');
      const img = tg.closest('.clip');
      const link = tg.closest('a, button');
      cur.classList.toggle('is-track', !!track);
      cur.classList.toggle('is-img', !!img && !track);
      cur.classList.toggle('is-link', !!link && !track);
    });
    frameTasks.push(() => {
      if (!visible) return;
      // le point suit exactement, l'anneau a un peu d'inertie
      rx = lerp(rx, mx, .3); ry = lerp(ry, my, .3);
      setT(dot, `translate3d(${mx}px,${my}px,0)`);
      setT(ring, `translate3d(${rx.toFixed(1)}px,${ry.toFixed(1)}px,0)`);
      const tone = $('#menu').hidden ? chrome.toneAt(window.scrollY + my) : 'dark';
      if (tone !== lastTone) { html.classList.toggle('cursor-light', tone === 'light'); lastTone = tone; }
    });
  }

  function setupMagnetic() {
    if (!hasHover || reduced) return;
    $$('.btn').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * .18;
        const dy = (e.clientY - (r.top + r.height / 2)) * .3;
        b.style.transform = `translate(${clamp(dx, -8, 8)}px, ${clamp(dy, -6, 6)}px)`;
      });
      b.addEventListener('pointerleave', () => (b.style.transform = ''));
    });
  }

  function setupMenu() {
    const btn = $('#menu-toggle');
    const menu = $('#menu');
    const label = $('span', btn);
    const set = open => {
      menu.hidden = !open;
      btn.setAttribute('aria-expanded', open);
      label.dataset.i18n = open ? 'menu_close' : 'menu';
      label.textContent = t(label.dataset.i18n);
      html.style.overflow = open ? 'hidden' : '';
      if (open) $('#site-header').dataset.tone = 'dark';
    };
    btn.addEventListener('click', () => set(menu.hidden));
    $$('a', menu).forEach(a => a.addEventListener('click', () => set(false)));
    d.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) set(false); });
  }

  function setupAnchors() {
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        const target = id === '#top' ? d.body : $(id);
        if (!target) return;
        e.preventDefault();
        const off = id === '#top' ? 0 : docTop(target);
        window.scrollTo({ top: off, behavior: reduced ? 'auto' : 'smooth' });
        if (id !== '#top') history.replaceState(null, '', id);
      });
    });
  }


  /* ═══════════════ 7. INTRO ═══════════════
     Un point de lumière dans le noir. Trois cercles se dessinent autour de lui.
     Un faisceau traverse la scène et l'objet apparaît, là où étaient les cercles.
     Les lettres du nom flottent autour, floues, puis se posent à leur place
     pendant que l'objet part prendre la sienne dans le hero. */
  function runIntro() {
    return new Promise(resolve => {
      window.__amIntro = true;
      if (!html.classList.contains('intro-pending')) return resolve();
      const full = html.dataset.intro !== 'short';
      const G = s_geo;
      const vw = Engine.vw, vh = Engine.vh;
      const T = full ? 6300 : 2300;
      const O = ms => clamp(ms / T);
      const anims = [];
      const A = (el, frames, opts = {}) => { const a = el.animate(frames, { duration: T, fill: 'both', ...opts }); anims.push(a); return a; };

      const intro = $('#intro');
      const point = $('.intro-point', intro);
      const rings = $('.intro-rings', intro);
      const sweep = $('.intro-sweep', intro);
      const disc = $('#disc');
      const glow = $('.rig-glow');
      const letters = $$('.hero-title .ch');

      const Dc = Math.min(vw, vh) * (vw < 860 ? .62 : .4);
      const cx = vw / 2, cy = vh / 2;
      const rs = Dc * 1.25;
      rings.style.width = rings.style.height = rs + 'px';
      rings.style.marginLeft = rings.style.marginTop = (-rs / 2) + 'px';

      const discAt = (x, y, size) => `translate3d(${(x - G.B / 2).toFixed(1)}px,${(y - G.B / 2).toFixed(1)}px,0) scale(${(size / G.B).toFixed(4)})`;
      const center = discAt(cx, cy, Dc);
      const heroTf = s_heroTf();

      const k = full ? 1 : .36;       // version courte : tout est compressé
      const at = ms => ms * k;

      // 1. le point
      A(point, [
        { offset: 0, opacity: 0, transform: 'scale(.3)' },
        { offset: O(at(250)), opacity: 0, transform: 'scale(.3)', easing: 'cubic-bezier(.16,1,.3,1)' },
        { offset: O(at(900)), opacity: 1, transform: 'scale(1)' },
        { offset: O(at(2300)), opacity: 1, transform: 'scale(1.3)' },
        { offset: O(at(2900)), opacity: 0, transform: 'scale(2.2)' },
        { offset: 1, opacity: 0, transform: 'scale(2.2)' },
      ]);

      // 2. les cercles se dessinent, à des vitesses différentes, en sens opposés
      $$('.ir', rings).forEach((c, i) => {
        const a0 = at(600 + i * 260), a1 = at(1900 + i * 200);
        A(c, [
          { offset: 0, strokeDashoffset: 100, transform: `rotate(${-90 + i * 40}deg) scale(1)`, opacity: i ? (i === 1 ? .5 : .25) : 1 },
          { offset: O(a0), strokeDashoffset: 100, transform: `rotate(${-90 + i * 40}deg) scale(1)`, easing: 'cubic-bezier(.65,0,.25,1)' },
          { offset: O(a1), strokeDashoffset: 0, transform: `rotate(${(i % 2 ? -1 : 1) * 120 - 90}deg) scale(1)` },
          { offset: O(at(3000)), strokeDashoffset: 0, transform: `rotate(${(i % 2 ? -1 : 1) * 150 - 90}deg) scale(1)`, opacity: i ? (i === 1 ? .5 : .25) : 1, easing: 'cubic-bezier(.16,1,.3,1)' },
          { offset: O(at(4300)), strokeDashoffset: 0, transform: `rotate(${(i % 2 ? -1 : 1) * 170 - 90}deg) scale(${1.5 + i * .25})`, opacity: 0 },
          { offset: 1, strokeDashoffset: 0, transform: `rotate(0deg) scale(2)`, opacity: 0 },
        ]);
      });

      // 3. une lueur naît derrière
      A(glow, [
        { offset: 0, opacity: 0, transform: `translate3d(${cx - G.G / 2}px,${cy - G.G / 2}px,0) scale(.2)` },
        { offset: O(at(800)), opacity: 0, transform: `translate3d(${cx - G.G / 2}px,${cy - G.G / 2}px,0) scale(.2)` },
        { offset: O(at(2400)), opacity: .55, transform: `translate3d(${cx - G.G / 2}px,${cy - G.G / 2}px,0) scale(.55)` },
        { offset: O(at(4200)), opacity: 0, transform: `translate3d(${cx - G.G / 2}px,${cy - G.G / 2}px,0) scale(.8)` },
        { offset: 1, opacity: 0, transform: `translate3d(${cx - G.G / 2}px,${cy - G.G / 2}px,0) scale(.8)` },
      ]);

      // 4. le faisceau traverse, l'objet apparaît du centre vers le bord
      A(sweep, [
        { offset: 0, opacity: 0, transform: 'translateX(-60vmax) rotate(14deg)' },
        { offset: O(at(2100)), opacity: 0, transform: 'translateX(-60vmax) rotate(14deg)', easing: 'cubic-bezier(.45,0,.2,1)' },
        { offset: O(at(2400)), opacity: 1 },
        { offset: O(at(3700)), opacity: 1 },
        { offset: O(at(3900)), opacity: 0, transform: `translateX(${vw + 200}px) rotate(14deg)` },
        { offset: 1, opacity: 0, transform: `translateX(${vw + 200}px) rotate(14deg)` },
      ]);
      A(disc, [
        { offset: 0, transform: center, opacity: 1, clipPath: 'circle(0% at 50% 50%)' },
        { offset: O(at(2000)), transform: center, clipPath: 'circle(0% at 50% 50%)', easing: 'cubic-bezier(.65,0,.25,1)' },
        { offset: O(at(3100)), transform: center, clipPath: 'circle(50% at 50% 50%)' },
        { offset: O(at(full ? 4300 : 3100)), transform: center, clipPath: 'circle(50% at 50% 50%)', easing: 'cubic-bezier(.62,0,.2,1)' },
        { offset: O(at(full ? 5900 : 5600)), transform: heroTf, clipPath: 'circle(50% at 50% 50%)' },
        { offset: 1, transform: heroTf, opacity: 1, clipPath: 'circle(50% at 50% 50%)' },
      ]);

      // 5. les lettres : en orbite autour de l'objet, floues, puis à leur place
      const rnd = mulberry32(7);
      letters.forEach((l, j) => {
        const b = l.getBoundingClientRect();
        const lx = b.left + b.width / 2, ly = b.top + b.height / 2;
        const ang = (j / letters.length) * Math.PI * 2 - Math.PI / 2 + (rnd() - .5) * .3;
        const rr = Dc * (.72 + rnd() * .22);
        const ox = cx + Math.cos(ang) * rr * (vw < 860 ? .9 : 1.25) - lx;
        const oy = cy + Math.sin(ang) * rr * .78 - ly;
        const ang2 = ang + .35;
        const ox2 = cx + Math.cos(ang2) * rr * (vw < 860 ? .9 : 1.25) - lx;
        const oy2 = cy + Math.sin(ang2) * rr * .78 - ly;
        const s0 = .34 + rnd() * .12, rot = (rnd() - .5) * 40;
        const land = at(full ? 4100 : 2600) + j * at(55);
        const tr = (x, y, r, s) => `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${r.toFixed(1)}deg) scale(${s.toFixed(3)})`;
        A(l, full ? [
          { offset: 0, opacity: 0, filter: 'blur(14px)', transform: tr(ox, oy, rot, s0) },
          { offset: O(2500 + j * 40), opacity: 0, filter: 'blur(14px)', transform: tr(ox, oy, rot, s0) },
          { offset: O(3300 + j * 40), opacity: .7, filter: 'blur(5px)', transform: tr(lerp(ox, ox2, .5), lerp(oy, oy2, .5), rot * .8, s0) },
          { offset: O(land), opacity: .8, filter: 'blur(3px)', transform: tr(ox2, oy2, rot * .6, s0 * 1.05), easing: 'cubic-bezier(.7,0,.15,1)' },
          { offset: O(land + 1300), opacity: 1, filter: 'blur(0px)', transform: tr(0, 0, 0, 1) },
          { offset: 1, opacity: 1, filter: 'blur(0px)', transform: tr(0, 0, 0, 1) },
        ] : [
          { offset: 0, opacity: 0, filter: 'blur(10px)', transform: tr(0, 30, 0, 1.06) },
          { offset: O(500 + j * 30), opacity: 0, filter: 'blur(10px)', transform: tr(0, 30, 0, 1.06), easing: 'cubic-bezier(.16,1,.3,1)' },
          { offset: O(1500 + j * 30), opacity: 1, filter: 'blur(0px)', transform: tr(0, 0, 0, 1) },
          { offset: 1, opacity: 1, filter: 'blur(0px)', transform: tr(0, 0, 0, 1) },
        ]);
      });

      const timers = [];
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        timers.forEach(clearTimeout);
        html.classList.remove('intro-pending');
        anims.forEach(a => a.cancel());
        store.set('am-intro-v3', String(Date.now()));
        ['keydown', 'wheel', 'touchstart'].forEach(ev => window.removeEventListener(ev, skip));
        resolve();
      };
      const skip = () => { anims.forEach(a => { try { a.finish(); } catch (e) {} }); finish(); };
      // l'interface arrive pendant que les lettres se posent
      timers.push(setTimeout(() => {
        html.classList.remove('intro-pending');
      }, T - (full ? 900 : 500)));
      $('.intro-skip', intro).addEventListener('click', skip);
      ['keydown', 'wheel', 'touchstart'].forEach(ev => window.addEventListener(ev, skip, { passive: true, once: true }));
      timers.push(setTimeout(finish, T + 60));
    });
  }


  /* ═══════════════ 8. DÉMARRAGE ═══════════════ */
  function boot() {
    const odos = buildOdometers();

    Sound.btn = $('.sound');
    Sound.btn.addEventListener('click', () => Sound.toggle());

    $('#lang-toggle').addEventListener('click', () => applyLang(lang === 'fr' ? 'en' : 'fr'));
    applyLang(lang);

    Engine.add(HeroScene());
    $$('.curve').forEach(c => Engine.add(CurveScene(c)));
    const rig = Engine.add(RigScene());
    Engine.add(GalleryScene());
    Engine.add(ContactScene());
    const chrome = Engine.add(ChromeScene(rig));
    Engine.add(RevealScene(odos));

    setupProjects();
    setupCursor(chrome);
    setupMagnetic();
    setupMenu();
    setupAnchors();
    langListeners.push(() => queueMeasure());

    const fontsReady = Promise.race([
      d.fonts ? d.fonts.ready : Promise.resolve(),
      new Promise(r => setTimeout(r, 1600)),
    ]);

    fontsReady.then(() => {
      Engine.measure();
      if (reduced) {
        rig.renderStatic();
        addEventListener('scroll', () => Engine.render(), { passive: true });
      } else Engine.loop();
      return runIntro();
    }).then(() => queueMeasure());

    addEventListener('resize', () => { queueMeasure(); if (reduced) requestAnimationFrame(() => rig.renderStatic()); });
    if ('ResizeObserver' in window) new ResizeObserver(queueMeasure).observe($('main'));
    addEventListener('load', queueMeasure);
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
