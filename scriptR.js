document.addEventListener("DOMContentLoaded", () => {

if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
} else {
    document.body.classList.remove('dark-mode');
}

// Appliquer la langue préférée
if (localStorage.getItem('language') === 'en') {
    document.documentElement.lang = 'en';
} else {
    document.documentElement.lang = 'fr';
}

const modeToggle = document.getElementById("mode-toggle");
const body = document.body;
// Change l'icône ou le texte du bouton en fonction du mode
modeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    
    // Changer l'icône du bouton
    if (body.classList.contains("dark-mode")) {
        modeToggle.textContent = "🌞";  // Icône de soleil pour passer au mode clair
    } else {
        modeToggle.textContent = "🌙";  // Icône de lune pour passer au mode sombre
    }
});

const languageSwitcher = document.getElementById('language-switcher');

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

// Langue par défaut
let currentLanguage = 'fr';

function translatePage(lang) {
    document.querySelectorAll("[data-key]").forEach(element => {
        const key = element.getAttribute("data-key");
        if (key && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

languageSwitcher.addEventListener('click', () => {
    // Alterne entre 'fr' et 'en'
    currentLanguage = currentLanguage === 'fr' ? 'en' : 'fr';
    translatePage(currentLanguage)
});


// Récupère la langue sauvegardée au chargement
currentLanguage = localStorage.getItem('language') || 'fr';
languageSwitcher.textContent = translations[currentLanguage].language;

// Sauvegarde la langue sélectionnée
languageSwitcher.addEventListener('click', () => {
    localStorage.setItem('language', currentLanguage);
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
