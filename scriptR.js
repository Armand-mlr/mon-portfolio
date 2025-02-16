document.addEventListener("DOMContentLoaded", () => {

    const modeToggle = document.getElementById("mode-toggle");
    const body = document.body;

    // Récupère les préférences enregistrées dans le localStorage pour le mode sombre/clair
    const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';

    // Applique le mode sombre/clair dès le chargement
    if (darkModeEnabled) {
        body.classList.add("dark-mode");
        modeToggle.textContent = "🌞"; // Icône de soleil
    } else {
        body.classList.remove("dark-mode");
        modeToggle.textContent = "🌙"; // Icône de lune
    }

    // Gestion du mode sombre/clair avec sauvegarde dans le localStorage
    modeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");

        // Met à jour l'icône et enregistre l'état dans localStorage
        if (body.classList.contains("dark-mode")) {
            modeToggle.textContent = "🌞"; // Icône de soleil
            localStorage.setItem('darkMode', 'enabled');
        } else {
            modeToggle.textContent = "🌙"; // Icône de lune
            localStorage.setItem('darkMode', 'disabled');
        }
    });

// Texte en français et anglais
const translations = {
    en: {
        language: "Français",
        cv:"My Curriculum",
        pagePrincipale:"Main Page",
        realisations:"Achievements",
        plats:"My meals",
        photographies:"My favorites photographs",
        sweet:'Sweet',
        all:'All',
        salty:'Salty',
        personnes:'People',
        decor:'Scenery',
        toutes:'All'
    },
    fr: {
        language: "English",
        cv:"Mon CV",
        pagePrincipale:"PagePrincipale",
        realisations:"Réalisations",
        plats:"Mes plats",
        photographies:"Mes photographies favorites",
        sweet:'Sucré',
        all:'Tous',
        salty:'Salé',
        personnes:'Personnes',
        decor:'Décor',
        toutes:'Toutes'
    }
};

    const languageSwitcher = document.getElementById('language-switcher');

    // Récupère la langue sauvegardée ou utilise 'fr' comme langue par défaut
    let currentLanguage = localStorage.getItem('language') || 'fr';

    // Fonction pour traduire la page
    function translatePage(lang) {
        document.querySelectorAll("[data-key]").forEach(element => {
            const key = element.getAttribute("data-key");
            if (key && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
    }

    // Applique les traductions dès le chargement de la page
    translatePage(currentLanguage);

    // Met à jour le texte du bouton de changement de langue
    languageSwitcher.textContent = translations[currentLanguage].language;

    // Gestionnaire de clic pour alterner entre 'fr' et 'en'
    languageSwitcher.addEventListener('click', () => {
        // Alterne entre 'fr' et 'en'
        currentLanguage = currentLanguage === 'fr' ? 'en' : 'fr';

        // Applique la traduction et met à jour le localStorage
        translatePage(currentLanguage);
        localStorage.setItem('language', currentLanguage);

        // Met à jour le texte du bouton de changement de langue
        languageSwitcher.textContent = translations[currentLanguage].language;
    });

    const sweetbutton = document.getElementById('sweet');
    const allbutton = document.getElementById('all');
    const saltybutton = document.getElementById('salty');
    const peoplebutton = document.getElementById('personnes');
    const all2button = document.getElementById('toutes');
    const scenerybutton = document.getElementById('decor');
    let currenttypemeals = "all"; 
    let currenttypephotos = "all"; // Utilise 'let' pour pouvoir modifier cette variable

    sweetbutton.addEventListener('click', () => {
        currenttypemeals = "sweet";  // Ici, on met à jour currenttypemeals
        filterGallery(currenttypemeals);
    });

    allbutton.addEventListener('click', () => {
        currenttypemeals = "all";  // Ici aussi
        filterGallery(currenttypemeals);
    });

    saltybutton.addEventListener('click', () => {
        currenttypemeals = "salty";  // Et ici également
        filterGallery(currenttypemeals);
    });

    peoplebutton.addEventListener('click', () => {
        currenttypephotos = "personnes";  // Et ici également
        filterGallery(currenttypephotos);
    });

    all2button.addEventListener('click', () => {
        currenttypephotos = "all";  // Et ici également
        filterGallery(currenttypephotos);
    });

    scenerybutton.addEventListener('click', () => {
        currenttypephotos = "decor";  // Et ici également
        filterGallery(currenttypephotos);
    });

    function filterGallery(category) {
        const photos = document.querySelectorAll('.photo');
        photos.forEach(photo => {
            if (category === 'all' || photo.getAttribute('data-category') === category) {
                photo.style.display = 'block';
            } else {
                photo.style.display = 'none';
            }
        });
    }

    const allThemeButton = document.getElementById('allThemeButton');
    const photographiesThemeButton = document.getElementById('photographiesThemeButton');
    const mealsThemeButton = document.getElementById('mealsThemeButton');
    let currentTheme = 'photographies';

    allThemeButton.addEventListener('click', () => {
        currentTheme = "all";
        majbuttons(allThemeButton.id)
        applyFilter(currentTheme);
    });

    photographiesThemeButton.addEventListener('click', () => {
        currentTheme = "photographies";
        majbuttons(photographiesThemeButton.id)  
        applyFilter(currentTheme);
    });

    mealsThemeButton.addEventListener('click', () => {
        currentTheme = "cuisine";
        majbuttons(mealsThemeButton.id)  
        applyFilter(currentTheme);
    });

    function majbuttons(id) {
        let activeButton = document.querySelector(".theme-button.active"); 
        let currentThemeButton = document.getElementById(id); 
        if (activeButton) {
            activeButton.classList.remove("active"); 
        }
        currentThemeButton.classList.add("active");
    }

    function applyFilter(filter) {
        let galleryItems = document.querySelectorAll('.gallery');
    
        galleryItems.forEach(element => {  
            if (filter === "all" || element.id === filter) {
                element.style.display = "block"; 
            } else {
                element.style.display = "none";
            }
        });
    }

    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.getElementById("close");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");

    const images = document.querySelectorAll(".photo img");
    let currentIndex = 0;
    let imagesList = []; // Contiendra les images filtrées de la galerie sélectionnée

    function updateImageList() {
        const gallery = document.getElementById(currentTheme); // Sélectionne la galerie actuelle
        if (!gallery) return; // Vérifie si la galerie existe
    
        imagesList = Array.from(gallery.querySelectorAll(".photo img")); // Stocke seulement les images visibles
    }

    images.forEach((img) => {
        img.addEventListener("click", () => {
            updateImageList(); // Met à jour la liste des images du bon thème
            if (imagesList.length === 0) return; // Si aucune image n'est trouvée, on ne fait rien
    
            currentIndex = imagesList.indexOf(img); // Récupère l'index de l'image sélectionnée
            if (currentIndex === -1) return; // Empêche l'ouverture si l'image n'est pas trouvée
    
            lightbox.style.display = "flex";
            lightboxImg.src = imagesList[currentIndex].src;
        });
    });

    // Fermer la lightbox
    closeBtn.addEventListener("click", () => {
        lightbox.style.display = "none";
    });

    // Navigation entre les images
    function showImage(index) {
        if (imagesList.length === 0) return; // Vérifie qu'il y a des images à afficher
    
        if (index < 0) {
            index = imagesList.length - 1;
        } else if (index >= imagesList.length) {
            index = 0;
        }
        
        lightboxImg.src = imagesList[index].src;
        currentIndex = index;
    }

    prevBtn.addEventListener("click", () => showImage(currentIndex - 1));
    nextBtn.addEventListener("click", () => showImage(currentIndex + 1));

    // Fermer la lightbox en cliquant à l'extérieur de l'image
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = "none";
        }
    });

    // Navigation avec les flèches du clavier
    document.addEventListener("keydown", (e) => {
        if (lightbox.style.display === "flex") {
            if (e.key === "ArrowLeft") showImage(currentIndex - 1);
            if (e.key === "ArrowRight") showImage(currentIndex + 1);
            if (e.key === "Escape") lightbox.style.display = "none";
        }
    });
});
