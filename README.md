# Pressage, portfolio d'Armand Mulier

Refonte du portfolio selon le kit « Pressage » : chaque projet est une édition (pochette, disque, macaron, livret).
Site statique en HTML, CSS et JavaScript, sans dépendance ni étape de build.

## Lancer le site en local

Ouvrir `index.html` suffit. Pour retrouver le comportement d'un hébergement (GitHub Pages) :

    cd Pressage-2026-11-14-Galerie-Canard
    python3 -m http.server 8000

puis ouvrir http://localhost:8000

## Contenu du dossier

- `index.html`, `styles.css`, `script.js` : le site (français dans le HTML, anglais dans `script.js`)
- `collection/` : les 12 masters du kit, inchangés, et leurs copies en 640 px (`-640.webp`) pour les petits formats
- `photos/` : les 24 photos des galeries (`t/` = vignettes), la vidéo et le poster de Sillage, le CV, les icônes
- `captures/` : captures prises sur le site construit, au cadrage des planches 1, 2, 3, 6, 29, 30 et 31

## Destinations

`#top`, `#projects`, `#about`, `#skills`, `#interests`, `#contact` (ancres historiques conservées),
`#projet/fluency`, `#projet/trackcurator`, `#projet/sillage`, `#projet/arbres`, `#projet/structures`, `#projet/refuges`
(ajouter `/livret` pour ouvrir directement le livret), `#interests/piano` (et les quatre autres pratiques),
`#galerie/cuisine`, `#galerie/photo`, et une destination par image, par exemple `#galerie/photo/escalier`.

## Passe de retouches (novembre 2026)

- Accueil : titre « Sélection de projets », une ligne de légende par projet, lien « Ouvrir le projet … », « Voir les 6 projets », « Voir mon CV »
- CV : nouvelle destination `#cv` avec le portrait et le choix de la langue du document ; les quatre anciens téléchargements y mènent
- Compétences : une compétence ouvre ses projets (adresse partageable, par exemple `#skills/python`), encart « En cours d'apprentissage »
- Parcours : la page tient dans la hauteur à 1440 × 900 et 1366 × 768 ; les deux paragraphes personnels sont dans « Lire la suite du parcours »
- Contact : carte de visite avec LinkedIn, pied de page avec « Retour à l'accueil »
- Curseur : macaron qui indique le geste (lien, bouton, galerie, disque), souris uniquement
- Menu : la destination active est signalée, CV compris

### Ajouter le CV anglais

1. Déposer le PDF dans `photos/` (par exemple `photos/CVAM2026E.pdf`).
2. Dans `script.js`, renseigner la seule ligne prévue pour cela, en haut du fichier :

       const CV = { fr: 'photos/CVAM2026F.pdf', en: 'photos/CVAM2026E.pdf' };

La rangée « CV en anglais · À venir » devient alors un téléchargement actif. Tant que `en` est vide, elle reste un simple texte.

### Vérifications des retouches (Chrome sans interface, français et anglais)

- dépassement vertical mesuré après chargement des images, zoom 100 % : 0 px sur Accueil, Parcours, Contact, CV et Compétences à 1440 × 900 et à 1366 × 768 ; défilement vertical normal et aucun défilement horizontal à 390 × 844 et 360 × 740
- accueil : trois sélections, clics rapides, changement de langue après sélection : nom, légende, lien et visuel restent synchronisés
- CV : quatre chemins (menu, accueil, Parcours, Contact), arrivée directe, rechargement, Précédent / Suivant ; `photos/CVAM2026F.pdf` est le fichier d'origine, inchangé (58 086 octets)
- compétences : clic, Entrée, Espace, lien direct ; le survol ne change rien ; Python, C, SQL et les deux entrées de théorie ouvrent deux projets
- contact : LinkedIn, GitHub, `mailto:`, `tel:`, copie vérifiée dans le presse-papiers, « Copié » annoncé
- curseur : point, lien, bouton, plus, disque, traction, sur bleu et sur papier (carte ivoire et livret compris) ; repli sur l'adresse, la vidéo, la visionneuse, après Tab et en mouvement réduit
- régression : traction du disque, livret, galeries, visionneuse, langue, retour navigateur, sans JavaScript

Non vérifié : lecture à 200 % de zoom, appareil hybride réel (souris puis toucher), couleurs forcées, Safari et Firefox, téléphone physique.

Captures : `captures/retouches/`, avec les trois planches de référence à côté.

## Tests réalisés (Chrome sans interface, 1512×850, 1440×900, 768×1024, 390×844, 360×740)

- aucune erreur JavaScript, aucun défilement horizontal de page, en français et en anglais
- accueil : sortie du disque, changement de disque au clic et aux flèches, changements rapides sans résidu
- collection vers édition et retour : position de la grille et focus restaurés
- disque : traction à la souris, bouton Sortir / Rentrer, repos à 8 %, butée à 58 %
- livret : ouverture animée, lien direct, touche Échap, bouton Retour du navigateur
- six démonstrations des livrets, vidéo Sillage présente, repli Fluency affiché
- galeries : 10 plats et 14 photographies, visionneuse (compteur, flèches, Échap, retour du focus), lien direct vers une image
- copie de l'e-mail vérifiée dans le presse-papiers, langue conservée après rechargement
- sans JavaScript : tous les contenus et liens restent dans la page ; mouvement réduit : poses finales immédiates

## À vérifier sur appareil physique

- gestes tactiles réels : traction du disque, balayage dans la visionneuse et dans le sélecteur
- Safari (macOS et iOS) et Firefox : seul Chrome a été testé ; sans View Transitions, les changements de page se font par simple apparition
- rendu en Helvetica Neue sur Mac (les captures ont été faites avec la police de repli)
- fluidité des animations sur téléphone

## Écarts connus avec le kit

- les gestes propres à chaque pochette (signes de Fluency qui s'écartent, onglet de TrackCurator qui se soulève) ne sont pas faits : chaque pochette est une image unique. Seul le reflet du disque Sillage à l'extraction est en place.
- les textes d'information viennent de la V3 ; seuls les titres et légendes de pochette, ainsi que les libellés des démonstrations, viennent du kit.
- le CV anglais n'est pas fourni : sa rangée affiche « À venir ».
- la vidéo Fluency n'est pas dans l'archive : déposer `photos/Fluency Présentation.mp4` pour qu'elle remplace le texte de repli.
