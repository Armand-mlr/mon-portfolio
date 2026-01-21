document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. DONNÉES AUTOMATISÉES (Ajoute tes photos ici) ---
    const portfolioData = [
        // CUISINE (Sucré)
        { src: "photos/Profiteroles1.jpg", type: "cuisine", category: "sweet", alt: "Profiteroles" },
        { src: "photos/BabaRhum1.jpg", type: "cuisine", category: "sweet", alt: "Baba au Rhum" },
        { src: "photos/Fraisier.jpg", type: "cuisine", category: "sweet", alt: "Fraisier" },
        { src: "photos/Profiteroles2.jpg", type: "cuisine", category: "sweet", alt: "Profiteroles Duo" },
        { src: "photos/BabaRhum2.jpg", type: "cuisine", category: "sweet", alt: "Baba au Rhum 2" },
        
        // CUISINE (Salé)
        { src: "photos/CoteBoeuf.jpg", type: "cuisine", category: "salty", alt: "Côte de Boeuf" },
        { src: "photos/VeauMarengo.jpg", type: "cuisine", category: "salty", alt: "Veau Marengo" },
        { src: "photos/SaladeCesar.jpg", type: "cuisine", category: "salty", alt: "Salade César" },
        { src: "photos/patesTomates.jpg", type: "cuisine", category: "salty", alt: "Pâtes Tomates" },
        { src: "photos/CoteBoeuf2.jpg", type: "cuisine", category: "salty", alt: "Côte de Boeuf 2" },
        { src: "photos/carbonara.jpg", type: "cuisine", category: "salty", alt: "Carbonara" },
        { src: "photos/Burger.jpg", type: "cuisine", category: "salty", alt: "Burger Maison" },

        // PHOTOS (Personnes)
        { src: "photos/portrait.jpg", type: "photo", category: "personnes", alt: "Portrait N&B" },
        { src: "photos/portrait2.jpg", type: "photo", category: "personnes", alt: "Portrait Couleur" },
        { src: "photos/crique.jpg", type: "photo", category: "personnes", alt: "Crique en été" },

        // PHOTOS (Décor)
        { src: "photos/sapin.jpg", type: "photo", category: "decor", alt: "Sapin de Noël" },
        { src: "photos/debarcadere.jpg", type: "photo", category: "decor", alt: "Débarcadère" },
        { src: "photos/porsche.jpg", type: "photo", category: "decor", alt: "Porsche Classique" },
        { src: "photos/bateau.jpg", type: "photo", category: "decor", alt: "Bateau sur l'eau" },
        { src: "photos/cinema.jpg", type: "photo", category: "decor", alt: "Cinéma" },
        { src: "photos/etoile.jpg", type: "photo", category: "decor", alt: "Étoile de nuit" },
        { src: "photos/escalier.jpg", type: "photo", category: "decor", alt: "Architecture Escalier" },
        { src: "photos/fete.jpg", type: "photo", category: "decor", alt: "Ambiance Fête" },
        { src: "photos/petrole.jpg", type: "photo", category: "decor", alt: "Reflets Pétrole" },
        { src: "photos/adresse.jpg", type: "photo", category: "decor", alt: "Rue de Paris" },
        { src: "photos/mer.jpg", type: "photo", category: "decor", alt: "Horizon Mer" }
    ];

    // --- 2. GESTION DES FILTRES ET DE L'AFFICHAGE ---
    const galleryGrid = document.getElementById('gallery-grid');
    const subFiltersContainer = document.getElementById('sub-filters');
    const mainButtons = document.querySelectorAll('.segment-btn');

    let currentMainFilter = 'all'; // 'all', 'cuisine', 'photo'
    let currentSubFilter = 'all';  // 'all', 'sweet', 'salty', 'personnes', 'decor'

    // Initialisation
    renderGallery();

    // Clic sur les boutons principaux (Tout / Cuisine / Photos)
    mainButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Active Visual Class
            mainButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Logic
            currentMainFilter = btn.dataset.filter;
            currentSubFilter = 'all'; // Reset sub-filter when changing main category
            
            updateSubFiltersUI(); // Affiche les bons sous-filtres
            renderGallery();      // Affiche les images
        });
    });

    // Fonction pour afficher les sous-filtres dynamiquement
    function updateSubFiltersUI() {
        subFiltersContainer.innerHTML = ''; // Clear existing

        if (currentMainFilter === 'all') return; // Pas de sous-filtres pour "Tout"

        let options = [];
        if (currentMainFilter === 'cuisine') {
            options = [
                { key: 'all', labelKey: 'all', default: 'Tous' },
                { key: 'sweet', labelKey: 'sweet', default: 'Sucré' },
                { key: 'salty', labelKey: 'salty', default: 'Salé' }
            ];
        } else if (currentMainFilter === 'photo') {
            options = [
                { key: 'all', labelKey: 'toutes', default: 'Toutes' },
                { key: 'personnes', labelKey: 'personnes', default: 'Personnes' },
                { key: 'decor', labelKey: 'decor', default: 'Décor' }
            ];
        }

        // Création des boutons HTML
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = `sub-pill ${opt.key === 'all' ? 'active' : ''}`;
            btn.dataset.key = opt.labelKey;
            btn.textContent = translations[currentLanguage][opt.labelKey] || opt.default; // Traduction immédiate
            
            btn.addEventListener('click', () => {
                document.querySelectorAll('.sub-pill').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                currentSubFilter = opt.key;
                renderGallery();
            });
            subFiltersContainer.appendChild(btn);
        });
    }

    // Fonction principale : Affiche les images selon les filtres
    function renderGallery() {
        galleryGrid.innerHTML = ''; // Clear grid

        const filteredData = portfolioData.filter(item => {
            // 1. Filtre Principal
            const matchMain = currentMainFilter === 'all' || item.type === currentMainFilter;
            // 2. Sous-Filtre (si applicable)
            const matchSub = currentSubFilter === 'all' || item.category === currentSubFilter;
            
            return matchMain && matchSub;
        });

        filteredData.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.style.animationDelay = `${index * 50}ms`; // Effet cascade

            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.alt;
            
            // Clic pour Lightbox
            div.addEventListener('click', () => openLightbox(item.src));

            div.appendChild(img);
            galleryGrid.appendChild(div);
        });
    }


    // --- 3. LIGHTBOX LOGIC ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('close-lightbox');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');

    // On récupère la liste des images ACTUELLEMENT affichées pour la navigation prev/next
    function getCurrentImages() {
        return Array.from(document.querySelectorAll('.gallery-item img')).map(img => img.src);
    }

    function openLightbox(src) {
        lightbox.style.display = 'flex';
        lightboxImg.src = src;
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
    }

    function navigate(direction) {
        const currentImages = getCurrentImages();
        const currentSrc = lightboxImg.src.replace(window.location.origin + '/', ''); // Nettoyage parfois nécessaire selon navigateur
        
        // On cherche l'index partiel (car src peut être absolue ou relative)
        let index = currentImages.findIndex(s => s.includes(lightboxImg.getAttribute('src')));
        
        // Si introuvable (bug chemin), on tente une correspondance exacte
        if(index === -1) index = currentImages.indexOf(lightboxImg.src);

        let newIndex = index + direction;
        if (newIndex < 0) newIndex = currentImages.length - 1;
        if (newIndex >= currentImages.length) newIndex = 0;

        lightboxImg.src = currentImages[newIndex];
    }

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if(e.target === lightbox) closeLightbox() });
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });
    
    // Clavier
    document.addEventListener('keydown', (e) => {
        if(lightbox.style.display === 'flex') {
            if(e.key === 'Escape') closeLightbox();
            if(e.key === 'ArrowLeft') navigate(-1);
            if(e.key === 'ArrowRight') navigate(1);
        }
    });


    // --- 4. TRADUCTIONS & MODE SOMBRE (Code standardisé) ---
    const modeToggle = document.getElementById("mode-toggle");
    const languageSwitcher = document.getElementById("language-switcher");
    let currentLanguage = localStorage.getItem('language') || 'fr';
    
    // Check Dark Mode
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add("dark-mode");
        modeToggle.textContent = "🌞";
    }

    modeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        modeToggle.textContent = isDark ? "🌞" : "🌙";
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    });

    const translations = {
        fr: {
            language: "English", cv: "Mon CV", pagePrincipale: "Accueil",
            realisations: "Mes Réalisations", introGallery: "Une collection de moments et de saveurs.",
            toutes: "Tout", plats: "Cuisine", photographies: "Photos",
            sweet: 'Sucré', salty: 'Salé', all: 'Tous',
            personnes: 'Personnes', decor: 'Décor'
        },
        en: {
            language: "Français", cv: "My Resume", pagePrincipale: "Home",
            realisations: "My Achievements", introGallery: "A collection of moments and flavors.",
            toutes: "All", plats: "Cooking", photographies: "Photos",
            sweet: 'Sweet', salty: 'Salty', all: 'All',
            personnes: 'People', decor: 'Scenery'
        }
    };

    function translatePage(lang) {
        document.querySelectorAll("[data-key]").forEach(el => {
            const key = el.dataset.key;
            if (translations[lang][key]) el.textContent = translations[lang][key];
        });
        languageSwitcher.textContent = translations[lang].language;
        
        // Update dynamic filter texts if they exist
        updateSubFiltersUI();
    }

    translatePage(currentLanguage);

    languageSwitcher.addEventListener('click', () => {
        currentLanguage = currentLanguage === 'fr' ? 'en' : 'fr';
        translatePage(currentLanguage);
        localStorage.setItem('language', currentLanguage);
    });
});
