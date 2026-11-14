/**
 * script.js, Armand Mulier, portfolio / « Pressage »
 * Aucune dépendance : routes par ancre, Pointer Events, Web Animations, View Transitions quand elles existent.
 *
 *   0. Données (traductions, éditions, galeries)
 *   1. Outils et état
 *   2. Langue
 *   3. L'objet : extraction du disque, reflet, changement d'édition
 *   4. Routes et transitions entre les vues
 *   5. Livret, démonstrations, vidéo
 *   6. Ailleurs, compétences, galeries, contact
 *   7. Menu, clavier, démarrage
 */
(() => {
  'use strict';

  /* ── 0. Données ── */
  // CV à télécharger. Seule ligne à renseigner à la réception du PDF anglais : en: 'photos/NOM-DU-FICHIER.pdf'
  const CV = { fr: 'photos/CVAM2026F.pdf', en: '' };
  const I18N = {
    fr: {
      dish_duck: "Canard et purée",
      dish_duck_alt: "Tranches de canard sur une purée, entourée d’un cordon de jus.",
      p2_type: "Anglais / Application personnelle / IA",
      p2_role_label: "Ma démarche",
      p2_features_label: "Dans l’application",
      p2_features: "Vocabulaire, leçons, révisions espacées et suivi des erreurs. Les données restent dans le navigateur ; l’IA est facultative, via Ollama en local ou une API compatible.",
      p2_video_label: "Fluency · Présentation en motion design",
      p2_video_fallback: "La présentation vidéo sera bientôt disponible. Le projet est à découvrir sur GitHub.",
      p5_stage_label: "Avancement actuel · A4",
      p5_next_label: "La suite",
      p5_next: "Stabiliser le schéma et les premières migrations, puis poursuivre le projet par étapes. La base de données est en cours de construction ; le projet n’est pas terminé.",
      repo_link: "Voir le dépôt GitHub",
      project_in_progress: "Projet en cours",
      skip_content: "Aller au contenu",
      menu: "Menu",
      menu_close: "Fermer",
      nav_projects: "Projets",
      nav_skills: "Compétences",
      nav_contact: "Contact",
      hero_eyebrow: "Élève ingénieur ESIEE Paris / Disponible en alternance",
      hero_desc: "Cycle ingénieur ESIEE Paris · 2026–2029.<br>Informatique, données et projets qui répondent à un besoin.",
      about_headline: "Je finis ce que<br>je commence.",
      about_lead: "Après un parcours en Informatique &amp; Applications à l’Université Gustave Eiffel, je poursuis mes études en cycle ingénieur à l’ESIEE Paris (2026–2029). Je recherche une alternance en Île-de-France, en développement logiciel, données ou IA. Mes projets relient les bases apprises en C à des applications issues de besoins personnels.",
      about_p2: "Quand je commence quelque chose, j'essaie d'aller jusqu'au bout, même si ça prend du temps. J'aime comprendre comment les choses fonctionnent, pas seulement les utiliser.",
      about_p3: "À côté du code : cuisine, piano, photo, DJing et cours particuliers de maths. Des pratiques qui demandent chacune leur forme de patience et d'attention, et qui, sans que j'y pense forcément, influencent la façon dont j'aborde un projet.",
      about_code_label: "en bref",
      about_code: "formation  : Cycle ingénieur, ESIEE Paris · 2026–2029\nobjectif   : Alternance en informatique, Île-de-France\npratique   : Python, C, SQL, web\nintérêt    : comprendre, expérimenter, progresser",
      stat_years_unit: "ans",
      stat_years_label: "d'études supérieures en informatique",
      stat_projects_label: "projets présentés, personnels et universitaires",
      stat_location_label: "disponible en présentiel et télétravail",
      col_did: "Ce que j'ai fait",
      col_limits: "Limites honnêtes",
      col_would: "Ce que j'ajouterais",
      col_learned: "Ce qui m'a appris le plus",
      col_proud: "Ce qui m'a rendu fier",
      p1_type: "Structures de données / Analyse",
      p1_name: "Comparaison de Structures de Données",
      p1_desc: "Étude comparative en C de plusieurs structures de données : tableaux statiques, tableaux dynamiques et listes chaînées. Implémentation complète de chaque structure, mesure expérimentale des performances, et analyse des compromis selon les cas d'usage.",
      p1_did: "Implémentation rigoureuse des trois structures. Protocole de benchmark reproductible. Comparaison des coûts d'insertion, suppression et accès selon la taille des données.",
      p1_limits: "Tests limités à des jeux de données synthétiques. Pas de benchmarks multi-threadés.",
      p1_would: "Intégration d'arbres et de tables de hachage pour un panorama plus complet. Visualisation des résultats via matplotlib.",
      tag_dynarray: "Tableaux dynamiques",
      tag_linkedlist: "Listes chaînées",
      tag_memory: "Gestion mémoire",
      p2_name: "Fluency",
      p2_desc: "Progresser en anglais était devenu un vrai besoin pour mes études et la suite. Les solutions qui m’intéressaient étaient payantes : de là est née Fluency, une application personnelle pour apprendre à mon rythme, sur mon ordinateur.",
      p2_did: "Partir de mon besoin, définir l’expérience souhaitée et faire évoluer l’application avec l’aide d’outils d’IA pour le développement. Un projet personnel guidé par l’usage, avec un code réalisé avec assistance IA.",
      p3_type: "Base de données",
      p3_name: "Application Web SPA / Refuges",
      p3_desc: "Conception et développement complet d'une application web pour la gestion des refuges de la SPA. Du schéma entité-association jusqu'au site fonctionnel : modélisation, implémentation PostgreSQL, et interface Flask permettant aux employés de gérer les animaux, les soins et les transferts entre refuges.",
      p3_did: "Modélisation relationnelle complète sous PostgreSQL. Interface employé sécurisée (login/mot de passe). Fonctionnalités CRUD : ajout de pensionnaires, saisie de soins, transferts. Suivi des vaccins avec génération de listes de rappel.",
      p3_learned: "Garantir l'intégrité des données au niveau de la base (contraintes, clés étrangères) et non seulement au niveau applicatif. Dissocier la logique métier des vues Flask.",
      p3_snippet_label: "vaccins à rappeler / requête SQL",
      tag_db: "Modélisation BDD",
      p4_type: "Analyse",
      p4_name: "Arbres Binaires de Recherche",
      p4_desc: "Projet allant au-delà de l'implémentation : vérification et génération d'ABR, analyse de complexité formelle, benchmarking sur des milliers d'arbres générés (presque complets, filiformes, quelconques), visualisations matplotlib et rapport complet avec preuves algorithmiques.",
      p4_did: "Trois méthodes de vérification en C (naïve, définition optimisée, parcours infixe). Génération aléatoire d'arbres selon leur morphologie. Scripts Python de benchmarking et figures matplotlib automatisées.",
      p4_proud: "Passer de « ça marche » à « je prouve pourquoi ça marche en O(n) et pas O(n²) », et confronter les complexités théoriques aux mesures expérimentales.",
      p4_snippet_label: "vérification ABR / O(n)",
      tag_induction: "Induction structurelle",
      p5_type: "Données / PostgreSQL / En cours",
      p5_name: "TrackCurator",
      p5_desc: "Un projet personnel en cours, que je construis progressivement pour approfondir le travail sur les données et le backend. Le chantier actuel porte sur les fondations : organiser les données avant de développer la suite.",
      p5_did: "Début de la mise en place de la base PostgreSQL. Travail en cours sur le modèle de données, l’ORM — qui relie les objets du code aux tables — et les migrations, pour faire évoluer le schéma de la base.",
      skills_title: "Ce que je pratique.",
      skills_languages: "Langages",
      skills_theory: "Théorie &amp; Algorithmique",
      skills_tools: "Outils &amp; Pratiques",
      skills_lang_spoken: "Langues",
      sk_ds: "Structures de données",
      sk_complexity: "Complexité algorithmique",
      sk_automata: "Automates &amp; Langages",
      sk_induction: "Induction structurelle",
      sk_english: "Anglais",
      sk_spanish: "Espagnol",
      gallery_label: "Ailleurs",
      gallery_title: "Au-delà du code.",
      row_cuisine: "Cuisine",
      row_piano: "Piano",
      row_photo: "Photo",
      row_dj: "DJing",
      sig_cuisine: "La cuisine apprend la précision.",
      sig_piano: "Le piano apprend la patience.",
      sig_photo: "Prendre des photos apprend à cadrer.",
      sig_outro: "Ces pratiques forment la même logique que le développement, et je les emmène au travail.",
      contact_title: "Travaillons<br>ensemble.",
      contact_desc: "Je recherche une alternance en Île-de-France pour mon cycle ingénieur à l’ESIEE Paris (2026–2029), en développement logiciel, données ou IA. Je souhaite rejoindre une équipe, contribuer à des projets concrets et progresser au contact de ses pratiques.",
      contact_email_label: "Email",
      contact_phone_label: "Téléphone",
      contact_location_label: "Localisation",
      contact_btn: "Envoyer un message",
      footer_avail: "Disponible en alternance, Île-de-France",
      row_maths: "Maths",
      sig_dj: "Le DJing apprend le rythme et les transitions.",
      sig_maths: "Enseigner les maths apprend à expliquer simplement.",
      copy: "Copier",
      copied: "Copié",
      p6_name: "Sillage",
      p6_type: "Audio / Application de bureau / macOS et Windows",
      p6_desc: "Né d'un besoin concret pour le DJing : récupérer l'audio d'une vidéo YouTube en .wav ou .mp3 depuis une application de bureau simple, installable sur Mac comme sur Windows.",
      p6_role_label: "Ma démarche",
      p6_did: "Définir le besoin, l'usage et le fonctionnement attendu, puis faire évoluer l'application avec des outils d'IA pour le développement. Je n'ai pas écrit le code moi-même : mon travail porte sur la conception, les tests et la mise à disposition.",
      p6_dist_label: "Distribution",
      p6_dist: "Installeur .dmg pour macOS. Installeur Windows construit automatiquement avec GitHub Actions, en cours de test.",
      p6_video_label: "Sillage · Présentation en motion design",
      nav_home: "Accueil",
      nav_path: "Parcours",
      collection_title: "La collection",
      collection_meta: "Six projets&ensp;/&ensp;Six éditions",
      open: "Ouvrir",
      edition: "L’édition",
      booklet: "Livret",
      open_booklet: "Ouvrir le livret",
      back_edition: "Revenir à l’édition",
      pull_out: "Sortir le disque",
      pull_in: "Rentrer le disque",
      prev: "Précédent",
      next: "Suivant",
      close: "Fermer",
      change_disc: "Changer de disque",
      making_of: ", côté fabrication.",
      play_video: "Lire la vidéo",
      gal_c_title: "Galerie cuisine",
      gal_p_title: "Galerie photo",
      gal_c_count: "10 plats",
      gal_p_count: "14 photographies",
      back_to: "Retour à",
      see_dishes: "Voir mes plats",
      other_practices: "Parcourir les autres pratiques",
      see_photos: "Voir mes photographies",
      discover_sillage: "Découvrir Sillage",
      see_path: "Voir mon parcours",
      see_project: "Voir le projet",
      esiee_caption: "ESIEE Paris · photographie d’Armand Mulier",
      alt_piano: "Un ami au piano, photographié par Armand",
      alt_esiee: "Le campus de l’ESIEE Paris sous la neige",
      alt_fraisier: "Fraisier maison",
      alt_mer: "Coucher de soleil sur la mer",
      alt_keys: "Dessin d’un clavier de piano",
      alt_deck: "Le disque Sillage sur une platine",
      alt_sine: "Courbe de la fonction sinus",
      alt_cover: "Pochette de l’édition",
      demo: "Démonstration pédagogique",
      lb_prev: "Image précédente",
      lb_next: "Image suivante",
      e1_concept: "Le mot et sa réponse",
      e1_art: "Deux guillemets se répondent sur un papier ivoire. Le disque rouge reprend leur encre.",
      e2_concept: "Donner un ordre aux données",
      e2_art: "Des intercalaires en éventail évoquent la construction d’un catalogue. Le vert du pressage prolonge le bord des fiches.",
      e3_concept: "L’image devient son",
      e3_art: "Les perforations d’une pellicule se défont en un sillon argenté. Le vinyle fumé renvoie le même trait de lumière.",
      e4_concept: "Une décision à chaque fourche",
      e4_art: "Une ramure gravée évoque les bifurcations. Une seule branche claire isole un trajet. Le disque est couleur miel.",
      e5_concept: "Trois façons de ranger",
      e5_art: "Trois rythmes juxtaposent cases contiguës, bande extensible et maillons. Le vinyle bicolore met en vis-à-vis deux organisations.",
      e6_concept: "Un dossier qui accompagne l’animal",
      e6_art: "Deux silhouettes partagent un abri. Le fil imprimé évoque la continuité du suivi entre refuges. La pastille reprend l’arche.",
      d1_en: "Anglais",
      d1_fr: "Français",
      d1_card: "Carte de révision",
      d1_flip: "Retourner",
      d1_hidden: "Réponse masquée.",
      d1_shown: "Réponse affichée : étagère.",
      d2_title: "Fondations",
      d2_model: "Modèle",
      d2_mig: "Migrations",
      d2_t1: "Le modèle de données : organiser les données avant de développer la suite.",
      d2_t2: "L’ORM relie les objets du code aux tables.",
      d2_t3: "Les migrations font évoluer le schéma de la base.",
      d3_in: "Entrée",
      d3_out: "Sortie",
      d3_video: "Vidéo",
      d3_btn: "Passer au son",
      d3_reset: "Revenir à l’image",
      d4_btn: "Rechercher 6",
      d4_path: "Chemin",
      d4_reset: "Recommencer",
      d4_cap: "Exemple de recherche dans un ABR. Le projet, lui, porte sur trois algorithmes de vérification.",
      d4_done: "Chemin parcouru : 8, 4, 6.",
      d5_array: "Tableau",
      d5_list: "Liste chaînée",
      d5_dyn: "Tableau dynamique",
      d5_btn: "Insérer 6",
      d5_reset: "Retirer 6",
      d5_c1: "Décaler les cases pour insérer 6.",
      d5_c2: "Relier les maillons autour de 6.",
      d5_c3: "Capacité 4 : pleine après l’insertion, le prochain ajout demande une réallocation.",
      d6_file: "Dossier animal",
      d6_care: "Suivi des soins",
      d6_a: "Animal",
      d6_s: "Soin",
      d6_r: "Rappel",
      d6_btn: "Suivre le fil",
      d6_cap: "Schéma explicatif",
      home_pick_title: "Sélection de projets",
      home_cap_sillage: "Convertir une vidéo en audio pour préparer un set.",
      home_cap_fluency: "Apprendre l’anglais avec des leçons et des révisions espacées.",
      home_cap_trackcurator: "Construire une base de données musicale. Projet en cours.",
      home_open: "Ouvrir le projet {n}",
      see_all6: "Voir les 6 projets",
      see_cv: "Voir mon CV",
      nav_cv: "CV",
      cv_kicker: "Curriculum vitæ",
      cv_role: "Élève ingénieur à l’ESIEE Paris",
      cv_l1: "Cycle ingénieur, ESIEE Paris · 2026–2029",
      cv_l2: "Alternance en informatique, Île-de-France",
      cv_dl_fr: "Télécharger le CV en français",
      cv_dl_en: "Télécharger le CV en anglais",
      cv_en: "CV en anglais",
      cv_soon: "À venir",
      alt_avatar: "Portrait d’Armand Mulier, de profil",
      about_more: "Lire la suite du parcours",
      sk_hint: "Choisir une compétence pour voir ses projets",
      skx_py_arbres: "Scripts de benchmark sur des arbres générés.",
      skx_py_refuges: "Logique des vues Flask de l’application.",
      skx_c_arbres: "Méthodes de vérification d’un arbre binaire de recherche.",
      skx_c_structures: "Implémentation des tableaux et des listes chaînées.",
      skx_sql_refuges: "Requêtes et modèle PostgreSQL.",
      skx_sql_track: "Schéma PostgreSQL, en cours de construction.",
      skx_mpl_arbres: "Graphiques de benchmark.",
      skx_mpl_note: "Dans Structures, la visualisation Matplotlib figure parmi les pistes futures.",
      skx_ds_structures: "Comparaison des coûts des opérations.",
      skx_ds_arbres: "Mesures reliées à l’analyse de complexité.",
      skx_js_sillage: "Interactions de l’interface. Code réalisé avec assistance IA : mon rôle est la conception des usages et les tests.",
      skx_html_sillage: "Présentation de l’interface. Code réalisé avec assistance IA : mon rôle est la conception des usages et les tests.",
      sk_learn_t: "En cours d’apprentissage",
      sk_learn: "J’explore comment intégrer un modèle dans une application. Dans Fluency, l’aide IA est facultative et peut passer par Ollama en local ou une API compatible.",
      profiles: "Profils",
      back_home: "Retour à l’accueil",
    },
    en: {
      dish_duck: "Duck with purée",
      dish_duck_alt: "Sliced duck on a bed of purée with a ring of jus.",
      p2_type: "English / Personal application / AI",
      p2_role_label: "My approach",
      p2_features_label: "Inside the application",
      p2_features: "Vocabulary, lessons, spaced repetition and mistake tracking. Data stays in the browser; AI is optional, through local Ollama or a compatible API.",
      p2_video_label: "Fluency · Motion design presentation",
      p2_video_fallback: "The video presentation will be available soon. Explore the project on GitHub.",
      p5_stage_label: "Current stage · A4",
      p5_next_label: "Next steps",
      p5_next: "Stabilise the schema and initial migrations, then continue step by step. The database is under construction and the project is not finished.",
      repo_link: "View GitHub repository",
      project_in_progress: "Project in progress",
      skip_content: "Skip to content",
      menu: "Menu",
      menu_close: "Close",
      nav_projects: "Projects",
      nav_skills: "Skills",
      nav_contact: "Contact",
      hero_eyebrow: "Engineering student at ESIEE Paris / Open to work-study",
      hero_desc: "Engineering programme at ESIEE Paris · 2026–2029.<br>Software, data and projects driven by real needs.",
      about_headline: "I finish what<br>I start.",
      about_lead: "After studying Computer Science &amp; Applications at Université Gustave Eiffel, I am continuing in the engineering programme at ESIEE Paris (2026–2029). I am seeking a work-study placement in the Paris region in software development, data or AI. My projects connect the fundamentals I practised in C with applications inspired by personal needs.",
      about_p2: "When I start something, I try to see it through, even when it takes time. I like understanding how things work, not just using them.",
      about_p3: "Outside of code: cooking, piano, photography, DJing and private maths tutoring. Each of these takes its own form of patience and attention, and, without always thinking about it, they shape the way I approach a project.",
      about_code_label: "in short",
      about_code: "education  : Engineering programme, ESIEE Paris · 2026–2029\ngoal       : Software work-study, Paris region\npractice   : Python, C, SQL, web\ninterests  : understanding, experimenting, improving",
      stat_years_unit: "yrs",
      stat_years_label: "of higher education in computer science",
      stat_projects_label: "featured personal and university projects",
      stat_location_label: "available on-site and remote",
      col_did: "What I did",
      col_limits: "Honest limitations",
      col_would: "What I'd add",
      col_learned: "What I learned most",
      col_proud: "What made me proud",
      p1_type: "Data structures / Analysis",
      p1_name: "Data Structure Comparison",
      p1_desc: "Comparative study in C of several data structures: static arrays, dynamic arrays, and linked lists. Full implementation of each structure, experimental performance benchmarking, and analysis of trade-offs per use case.",
      p1_did: "Rigorous implementation of all three structures. Reproducible benchmark protocol. Comparison of insertion, deletion and access costs across data sizes.",
      p1_limits: "Tests limited to synthetic datasets. No multi-threaded benchmarks.",
      p1_would: "Add trees and hash tables for a broader comparison. Visualise results with matplotlib.",
      tag_dynarray: "Dynamic arrays",
      tag_linkedlist: "Linked lists",
      tag_memory: "Memory management",
      p2_name: "Fluency",
      p2_desc: "Improving my English had become a real need for my studies and future plans. The tools I was interested in required payment: that led to Fluency, a personal application for learning at my own pace, on my own computer.",
      p2_did: "Start with my own needs, define the learning experience and refine the application with AI development tools. A personal project guided by everyday use, with AI-assisted code.",
      p3_type: "Database",
      p3_name: "Web App SPA / Animal Shelters",
      p3_desc: "Full design and development of a web application for managing SPA animal shelters. From entity-relationship diagram to working site: data modelling, PostgreSQL implementation, and a Flask interface allowing staff to manage animals, medical care, and inter-shelter transfers.",
      p3_did: "Full relational modelling in PostgreSQL. Secure staff interface (login/password). CRUD features: adding residents, logging care, managing transfers. Vaccine tracking with automated reminder lists.",
      p3_learned: "Enforcing data integrity at the database level (constraints, foreign keys) rather than relying solely on application-side checks. Cleanly separating business logic from Flask views.",
      p3_snippet_label: "upcoming vaccines / SQL query",
      tag_db: "DB Modelling",
      p4_type: "Analysis",
      p4_name: "Binary Search Trees",
      p4_desc: "A project going beyond implementation: BST verification and generation, formal complexity analysis, benchmarking across thousands of generated trees (near-complete, degenerate, random), matplotlib visualisations, and a full report with algorithmic proofs.",
      p4_did: "Three verification methods in C (naïve, optimised definition, in-order traversal). Random tree generation across morphologies. Python benchmarking scripts and automated matplotlib figures.",
      p4_proud: "Going from \"it works\" to \"I can prove why it works in O(n) and not O(n²)\", and confirming the theoretical complexity against real experimental data.",
      p4_snippet_label: "BST verification / O(n)",
      tag_induction: "Structural induction",
      p5_type: "Data / PostgreSQL / In progress",
      p5_name: "TrackCurator",
      p5_desc: "A personal project in progress, built step by step to explore data and backend development. The current focus is on the foundations: organising the data before developing the next stages.",
      p5_did: "Starting to set up the PostgreSQL database. Work is underway on the data model, the ORM — which connects code objects to database tables — and migrations to evolve the database schema.",
      skills_title: "What I practise.",
      skills_languages: "Languages",
      skills_theory: "Theory &amp; Algorithms",
      skills_tools: "Tools &amp; Practices",
      skills_lang_spoken: "Spoken languages",
      sk_ds: "Data structures",
      sk_complexity: "Algorithmic complexity",
      sk_automata: "Automata &amp; Formal languages",
      sk_induction: "Structural induction",
      sk_english: "English",
      sk_spanish: "Spanish",
      gallery_label: "Beyond code",
      gallery_title: "Beyond the code.",
      row_cuisine: "Cooking",
      row_piano: "Piano",
      row_photo: "Photography",
      row_dj: "DJing",
      sig_cuisine: "Cooking teaches precision.",
      sig_piano: "Piano teaches patience.",
      sig_photo: "Photography teaches framing.",
      sig_outro: "These practices follow the same logic as development, and I bring them to work.",
      contact_title: "Let's work<br>together.",
      contact_desc: "I am seeking a work-study placement in the Paris region for my engineering programme at ESIEE Paris (2026–2029), in software development, data or AI. I want to join a team, contribute to real projects and learn from its working practices.",
      contact_email_label: "Email",
      contact_phone_label: "Phone",
      contact_location_label: "Location",
      contact_btn: "Send a message",
      footer_avail: "Open to work-study, Île-de-France",
      row_maths: "Maths",
      sig_dj: "DJing teaches rhythm and transitions.",
      sig_maths: "Teaching maths teaches you to explain simply.",
      copy: "Copy",
      copied: "Copied",
      p6_name: "Sillage",
      p6_type: "Audio / Desktop app / macOS and Windows",
      p6_desc: "Born from a concrete DJing need: getting the audio of a YouTube video as .wav or .mp3 from a simple desktop app that installs on both Mac and Windows.",
      p6_role_label: "My approach",
      p6_did: "Define the need, the intended use and the expected behaviour, then refine the application with AI development tools. I did not write the code myself: my work covers design, testing and distribution.",
      p6_dist_label: "Distribution",
      p6_dist: ".dmg installer for macOS. Windows installer built automatically with GitHub Actions, currently being tested.",
      p6_video_label: "Sillage · Motion design presentation",
      nav_home: "Home",
      nav_path: "Background",
      collection_title: "The collection",
      collection_meta: "Six projects&ensp;/&ensp;Six editions",
      open: "Open",
      edition: "The edition",
      booklet: "Booklet",
      open_booklet: "Open the booklet",
      back_edition: "Back to the edition",
      pull_out: "Pull the record out",
      pull_in: "Slide the record back",
      prev: "Previous",
      next: "Next",
      close: "Close",
      change_disc: "Change record",
      making_of: ", behind the scenes.",
      play_video: "Play the video",
      gal_c_title: "Food gallery",
      gal_p_title: "Photo gallery",
      gal_c_count: "10 dishes",
      gal_p_count: "14 photographs",
      back_to: "Back to",
      see_dishes: "See my dishes",
      other_practices: "Browse the other practices",
      see_photos: "See my photographs",
      discover_sillage: "Discover Sillage",
      see_path: "See my background",
      see_project: "See the project",
      esiee_caption: "ESIEE Paris · photograph by Armand Mulier",
      alt_piano: "A friend at the piano, photographed by Armand",
      alt_esiee: "The ESIEE Paris campus in the snow",
      alt_fraisier: "Homemade strawberry cake",
      alt_mer: "Sunset over the sea",
      alt_keys: "Drawing of a piano keyboard",
      alt_deck: "The Sillage record on a turntable",
      alt_sine: "Graph of the sine function",
      alt_cover: "Sleeve of edition",
      demo: "Teaching demo",
      lb_prev: "Previous image",
      lb_next: "Next image",
      e1_concept: "A word and its answer",
      e1_art: "Two quotation marks answer each other on ivory paper. The red record picks up their ink.",
      e2_concept: "Putting data in order",
      e2_art: "Fanned dividers suggest a catalogue being built. The green pressing extends the edge of the cards.",
      e3_concept: "Image becomes sound",
      e3_art: "The perforations of a film strip unravel into a silver groove. The smoked vinyl reflects the same streak of light.",
      e4_concept: "A decision at every fork",
      e4_art: "Engraved branches suggest the forks. A single light branch picks out one path. The record is honey-coloured.",
      e5_concept: "Three ways to store",
      e5_art: "Three rhythms set contiguous cells, an extensible strip and links side by side. The two-tone vinyl puts two layouts face to face.",
      e6_concept: "A record that follows the animal",
      e6_art: "Two silhouettes share a shelter. The printed thread suggests continuity of care between shelters. The label echoes the arch.",
      d1_en: "English",
      d1_fr: "French",
      d1_card: "Flashcard",
      d1_flip: "Flip",
      d1_hidden: "Answer hidden.",
      d1_shown: "Answer shown: étagère.",
      d2_title: "Foundations",
      d2_model: "Model",
      d2_mig: "Migrations",
      d2_t1: "The data model: organising the data before building the rest.",
      d2_t2: "The ORM links the code objects to the tables.",
      d2_t3: "Migrations make the database schema evolve.",
      d3_in: "Input",
      d3_out: "Output",
      d3_video: "Video",
      d3_btn: "Turn into sound",
      d3_reset: "Back to the image",
      d4_btn: "Search for 6",
      d4_path: "Path",
      d4_reset: "Start again",
      d4_cap: "Example of a search in a BST. The project itself is about three verification algorithms.",
      d4_done: "Path followed: 8, 4, 6.",
      d5_array: "Array",
      d5_list: "Linked list",
      d5_dyn: "Dynamic array",
      d5_btn: "Insert 6",
      d5_reset: "Remove 6",
      d5_c1: "Shift the cells to insert 6.",
      d5_c2: "Relink the nodes around 6.",
      d5_c3: "Capacity 4: full after the insertion, the next append requires a reallocation.",
      d6_file: "Animal record",
      d6_care: "Care tracking",
      d6_a: "Animal",
      d6_s: "Care",
      d6_r: "Reminder",
      d6_btn: "Follow the thread",
      d6_cap: "Explanatory diagram",
      home_pick_title: "Selected projects",
      home_cap_sillage: "Convert video to audio to prepare a DJ set.",
      home_cap_fluency: "Learn English with lessons and spaced review.",
      home_cap_trackcurator: "Building a music database. Work in progress.",
      home_open: "Open {n} project",
      see_all6: "View all 6 projects",
      see_cv: "View my CV",
      nav_cv: "CV",
      cv_kicker: "Curriculum vitæ",
      cv_role: "Engineering student at ESIEE Paris",
      cv_l1: "Engineering programme, ESIEE Paris · 2026–2029",
      cv_l2: "Software work-study, Paris region",
      cv_dl_fr: "Download French CV",
      cv_dl_en: "Download English CV",
      cv_en: "English CV",
      cv_soon: "Coming soon",
      alt_avatar: "Portrait of Armand Mulier, in profile",
      about_more: "More about my background",
      sk_hint: "Select a skill to see related projects",
      skx_py_arbres: "Benchmark scripts run on generated trees.",
      skx_py_refuges: "Logic of the application’s Flask views.",
      skx_c_arbres: "Verification methods for a binary search tree.",
      skx_c_structures: "Implementation of arrays and linked lists.",
      skx_sql_refuges: "Queries and PostgreSQL model.",
      skx_sql_track: "PostgreSQL schema, under construction.",
      skx_mpl_arbres: "Benchmark charts.",
      skx_mpl_note: "In Structures, Matplotlib visualisation is one of the future directions.",
      skx_ds_structures: "Comparing the cost of operations.",
      skx_ds_arbres: "Measurements tied to the complexity analysis.",
      skx_js_sillage: "Interface interactions. Code produced with AI assistance: my role is designing the use cases and testing.",
      skx_html_sillage: "Interface presentation. Code produced with AI assistance: my role is designing the use cases and testing.",
      sk_learn_t: "Currently exploring",
      sk_learn: "I’m exploring how to integrate a model into an application. In Fluency, AI assistance is optional and can use local Ollama or a compatible API.",
      profiles: "Profiles",
      back_home: "Back to home",
    }
  };
  const ED = {"fluency":{"n":1,"code":"AM–01","file":"01-fluency","short":"Fluency","key":"p2"},"trackcurator":{"n":2,"code":"AM–02","file":"02-trackcurator","short":"TrackCurator","key":"p5"},"sillage":{"n":3,"code":"AM–03","file":"03-sillage","short":"Sillage","key":"p6"},"arbres":{"n":4,"code":"AM–04","file":"04-arbres","short":"Arbres binaires","key":"p4"},"structures":{"n":5,"code":"AM–05","file":"05-structures","short":"Structures","key":"p1"},"refuges":{"n":6,"code":"AM–06","file":"06-refuges","short":"Refuges","key":"p3"}};
  const GAL = {"cuisine":[{"id":"coteboeuf","cap":"Côte de Boeuf","src":"photos/coteBoeuf.webp","w":960,"h":1280,"alt":null},{"id":"fraisier","cap":"Fraisier","src":"photos/fraisier.webp","w":960,"h":1280,"alt":null},{"id":"carbonara","cap":"Carbonara","src":"photos/carbonara.webp","w":960,"h":1280,"alt":null},{"id":"profiteroles","cap":"Profiteroles","src":"photos/profiteroles1.webp","w":960,"h":1280,"alt":null},{"id":"canard-et-puree","cap":"Canard et purée","src":"photos/canard-et-puree.webp","w":960,"h":1280,"alt":"dish_duck_alt"},{"id":"salade-cesar","cap":"Salade César","src":"photos/saladeCesar.webp","w":960,"h":1280,"alt":null},{"id":"veau-marengo","cap":"Le veau Marengo","src":"photos/VeauMarengo.webp","w":960,"h":1280,"alt":null},{"id":"poulet-tomate","cap":"Poulet tomate","src":"photos/tomatoeChicken.webp","w":1280,"h":1280,"alt":null},{"id":"poulet-petits-pois","cap":"Poulet petits pois","src":"photos/chicken-peas.webp","w":1280,"h":1280,"alt":null},{"id":"burger-v2","cap":"Burger Maison v2","src":"photos/homemadeBurger.webp","w":960,"h":1280,"alt":null}],"photo":[{"id":"escalier","cap":"Cage d'escalier étoilé","src":"photos/escalier.webp","w":960,"h":1280,"alt":null},{"id":"porsche","cap":"Porsche","src":"photos/porsche.webp","w":960,"h":1280,"alt":null},{"id":"horizon","cap":"L'Horizon","src":"photos/mer.webp","w":1280,"h":960,"alt":null},{"id":"fete-foraine","cap":"Fête Foraine","src":"photos/fete.webp","w":1280,"h":960,"alt":null},{"id":"piano","cap":"Piano","src":"photos/portrait2.webp","w":960,"h":1280,"alt":"alt_piano"},{"id":"sapin","cap":"Sapin de Noël","src":"photos/sapin.webp","w":960,"h":1280,"alt":null},{"id":"bateau","cap":"Bateau sur l'eau","src":"photos/bateau.webp","w":960,"h":1280,"alt":null},{"id":"petrole","cap":"Puit de pétrole","src":"photos/petrole.webp","w":960,"h":1280,"alt":null},{"id":"cinema","cap":"Cinema à l'ancienne","src":"photos/cinema.webp","w":960,"h":1280,"alt":null},{"id":"crique","cap":"La crique","src":"photos/crique.webp","w":1280,"h":1280,"alt":null},{"id":"esiee","cap":"ESIEE Paris","src":"photos/esiee.webp","w":956,"h":1280,"alt":null},{"id":"grotte","cap":"Grotte","src":"photos/grotte.webp","w":1280,"h":1280,"alt":null},{"id":"fog-tower","cap":"Fog Tower","src":"photos/fogtower.webp","w":960,"h":1280,"alt":null},{"id":"reflet","cap":"Reflet sur l'eau","src":"photos/watermiror.webp","w":1280,"h":1280,"alt":null}]};

  /* ── 1. Outils et état ── */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement, body = document.body;
  const reducedMq = matchMedia('(prefers-reduced-motion: reduce)');
  const still = () => reducedMq.matches;
  const canVT = () => !still() && typeof document.startViewTransition === 'function';
  const narrow = () => matchMedia('(max-width: 860px)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  const SLUGS = Object.keys(ED), HOME = ['sillage', 'fluency', 'trackcurator'], TABS = ['cuisine', 'piano', 'photo', 'dj', 'maths'];
  const PAPER = new Set(['about', 'skills', 'interests', 'galerie', 'cv']);
  const SKILLS = ['python', 'c', 'js', 'sql', 'html', 'ds', 'complexity', 'matplotlib'];
  const REST = .08, SHOW = .52, OUT = .58;   // part du disque visible : au repos, en présentation, en butée
  let lang = store.get('am-lang') === 'en' ? 'en' : 'fr';
  let cur = null, navClick = false, navDir = 0, homeSlug = 'sillage', lbPushed = false, lbFocus = null;
  let cursorOff = () => {}, cursorRefresh = () => {};
  const mem = {};                             // position de défilement par destination
  const t = k => I18N[lang][k];
  const setKey = (el, k) => { el.dataset.i18n = k; el.innerHTML = t(k); };

  /* ── 2. Langue : on remplace les textes sans relancer d'animation ── */
  function applyLang(l) {
    lang = l; root.lang = l;
    const d = I18N[l];
    $$('[data-i18n]').forEach(el => { const v = d[el.dataset.i18n]; if (v != null) el.innerHTML = v; });
    $$('[data-i18n-attr]').forEach(el => { const [attr, k] = el.dataset.i18nAttr.split(':'); el.setAttribute(attr, (el.dataset.altHead || '') + d[k] + (el.dataset.altTail || '')); });
    $$('[data-spec]').forEach(el => {
      el.innerHTML = d[el.dataset.spec].trim().split('\n').map(line => { const i = line.indexOf(':'); return `<div><dt>${line.slice(0, i).trim()}</dt><dd>${line.slice(i + 1).trim()}</dd></div>`; }).join('');
    });
    renderHome();
    if (cur) { setTitle(cur); if ($('#lb').open) fillLb(cur); }
  }

  // Accueil : sélection, légende et lien viennent du même état (homeSlug + langue)
  function renderHome() {
    $$('[data-pick]').forEach(b => b.setAttribute('aria-pressed', b.dataset.pick === homeSlug));
    setKey($('#home-cap'), 'home_cap_' + homeSlug);
    const a = $('#home-open'); a.href = '#projet/' + homeSlug; a.firstElementChild.textContent = t('home_open').replace('{n}', ED[homeSlug].short);
  }

  // CV : la rangée anglaise devient un vrai téléchargement dès que CV.en est renseigné
  function renderCV() {
    const a = $('#cv-fr'); a.href = CV.fr;
    if (CV.en) $('#cv-en').innerHTML = `<a href="${CV.en}" download><span data-i18n="cv_dl_en">${t('cv_dl_en')}</span>${$('svg', a).outerHTML}</a>`;
  }

  /* ── 3. L'objet : pochette + disque ── */
  const getF = o => parseFloat(o.style.getPropertyValue('--f')) || 0;
  function setF(o, f) {
    const before = getF(o);
    o.style.setProperty('--f', f);
    if (f - before > .2 && o.dataset.slug === 'sillage' && !still()) { o.classList.remove('sheen'); void o.offsetWidth; o.classList.add('sheen'); }
    const btn = o.closest('.ed') && $('.pull', o.closest('.ed'));
    if (btn) { const out = f > .3; btn.setAttribute('aria-pressed', out); setKey(btn.firstElementChild, out ? 'pull_in' : 'pull_out'); }
  }

  // Traction directe : le bord du disque reste sous le doigt, puis rejoint le repos ou la butée
  function bindDrag(o) {
    let d = null;
    o.setAttribute('data-drag', '');
    o.addEventListener('pointerdown', e => { if (e.button === 0) d = { id: e.pointerId, x: e.clientX, y: e.clientY, start: getF(o), moved: false, lastX: e.clientX, lastT: e.timeStamp, v: 0 }; });
    o.addEventListener('pointermove', e => {
      if (!d || e.pointerId !== d.id) return;
      const dx = e.clientX - d.x, dy = e.clientY - d.y;
      if (!d.moved) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        if (Math.abs(dy) > Math.abs(dx)) { d = null; return; }       // geste vertical : on laisse défiler
        d.moved = true; o.classList.add('drag');
        try { o.setPointerCapture(e.pointerId); } catch (err) {}
      }
      d.v = (e.clientX - d.lastX) / Math.max(1, e.timeStamp - d.lastT); d.lastX = e.clientX; d.lastT = e.timeStamp;
      setF(o, clamp(d.start + dx / (o.offsetWidth * .97), 0, .66));
    });
    const end = (e, cancel) => {
      if (!d || e.pointerId !== d.id) return;
      const { start, moved, v } = d; d = null; o.classList.remove('drag');
      const f = getF(o);
      setF(o, cancel ? start : !moved ? (start > .3 ? REST : OUT) : (v > .35 || (f > .33 && v > -.35)) ? OUT : REST);
    };
    o.addEventListener('pointerup', e => end(e, false));
    o.addEventListener('pointercancel', e => end(e, true));
    o.addEventListener('lostpointercapture', e => end(e, true));
    o.addEventListener('dragstart', e => e.preventDefault());
  }

  function setEdition(o, slug) {
    const e = ED[slug], [disc, cover] = $$('img', o);
    o.dataset.slug = slug;
    for (const [im, k] of [[disc, 'vinyle'], [cover, 'pochette']]) { im.srcset = `collection/${e.file}-${k}-640.webp 640w, collection/${e.file}-${k}.webp 1254w`; im.src = `collection/${e.file}-${k}-640.webp`; }
    cover.dataset.altTail = ` ${e.code}, ${e.short}`; cover.alt = t('alt_cover') + cover.dataset.altTail;
  }
  function preload(slug) {
    const e = ED[slug], sizes = $('#home-stage img').sizes;
    for (const k of ['pochette', 'vinyle']) { const im = new Image(); im.sizes = sizes; im.srcset = `collection/${e.file}-${k}-640.webp 640w, collection/${e.file}-${k}.webp 1254w`; }
  }

  // Changement d'édition : le disque rentre, les deux pochettes se croisent, le nouveau disque sort
  function cancelSwap(stage) {
    const s = stage._swap; if (!s) return;
    clearTimeout(s.timer); s.a1.cancel(); s.a2.cancel(); s.ghost.remove(); s.obj.classList.remove('drag'); stage._swap = null;
  }
  function slideSwap(stage, ghost, o, dir, f) {
    cancelSwap(stage);
    if (still()) { setF(o, f); return; }
    ghost.classList.add('ghost'); ghost.removeAttribute('data-drag');
    ghost.style.top = o.offsetTop + 'px'; ghost.style.left = o.offsetLeft + 'px'; ghost.style.setProperty('--s', o.offsetWidth + 'px');
    stage.append(ghost);
    // côté droit : la pochette sort ou entre par le bord de l'écran ; côté gauche : court glissement et fondu, sans passer sur le texte
    const far = innerWidth - o.getBoundingClientRect().left + 24, near = o.offsetWidth * .28;
    const opt = { duration: 280, delay: 90, easing: 'cubic-bezier(.3, .7, .2, 1)', fill: 'both' };
    const short = [{ transform: 'translateX(0)', opacity: 1 }, { transform: `translateX(${-near}px)`, opacity: 0 }], long = [{ transform: 'translateX(0)' }, { transform: `translateX(${far}px)` }];
    o.classList.add('drag'); setF(o, 0);
    requestAnimationFrame(() => ghost.style.setProperty('--f', REST));
    const a1 = ghost.animate(dir > 0 ? short : long, opt);
    const a2 = o.animate((dir > 0 ? long : short).slice().reverse(), opt);
    const timer = setTimeout(() => { o.classList.remove('drag'); setF(o, f); }, 300);
    stage._swap = { a1, a2, ghost, obj: o, timer };
    a2.finished.then(() => { if (stage._swap && stage._swap.a2 === a2) { ghost.remove(); a1.cancel(); a2.cancel(); stage._swap = null; } }).catch(() => {});
  }

  function pickHome(slug, dir) {
    if (slug === homeSlug) return;
    const stage = $('#home-stage'), o = $('.obj:not(.ghost)', stage);
    cancelSwap(stage);
    const ghost = o.cloneNode(true);
    if (!dir) dir = HOME.indexOf(slug) > HOME.indexOf(homeSlug) ? 1 : -1;
    homeSlug = slug; setEdition(o, slug); renderHome();
    slideSwap(stage, ghost, o, dir, SHOW);
  }

  /* ── 4. Routes et transitions ── */
  function parse(hash) {
    let h = hash.replace(/^#\/?/, ''); try { h = decodeURIComponent(h); } catch (e) {}
    const p = h.split('/');
    if (p[0] === 'projet' && ED[p[1]]) return { view: 'project', slug: p[1], bk: p[2] === 'livret' };
    if (p[0] === 'galerie' || p[0] === 'gallery') { const g = GAL[p[1]] ? p[1] : 'cuisine'; return { view: 'galerie', g, img: GAL[g].some(x => x.id === p[2]) ? p[2] : null }; }
    if (p[0] === 'projects' || p[0] === 'projets') return { view: 'projects' };
    if (p[0] === 'about' || p[0] === 'parcours') return { view: 'about' };
    if (p[0] === 'skills') return { view: 'skills', skill: SKILLS.includes(p[1]) ? p[1] : null };
    if (p[0] === 'cv') return { view: 'cv' };
    if (p[0] === 'interests' || p[0] === 'ailleurs') return { view: 'interests', tab: TABS.includes(p[1]) ? p[1] : 'cuisine' };
    if (p[0] === 'contact') return { view: 'contact' };
    return { view: 'home' };
  }
  const viewEl = r => document.getElementById(r.view === 'project' ? 'projet/' + r.slug : r.view === 'galerie' ? 'galerie/' + r.g : r.view === 'home' ? 'top' : r.view === 'projects' ? 'projects' : r.view);
  const key = r => r.view + '/' + (r.slug || r.g || '') + (r.bk ? '/bk' : '');
  const tone = r => PAPER.has(r.view) ? 'paper' : 'blue';
  function setTitle(r) {
    const base = 'Armand Mulier';
    const name = r.view === 'project' ? ED[r.slug].short : r.view === 'projects' ? t('collection_title') : r.view === 'about' ? t('nav_path') : r.view === 'skills' ? t('nav_skills')
      : r.view === 'interests' ? t('gallery_label') : r.view === 'galerie' ? t(r.g === 'cuisine' ? 'gal_c_title' : 'gal_p_title') : r.view === 'contact' ? t('nav_contact') : r.view === 'cv' ? 'CV' : '';
    document.title = name ? `${name} · ${base}` : `${base} | ${lang === 'fr' ? 'Élève ingénieur ESIEE Paris' : 'Engineering student at ESIEE Paris'}`;
  }

  function show(n, p, user) {
    const el = viewEl(n), same = p && viewEl(p) === el;
    $$('.view.active').forEach(v => { if (v !== el) v.classList.remove('active', 'enter'); });
    el.classList.add('active');
    if (!same) $$('video').forEach(v => v.pause());
    body.dataset.tone = tone(n);
    $('meta[name="theme-color"]').content = tone(n) === 'paper' ? '#f4f0e3' : '#1726b5';
    const navKey = n.view === 'project' ? 'projects' : n.view;
    const menuKey = n.view === 'home' ? 'top' : n.view === 'galerie' ? 'interests' : navKey;
    $$('.nav a, [data-menu]').forEach(a => (a.dataset.nav || a.dataset.menu) === (a.dataset.nav ? navKey : menuKey) ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
    if (n.view === 'project') {
      el.classList.toggle('is-bk', n.bk);
      if (n.bk) lazyVideo(el); else if (!same) setF($('.stage .obj', el), SHOW);
    }
    if (n.view === 'interests') setTab(n.tab, same);
    if (n.view === 'skills') selectSkill(n.skill);
    if (n.view === 'galerie' && n.img) openLb(n); else closeLb();
    if (!same || (n.view === 'project' && p.bk !== n.bk)) scrollTo(0, (n.view === 'projects' || !user) ? (mem[key(n)] || 0) : 0);
    setTitle(n);
    if (p && !same) {
      const back = n.view === 'projects' && p.view === 'project' && $(`.tile[data-slug="${p.slug}"]`);
      if (back) back.focus({ preventScroll: true }); else { el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true }); }
    }
    cursorRefresh();
  }

  function withVT(fn, cls) {
    if (!canVT()) { fn(); return Promise.resolve(); }
    if (cls) root.classList.add(cls);
    const tr = document.startViewTransition(fn);
    tr.ready.catch(() => {});                       // transition interrompue par la suivante : sans conséquence
    return tr.finished.catch(() => {}).finally(() => { if (cls) root.classList.remove(cls); });
  }

  function route(first) {
    const n = parse(location.hash), p = cur, user = navClick, dir = navDir;
    navClick = false; navDir = 0;
    setMenu(false);
    if (p) mem[key(p)] = scrollY;
    cur = n;
    const el = viewEl(n), apply = () => show(n, p, user);
    const enter = () => { el.classList.remove('enter'); void el.offsetWidth; el.classList.add('enter'); };
    if (first || !p) { apply(); return; }
    if (viewEl(p) === el && !(n.view === 'project' && p.bk !== n.bk)) { apply(); return; }       // onglet, visionneuse : même vue
    if (still()) { apply(); return; }

    if (p.view === 'project' && n.view === 'project') {
      if (p.slug === n.slug) {                                                                   // édition ↔ livret
        if (n.bk && !narrow()) openBooklet(el, apply); else { apply(); enter(); }
      } else if (!p.bk && !n.bk) {                                                               // édition → édition
        const ghost = $('.stage .obj', viewEl(p)).cloneNode(true);
        apply(); enter();
        const i = SLUGS.indexOf(p.slug), j = SLUGS.indexOf(n.slug);
        slideSwap($('.stage', el), ghost, $('.stage .obj:not(.ghost)', el), dir || ((j - i + 6) % 6 <= 3 ? 1 : -1), SHOW);
      } else withVT(apply);
      return;
    }
    const pair = (n.view === 'project' && !n.bk && p.view === 'projects') ? [n.slug, true] : (n.view === 'projects' && p.view === 'project' && !p.bk) ? [p.slug, false] : null;
    if (pair && canVT()) {                                                                       // collection ↔ édition : l'objet est partagé
      const tile = $(`.tile[data-slug="${pair[0]}"] .obj`), big = $('.stage .obj', document.getElementById('projet/' + pair[0]));
      const [from, to] = pair[1] ? [tile, big] : [big, tile];
      from.style.viewTransitionName = 'obj';
      withVT(() => { from.style.viewTransitionName = ''; apply(); to.style.viewTransitionName = 'obj'; }).then(() => { to.style.viewTransitionName = ''; });
      return;
    }
    if (canVT()) withVT(apply, (tone(p) !== tone(n) || tone(n) === 'paper') ? 'vt-paper' : ''); else { apply(); enter(); }
  }

  /* ── 5. Livret, démonstrations, vidéo ── */
  // La pochette rejoint le livret, pivote autour de son pli gauche et découvre le papier
  function openBooklet(el, apply) {
    const cv = $('.ed .cv', el), r0 = cv.getBoundingClientRect(), src = $('img', cv).currentSrc || $('img', cv).src;
    apply();
    const ins = $('.insert', el), r1 = ins.getBoundingClientRect();
    const s = r1.height / r0.height, dx = r1.left - r0.left, dy = r1.top - (r0.top + r0.height * (1 - s) / 2);
    const fl = document.createElement('figure');
    fl.className = 'flip'; fl.innerHTML = `<img src="${src}" alt="">`;
    Object.assign(fl.style, { left: r0.left + 'px', top: r0.top + 'px', width: r0.width + 'px', height: r0.height + 'px' });
    body.append(fl);
    const T = `translate(${dx}px, ${dy}px) scale(${s}) perspective(1600px)`;
    fl.animate([{ transform: 'translate(0, 0) scale(1) perspective(1600px) rotateY(0deg)' }, { transform: T + ' rotateY(0deg)', offset: .42 }, { transform: T + ' rotateY(-112deg)' }],
      { duration: 600, easing: 'cubic-bezier(.4, .1, .3, 1)', fill: 'forwards' }).finished.then(() => fl.remove()).catch(() => fl.remove());
    ins.animate([{ opacity: 0 }, { opacity: 0, offset: .34 }, { opacity: 1, offset: .46 }, { opacity: 1 }], { duration: 600 });
    $$('.pg, .d-cta, .d-line', ins).forEach(x => x.animate([{ opacity: 0 }, { opacity: 0, offset: .66 }, { opacity: 1 }], { duration: 660 }));
    $$('.bk-head, .bk-text, .demo-l, .p-bar', el).forEach(x => x.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 0, transform: 'translateY(10px)', offset: .45 }, { opacity: 1, transform: 'none' }], { duration: 620, easing: 'ease-out' }));
  }

  function setupDemos() {
    $$('[data-demo]').forEach(fig => {
      const kind = fig.dataset.demo, btn = $('.d-btn', fig);
      if (kind === 'flash') btn.addEventListener('click', () => {
        const on = fig.classList.toggle('on'); btn.setAttribute('aria-pressed', on); setKey($('.d-status', fig), on ? 'd1_shown' : 'd1_hidden');
      });
      if (kind === 'toggle') btn.addEventListener('click', () => {
        const on = fig.classList.toggle('on'); btn.setAttribute('aria-pressed', on); setKey(btn.firstElementChild, on ? fig.dataset.on : fig.dataset.off);
      });
      if (kind === 'steps') { const tabs = $$('.d-tabs button', fig), steps = $$('.d-step', fig);
        tabs.forEach((b, i) => b.addEventListener('click', () => { tabs.forEach((x, j) => x.setAttribute('aria-pressed', i === j)); steps.forEach((x, j) => x.classList.toggle('on', i === j)); })); }
      if (kind === 'bst') { let timers = [], done = false;                                       // Rechercher 6 : 8 → 4 → 6
        const seq = ['.n8', '.e84', '.n4', '.e46', '.n6'], digits = $$('.d-path b', fig), status = $('.d-status', fig);
        const reset = () => { timers.forEach(clearTimeout); timers = []; $$('.hit', fig).forEach(x => x.classList.remove('hit')); status.textContent = ''; delete status.dataset.i18n; done = false; setKey(btn.firstElementChild, 'd4_btn'); };
        btn.addEventListener('click', () => {
          if (done || timers.length) { reset(); return; }
          const step = still() ? 0 : 280;
          seq.forEach((s, i) => timers.push(setTimeout(() => { $(s, fig).classList.add('hit'); if (i % 2 === 0) digits[i / 2].classList.add('hit'); }, i * step)));
          timers.push(setTimeout(() => { timers = []; done = true; setKey(status, 'd4_done'); setKey(btn.firstElementChild, 'd4_reset'); }, seq.length * step));
        }); }
    });
  }

  // Vidéo Fluency : chargée à l'ouverture du livret ; si le fichier manque, le texte de repli reste
  function lazyVideo(el) {
    const v = $('video[data-src]', el); if (!v || v.dataset.tried) return;
    v.dataset.tried = '1';
    v.addEventListener('loadedmetadata', () => { v.hidden = false; const n = $('.video-note', el); if (n) n.hidden = true; }, { once: true });
    v.preload = 'metadata'; v.src = v.dataset.src;
  }

  /* ── 6. Ailleurs, compétences, galeries, contact ── */
  function setTab(k, animate) {
    $$('.tabs a').forEach(a => { const on = a.id === 'tab-' + k; a.setAttribute('aria-selected', on); a.tabIndex = on ? 0 : -1; });
    $$('.pr').forEach(p => { const on = p.id === 'pr-' + k, was = p.classList.contains('on'); p.classList.toggle('on', on);
      if (on && !was && animate && !still()) p.animate([{ opacity: 0, transform: 'translateX(14px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.2, .72, .15, 1)' }); });
  }

  // Compétences : une compétence ouvre ses projets (clic, Entrée ou Espace) ; l'adresse #skills/python est partageable
  function selectSkill(id) {
    const panel = $('#skx'), btn = id && $(`.sk-link[data-skill="${id}"]`);
    $$('.sk-link').forEach(b => b.setAttribute('aria-expanded', b === btn));
    $$('.skx-g').forEach(g => g.classList.toggle('on', g.dataset.skill === id));
    panel.classList.toggle('open', !!btn);
    if (btn && narrow()) btn.closest('.sk-col').after(panel); else $('.sk').append(panel);   // sur mobile, les exemples viennent près de la compétence
  }
  function setupSkills() {
    $$('.sk-link').forEach(b => b.addEventListener('click', () => {
      const id = b.getAttribute('aria-expanded') === 'true' ? null : b.dataset.skill;
      history.replaceState(null, '', id ? '#skills/' + id : '#skills'); cur = { view: 'skills', skill: id }; selectSkill(id);
    }));
  }

  // Visionneuse : une destination par image, compteur, précédent / suivant, Échap, balayage
  const lb = $('#lb');
  function fillLb(r) {
    const items = GAL[r.g], i = items.findIndex(x => x.id === r.img), it = items[i], img = $('#lb-img');
    const thumb = $(`a[data-img="${it.id}"] img`, viewEl(r));
    img.style.background = `url("${thumb.currentSrc || thumb.src}") center / cover`;
    img.width = it.w; img.height = it.h; img.src = it.src; img.alt = it.alt ? t(it.alt) : it.cap;
    $('#lb-cap').textContent = $('.cap', thumb.closest('a')).textContent;
    $('#lb-count').textContent = String(i + 1).padStart(2, '0') + ' / ' + items.length;
    lbFocus = thumb.closest('a');                 // à la fermeture, le focus revient sur la vignette du tirage affiché
    return thumb;
  }
  function openLb(r) {
    if (lb.open) { fillLb(r); return; }
    cursorOff();
    const thumb = $(`a[data-img="${r.img}"] img`, viewEl(r)), img = $('#lb-img');
    lbFocus = thumb.closest('a');
    if (canVT()) {
      thumb.style.viewTransitionName = 'shot';
      withVT(() => { thumb.style.viewTransitionName = ''; fillLb(r); lb.showModal(); img.style.viewTransitionName = 'shot'; }).then(() => { img.style.viewTransitionName = ''; });
    } else { fillLb(r); lb.showModal(); }
  }
  function closeLb() {
    if (!lb.open) return;
    const done = () => { lb.close(); if (lbFocus) lbFocus.focus({ preventScroll: true }); };
    const thumb = lbFocus && $('img', lbFocus), img = $('#lb-img');
    if (canVT() && thumb) {
      img.style.viewTransitionName = 'shot';
      withVT(() => { img.style.viewTransitionName = ''; done(); thumb.style.viewTransitionName = 'shot'; }).then(() => { thumb.style.viewTransitionName = ''; });
    } else done();
  }
  const leaveLb = () => { if (lbPushed) { lbPushed = false; history.back(); } else { history.replaceState(null, '', '#galerie/' + cur.g); route(); } };
  function stepLb(d) {
    const items = GAL[cur.g], i = items.findIndex(x => x.id === cur.img);
    history.replaceState(null, '', `#galerie/${cur.g}/${items[(i + d + items.length) % items.length].id}`); route();
  }
  function setupLb() {
    lb.addEventListener('cancel', e => { e.preventDefault(); leaveLb(); });
    $('#lb-close').addEventListener('click', leaveLb);
    $$('.lb-arrow').forEach(b => b.addEventListener('click', () => stepLb(+b.dataset.step)));
    lb.addEventListener('keydown', e => { if (e.key === 'ArrowRight') stepLb(1); if (e.key === 'ArrowLeft') stepLb(-1); });
    const stage = $('.lb-stage'); let sx = null;
    stage.addEventListener('pointerdown', e => { sx = e.clientX; });
    stage.addEventListener('pointerup', e => { if (sx == null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 50) stepLb(dx < 0 ? 1 : -1); else if (e.target === stage) leaveLb(); });
    stage.addEventListener('pointercancel', () => { sx = null; });
  }

  function setupCopy() {
    $$('.copy').forEach(b => b.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(b.dataset.copy); } catch (e) { return; }           // « Copié » seulement après une écriture réussie
      const status = $('#copy-status');
      b.classList.add('done'); setKey(b, 'copied'); setKey(status, 'copied');
      setTimeout(() => { b.classList.remove('done'); setKey(b, 'copy'); status.textContent = ''; delete status.dataset.i18n; }, 1800);
    }));
  }

  /* ── 7. Menu, clavier, démarrage ── */
  const menuBtn = $('#menu-btn'), menu = $('#menu');
  function setMenu(open, focus) {
    if (root.classList.contains('menu-open') === open) return;
    root.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', open); menu.inert = !open;
    setKey(menuBtn.firstElementChild, open ? 'close' : 'menu');
    body.style.overflow = open ? 'hidden' : '';
    if (open) $('.menu-list a', menu).focus({ preventScroll: true }); else if (focus) menuBtn.focus();
    cursorRefresh();
  }

  // Curseur : calque décoratif, actif seulement avec une vraie souris ; le point suit sans retard, la forme dit le geste possible
  function setupCursor() {
    const el = $('#cur'), fine = matchMedia('(hover: hover) and (pointer: fine)'), forced = matchMedia('(forced-colors: active)');
    let x = 0, y = 0, raf = 0, active = false, target = null, down = false;
    const off = () => { if (!active) return; active = false; root.classList.remove('has-cursor'); el.classList.remove('on'); };
    const stateOf = n => {
      if (!n || !n.closest) return 'dot';
      if (n.closest('video, input, textarea, select, .sel')) return 'native';
      const o = n.closest('[data-drag]'); if (o) return down || o.classList.contains('drag') ? 'hold' : 'drag';
      if (n.closest('a[data-img]')) return 'plus';
      if (n.closest('a[href]')) return 'link';
      const b = n.closest('button, summary'); return b && !b.disabled ? 'btn' : 'dot';
    };
    const toneOf = n => {                                   // couleur d'après la surface locale (carte ivoire dans Contact bleu, livret, menu…)
      const s = n && n.closest && n.closest('.insert, .tone-paper, .media, #menu, #hd');
      if (!s) return body.dataset.tone;
      if (s.id === 'hd') return root.classList.contains('menu-open') ? 'blue' : body.dataset.tone;
      return s.matches('.insert, .tone-paper') ? 'paper' : 'blue';
    };
    const paint = () => {
      raf = 0; if (!active) return;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const st = stateOf(target);
      if (st === 'native') { el.classList.remove('on'); return; }
      el.dataset.s = st; el.dataset.tone = st === 'drag' || st === 'hold' ? 'blue' : toneOf(target); el.classList.add('on');
    };
    const ask = () => { if (!raf) raf = requestAnimationFrame(paint); };
    addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      if (!fine.matches || forced.matches || still() || lb.open) { off(); return; }
      x = e.clientX; y = e.clientY; target = e.target;
      if (!active) { active = true; root.classList.add('has-cursor'); }
      ask();
    }, { passive: true });
    addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') { off(); return; } down = true; target = e.target; ask(); }, { passive: true });
    const up = () => { if (!down) return; down = false; if (active) { target = document.elementFromPoint(x, y); ask(); } };
    addEventListener('pointerup', up, { passive: true }); addEventListener('pointercancel', up, { passive: true });
    document.documentElement.addEventListener('mouseleave', off);
    addEventListener('blur', off); document.addEventListener('visibilitychange', off);
    addEventListener('keydown', e => { if (['Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) off(); });
    addEventListener('scroll', () => { if (active && !down) { target = document.elementFromPoint(x, y); ask(); } }, { passive: true });
    cursorOff = off;
    cursorRefresh = () => { if (active) requestAnimationFrame(() => { if (lb.open) off(); else { target = document.elementFromPoint(x, y); ask(); } }); };
  }

  function start() {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (lang !== 'fr') applyLang(lang);
    $$('.stage .obj').forEach(bindDrag);
    setupDemos(); setupSkills(); setupLb(); setupCopy(); setupCursor(); renderCV();

    // reflet qui suit le pointeur, borné à la pochette
    if (matchMedia('(hover: hover)').matches) document.addEventListener('pointermove', e => {
      const o = e.target.closest && e.target.closest('.obj'); if (!o) return;
      const r = o.getBoundingClientRect();
      o.style.setProperty('--mx', clamp((e.clientX - r.left) / r.width * 100, 0, 100) + '%'); o.style.setProperty('--my', clamp((e.clientY - r.top) / r.height * 100, 0, 100) + '%');
    }, { passive: true });

    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (a) { navClick = true; navDir = +a.dataset.dir || 0; lbPushed = !!a.dataset.img; setMenu(false); setTimeout(() => { navClick = false; }, 150);
        if (a.getAttribute('href') === '#top' && cur && cur.view === 'home') scrollTo({ top: 0, behavior: still() ? 'auto' : 'smooth' }); return; }
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.pick) pickHome(b.dataset.pick);
      else if (b.matches('.pull')) { const o = $('.stage .obj', b.closest('.ed')); setF(o, getF(o) > .3 ? REST : OUT); }
      else if (b.matches('.play')) { const v = $('video', b.closest('.bk-paper')); v.scrollIntoView({ block: 'center', behavior: still() ? 'auto' : 'smooth' }); v.play().catch(() => {}); }
      else if (b.matches('[data-lang]')) { const l = lang === 'fr' ? 'en' : 'fr'; store.set('am-lang', l); applyLang(l); }
      else if (b === menuBtn) setMenu(!root.classList.contains('menu-open'), true);
      else if (b.matches('.menu-close')) setMenu(false, true);
    });

    document.addEventListener('keydown', e => {
      if (e.altKey || e.ctrlKey || e.metaKey || lb.open) return;
      if (e.key === 'Escape') {
        if (root.classList.contains('menu-open')) setMenu(false, true);
        else if (cur.view === 'project' && cur.bk) { navClick = true; location.hash = '#projet/' + cur.slug; }
        return;
      }
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d || root.classList.contains('menu-open')) return;
      const tab = e.target.closest && e.target.closest('[role="tablist"]');
      if (tab) { const k = TABS[(TABS.indexOf(cur.tab) + d + 5) % 5]; history.replaceState(null, '', '#interests/' + k); route(); $('#tab-' + k).focus(); e.preventDefault(); return; }
      if (e.target.closest && e.target.closest('.insert, video, input, textarea')) return;
      if (cur.view === 'home') { pickHome(HOME[(HOME.indexOf(homeSlug) + d + 3) % 3], d); e.preventDefault(); }
      if (cur.view === 'project' && !cur.bk) { navClick = true; navDir = d; location.hash = '#projet/' + SLUGS[(SLUGS.indexOf(cur.slug) + d + 6) % 6]; e.preventDefault(); }
    });

    // balayage horizontal dans la zone du sélecteur : édition précédente / suivante
    const swipe = (el, cb) => { let x = null;
      el.addEventListener('pointerdown', e => { x = e.clientX; });
      el.addEventListener('pointerup', e => { if (x != null && Math.abs(e.clientX - x) > 40) cb(e.clientX < x ? 1 : -1); x = null; });
      el.addEventListener('pointercancel', () => { x = null; }); el.style.touchAction = 'pan-y'; };
    swipe($('.pick'), d => pickHome(HOME[(HOME.indexOf(homeSlug) + d + 3) % 3], d));
    $$('.pn').forEach(el => swipe(el, d => { navClick = true; navDir = d; location.hash = '#projet/' + SLUGS[(SLUGS.indexOf(cur.slug) + d + 6) % 6]; }));

    addEventListener('hashchange', () => route());
    route(true);

    // premier écran : la pochette et les liens sont peints, puis le disque sort
    const home = $('#home-stage .obj');
    if (cur.view === 'home' && !still()) { $('#top').classList.add('enter'); requestAnimationFrame(() => requestAnimationFrame(() => setF(home, SHOW))); } else setF(home, SHOW);
    const idle = window.requestIdleCallback || (f => setTimeout(f, 600));
    idle(() => HOME.slice(1).forEach(preload));
  }

  start();
})();
