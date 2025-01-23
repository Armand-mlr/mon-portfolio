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
});
