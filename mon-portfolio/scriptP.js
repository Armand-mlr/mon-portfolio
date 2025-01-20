document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".carousel-item");
    const dotsContainer = document.getElementById("navigation-dots");
    let currentIndex = 0;

    // Crée les puces de navigation
    items.forEach((_, index) => {
        const dot = document.createElement("div");
        if (index === 0) dot.classList.add("active");
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll("div");

    // Fonction pour mettre à jour les sections
    const updateCarousel = () => {
        items.forEach((item, index) => {
            item.classList.remove("active", "prev", "next");
            dots[index].classList.remove("active");

            if (index === currentIndex) {
                item.classList.add("active");
                dots[index].classList.add("active");
            } else if (index === (currentIndex - 1 + items.length) % items.length) {
                item.classList.add("prev");
            } else if (index === (currentIndex + 1) % items.length) {
                item.classList.add("next");
            }
        });
    };

    // Gère le défilement avec la molette
    let isScrolling = false;

    window.addEventListener("wheel", (event) => {
        if (isScrolling) return;

        isScrolling = true;
        setTimeout(() => (isScrolling = false), 500);

        if (event.deltaY > 0) {
            // Scroll vers le bas
            currentIndex = (currentIndex + 1) % items.length;
        } else {
            // Scroll vers le haut
            currentIndex = (currentIndex - 1 + items.length) % items.length;
        }

        updateCarousel();
    });

    updateCarousel();
});

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
        projet:"Achievements",
        sectionN1: "About my career",
        section1: "I'm an 18-year-old first-year student in a Mathematics and Computer Science program. I graduated with a French “Baccalauréat Général“, specializing in Mathematics and Computer Science, with an advanced math option. I currently live in the suburbs of Paris, just 25 minutes away from the city center.",
        sectionN2: "Who I am",
        section2: "I am a curious and driven student, always looking to learn or deepen new skills. I put my full effort into the tasks I undertake and place great importance on seeing things through to completion.",
        sectionN3: "What I Enjoy Doing",
        section3: "I enjoy cooking for my family and myself, exploring the art of mixology by creating various cocktails, developing IT projects, listening to music, playing the piano, trying my hand at photography and cinematography, and constantly learning new things, both theoretical and practical.",
        sectionN4: "My experiences",
        section4: "I have completed two separate internships (a total of one month) at the same organization in the field of collective catering. I have also taught computer science classes. In 2025, I plan to work for two months in the restaurant industry.",
        sectionN5: "Contact me",
        section5: "Send me a message at:",
        email:"My mail adress"
        // Ajoute ici d'autres traductions en anglais
    },
    fr: {
        language: "English",
        cv:"Mon CV",
        projet:"Réalisations",
        sectionN1: "À propos de mes études",
        section1: "Je suis étudiant en première année de licence Mathématiques/Informatique, âgé de 18 ans. J'ai obtenu un Baccalauréat Général avec les spécialités Mathématiques, NSI, et l'option Mathématiques expertes. Actuellement, je réside dans la banlieue parisienne, à seulement 25 minutes du centre de Paris.",
        sectionN2: "Qui je suis",
        section2: "Je suis un étudiant curieux et motivé, toujours à la recherche de nouvelles compétences à apprendre ou à approfondir. Je m'investis pleinement dans les tâches que j'entreprends et j'accorde une grande importance à aller au bout de ce que je commence.",
        sectionN3: "Ce que j'aime faire",
        section3: "J'aime cuisiner pour ma famille et moi-même, explorer l'art de la mixologie en créant différents cocktails, développer des projets en informatique, écouter de la musique, jouer du piano, m'essayer à la photographie et à la cinématographie, et apprendre constamment de nouvelles choses, tant sur le plan théorique que pratique.",
        sectionN4: "Mes expériences",
        section4: "J'ai effectué deux stages distincts (pour un total d'un mois) au sein d'un même établissement, dans le domaine de la restauration collective. J'ai également donné des cours en informatique. En 2025, je prévois de travailler pendant deux mois dans le secteur de la restauration.",
        sectionN5: "Me contacter",
        section5: "Envoyez-moi un message à : ",
        email:"Mon adresse mail"
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