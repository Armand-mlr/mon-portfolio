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
            projet:"What I like to do",
            photo:"Discover my portrait",
            sectionN0: "Welcome on my Website",
            section0: "You’ll find my resume in the dedicated tab, and my contact info at the bottom !",
            sectionN1: "About my academic journey",
            section1: "I'm currently in my first year of a Maths and Computer Science degree. I got a French high school diploma (Bac Général) with majors in Mathematics and Computer Science (NSI), plus the advanced Math option. Today, I study in the Paris region, not far from the city center. I enjoy what I'm learning — even if it's not always easy — and I try to make progress every day.",
            sectionN2: "Who I am",
            section2: "I'm a curious and motivated young guy. I enjoy learning new things, whether it's through my classes or personal projects. When I start something, I try to see it through — even if it takes time. I like understanding how things work and giving myself small challenges.",
            sectionN3: "What I Enjoy Doing",
            section3: "I love cooking for the people I care about, trying out new recipes or making up cocktail ideas. I also spend quite a bit of time on coding projects, listening to music, or playing the piano. I'm really drawn to photography and video — I like experimenting with both whenever I get the chance.",
            sectionN4: "My experiences",
            section4: "I don't have a lot of professional experience yet, but I’ve already worked on several personal projects (like this website), especially in computer science. I've also had the opportunity to work in the restaurant industry, which taught me how to manage stress, keep up with the pace, and interact with people. At the same time, I’m committed to my personal learning: coding, cooking, expanding my cultural knowledge, improving my language skills, and teaching science. I constantly have a desire to learn and improve, so I move forward in this direction whenever I can.",
            sectionN5: "Contact me",
            // Ajoute ici d'autres traductions en anglais
        },
        fr: {
            language: "English",
            cv:"Mon CV",
            projet:"Ce que j'aime",
            photo:"Voir ma photo",
            sectionN0: "Bienvenue sur mon site Web",
            section0: "Mon CV se trouve en l'onglet dédié, mes contacts, en bas !",
            sectionN1: "À propos de mes études",
            section1: "Je suis en première année de licence Maths/Info. J’ai eu un bac général avec les spécialités Maths, NSI et l’option Maths expertes. Aujourd’hui, j’étudie en région parisienne, pas loin du centre de Paris. J’aime ce que j’apprends, même si ce n’est pas toujours facile, et j’essaie de progresser un peu chaque jour.",
            sectionN2: "Qui je suis",
            section2: "Je suis quelqu’un de curieux et motivé. J’aime apprendre de nouvelles choses, que ce soit à travers mes cours ou mes projets perso. Quand je commence quelque chose, j’essaie d’aller jusqu’au bout, même si ça prend du temps. J’aime bien comprendre comment les choses fonctionnent et me lancer des petits défis.",
            sectionN3: "Ce que j'aime faire",
            section3: "J’aime cuisiner pour les gens que j’aime, tester des recettes ou inventer des cocktails. Je passe aussi pas mal de temps sur des projets informatiques, à écouter de la musique ou à jouer du piano. La photo et la vidéo m’attirent beaucoup, j’aime m’y essayer dès que j’ai le temps.",
            sectionN4: "Mes expériences",
            section4: "Je n’ai pas encore énormément d’expérience professionnelles, mais j’ai déjà travaillé sur plusieurs projets personels (comme ce site), notamment en informatique. J’ai aussi eu l’occasion de travailler dans la restauration, ce qui m’a appris à gérer le stress, le rythme, et le contact avec les gens. En parallèle, je m’investis dans mes propres apprentissages : coder, cuisiner, me cultiver, étoffer ma maîtrise des langues étrangères, et donner des cours de sciences... J'ai constamment l'envie d'apprendre et de m'améliorer, j'avance donc dans ce sens dès que je le peux...",
            sectionN5: "Contactez-moi",
        }
    };

    const photoPerso = document.getElementById('maphoto');
    const overlay = document.getElementById('photo-overlay');
    const container = document.getElementById('photo-container');
    
    let photoClick = false;
    
    container.addEventListener('click', () => {
        photoClick = !photoClick;
    
        if (photoClick) {
            photoPerso.style.filter = 'none';
            overlay.style.opacity = '0';
        } else {
            photoPerso.style.filter = 'blur(10px) brightness(50%)';
            overlay.style.opacity = '1';
        }
    });

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
