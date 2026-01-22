document.addEventListener("DOMContentLoaded", () => {
    const modeToggle = document.getElementById("mode-toggle");
    const body = document.body;
    const languageSwitcher = document.getElementById('language-switcher');

    // --- GESTION DU MODE SOMBRE (Ton code) ---
    const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';

    if (darkModeEnabled) {
        body.classList.add("dark-mode");
        modeToggle.textContent = "🌞";
    } else {
        body.classList.remove("dark-mode");
        modeToggle.textContent = "🌙";
    }

    modeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        if (body.classList.contains("dark-mode")) {
            modeToggle.textContent = "🌞";
            localStorage.setItem('darkMode', 'enabled');
        } else {
            modeToggle.textContent = "🌙";
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // --- GESTION DE LA TRADUCTION (Ton code + ajouts) ---
    const translations = {
        en: {
            language: "Français",
            navAbout: "About Me",
            cv: "My Resume",
            projet: "Projects",
            sectionN0: "Welcome to my portfolio",
            section0: "Curious and motivated student. My resume and projects are accessible via the menu.",
            sectionN1: "My Studies",
            section1: "I'm currently in my first year of a Maths and Computer Science degree. I got a French high school diploma (Bac Général) with majors in Mathematics and Computer Science. Today, I study in the Paris region. I enjoy what I'm learning, and I try to make progress every day.",
            sectionN2: "Who I am",
            section2: "I'm a curious and motivated person. I enjoy learning new things, whether it's through my classes or personal projects. When I start something, I try to see it through — even if it takes time. I like understanding how things work and giving myself small challenges.",
            sectionN3: "What I Enjoy Doing",
            section3: "I love cooking, trying out new recipes or making up cocktail ideas. I also spend quite a bit of time on coding projects, listening to music, or playing the piano. I'm really drawn to photography and video.",
            sectionN5: "Contact Me",
            contactIntro: "A project? A question? Don't hesitate to reach out."
        },
        fr: {
            language: "English",
            navAbout: "À propos",
            cv: "Mon CV",
            projet: "Réalisations",
            sectionN0: "Bienvenue sur mon portfolio",
            section0: "Étudiant curieux et motivé. Mon CV et mes projets sont accessibles via le menu.",
            sectionN1: "Mes études",
            section1: "Je suis en première année de licence Maths/Info. J’ai eu un bac général avec les spécialités Maths, NSI et l’option Maths expertes. Aujourd’hui, j’étudie en région parisienne. J’aime ce que j’apprends, et j’essaie de progresser un peu chaque jour.",
            sectionN2: "Qui je suis",
            section2: "Je suis quelqu’un de curieux et motivé. J’aime apprendre de nouvelles choses, que ce soit à travers mes cours ou mes projets perso. Quand je commence quelque chose, j’essaie d’aller jusqu’au bout, même si ça prend du temps. J’aime bien comprendre comment les choses fonctionnent et me lancer des petits défis.",
            sectionN3: "Ce que j'aime faire",
            section3: "J’aime cuisiner, tester des recettes ou inventer des cocktails. Je passe aussi pas mal de temps sur des projets informatiques, à écouter de la musique ou à jouer du piano. La photo et la vidéo m’attirent beaucoup.",
            sectionN5: "Contactez-moi",
            contactIntro: "Un projet ? Une question ? N'hésitez pas."
        }
    };

    let currentLanguage = localStorage.getItem('language') || 'fr';

    function translatePage(lang) {
        document.querySelectorAll("[data-key]").forEach(element => {
            const key = element.getAttribute("data-key");
            if (key && translations[lang][key]) {
                // Si c'est un input ou un bouton, on change parfois la value ou le textContent différemment
                if(element.tagName === 'BUTTON' && element.id !== 'language-switcher') {
                     // Pour les boutons normaux
                     element.innerHTML = `<i class="fas fa-paper-plane"></i> ${translations[lang][key]}`;
                } else {
                    // Pour le reste
                     element.textContent = translations[lang][key];
                }
            }
        });
         // Cas particulier pour le bouton de langue lui-même pour éviter une boucle
         languageSwitcher.textContent = translations[lang].language;
    }

    translatePage(currentLanguage);

    languageSwitcher.addEventListener('click', () => {
        currentLanguage = currentLanguage === 'fr' ? 'en' : 'fr';
        translatePage(currentLanguage);
        localStorage.setItem('language', currentLanguage);
    });


    // --- ANIMATION AU SCROLL (Améliorée) ---
    // --- ANIMATION AU SCROLL (REJOUABLE) ---
    const observerOptions = {
        root: null,
        threshold: 0.15, // L'élément doit être visible à 15% pour déclencher
        rootMargin: "0px 0px -50px 0px" 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Quand l'élément rentre dans l'écran : on lance l'anim
                entry.target.classList.add('show');
            } else {
                // C'EST LA CLEF : Quand l'élément sort, on retire la classe.
                // Comme ça, la prochaine fois qu'il rentre, l'anim se relance.
                entry.target.classList.remove('show');
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.scroll-reveal');
    hiddenElements.forEach((el) => observer.observe(el));
});

// --- ANIMATION PIÈCE 3D CORRIGÉE ---
    const coinTrigger = document.getElementById('coin-trigger'); // Le conteneur (zone de clic)
    const coin = document.getElementById('myCoin'); // La pièce qui tourne
    let isFlipped = false;

    if (coinTrigger && coin) {
        coinTrigger.addEventListener('click', () => {
            // On nettoie les classes d'animation
            coin.classList.remove('anim-to-back', 'anim-to-front');
            
            // Le trick pour redémarrer l'anim (Reflow)
            void coin.offsetWidth;

            if (!isFlipped) {
                // Pile -> Face
                coin.classList.add('anim-to-back');
                isFlipped = true;
            } else {
                // Face -> Pile
                coin.classList.add('anim-to-front');
                isFlipped = false;
            }
        });
    }
