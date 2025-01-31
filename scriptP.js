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

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            console.log(entry)
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            } else {
                entry.target.classList.remove('show');
            }
        });
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));
});
