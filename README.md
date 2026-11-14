# Pressage — le portfolio d’Armand Mulier

Je suis élève ingénieur à l’ESIEE Paris. Dans ce portfolio, je présente mes projets personnels et universitaires, de l’étude d’algorithmes en C aux outils que j’ai conçus pour apprendre l’anglais ou préparer un set de DJ.

J’ai imaginé **Pressage** comme une collection de vinyles. Chaque projet a sa pochette et son disque. On peut tirer le vinyle, ouvrir le livret et découvrir le besoin de départ, mon rôle dans le projet et ce que j’en ai appris.

**[Visiter le portfolio](https://armand-mlr.github.io/mon-portfolio/)** · [Parcourir la collection](https://armand-mlr.github.io/mon-portfolio/#projects) · [Voir mon CV](https://armand-mlr.github.io/mon-portfolio/#cv)

## Les six éditions

| Édition | Projet | Ce qu’on y découvre |
| --- | --- | --- |
| AM–01 | **Fluency** | Une application pour travailler mon anglais avec des leçons, des révisions espacées et un suivi des erreurs. L’aide de l’IA est facultative. [Dépôt GitHub](https://github.com/Armand-mlr/fluency) |
| AM–02 | **TrackCurator** | Un projet de base de données musicale en cours. La fiche présente l’étape A4, consacrée au schéma PostgreSQL et aux premières migrations. [Dépôt GitHub](https://github.com/Armand-mlr/TrackCurator) |
| AM–03 | **Sillage** | Une application de bureau née d’un besoin lié au DJing, pour récupérer l’audio d’une vidéo en WAV ou MP3. Le livret contient une démonstration vidéo. [Dépôt GitHub](https://github.com/Armand-mlr/Sillage) |
| AM–04 | **Arbres binaires de recherche** | Trois méthodes de vérification en C, comparées sur des arbres de différentes formes. Des scripts Python et des graphiques Matplotlib permettent de confronter les mesures à la complexité théorique. |
| AM–05 | **Comparaison de structures de données** | Une étude en C du coût des insertions, suppressions et accès dans des tableaux statiques, des tableaux dynamiques et des listes chaînées. |
| AM–06 | **Refuges** | Une application Flask et PostgreSQL pour gérer les animaux, les soins et les transferts entre refuges. |

## Parcourir le site

L’interface est disponible en français et en anglais. La rubrique **Compétences** relie les technologies à des exemples concrets. En sélectionnant Python, on retrouve aussi bien les scripts de mesure des arbres binaires que les vues Flask de Refuges. [Voir les exemples Python](https://armand-mlr.github.io/mon-portfolio/#skills/python)

Dans **Ailleurs**, je partage aussi ce que je fais en dehors de l’informatique. La galerie cuisine réunit dix plats, dont le canard et purée, les profiteroles et le fraisier. Une seconde galerie rassemble quatorze de mes photographies. [Galerie cuisine](https://armand-mlr.github.io/mon-portfolio/#galerie/cuisine) · [Galerie photo](https://armand-mlr.github.io/mon-portfolio/#galerie/photo)

## Mon rôle et celui de l’IA

Ce site est parti d’un premier portfolio réalisé pour apprendre le développement front-end. Pour la refonte Pressage, j’ai choisi la direction artistique, associé chaque projet à un univers visuel et précisé les interactions que je voulais. J’ai ensuite affiné la navigation, le choix des photos et la présentation des projets à partir des versions que j’ai essayées.

L’IA a produit l’essentiel du CSS et du JavaScript de cette refonte, notamment les transitions, les mouvements des disques et le curseur interactif. Le HTML reprend la base du portfolio précédent, adaptée aux livrets, aux galeries et à la page CV. J’ai aussi utilisé l’IA pour créer le portrait illustré et retoucher le décor de certaines photos de cuisine.

## Lancer le site en local

Le site utilise **HTML, CSS et JavaScript**, sans framework ni étape de compilation. Ouvrir `index.html` suffit pour le parcourir. Pour le servir en HTTP, exécuter cette commande depuis la racine du dépôt, puis ouvrir [localhost sur le port 8000](http://localhost:8000).

```sh
python3 -m http.server 8000
```

Les pochettes et les vinyles se trouvent dans `collection/`. Le dossier `photos/` contient les images des galeries, leurs vignettes, les médias de présentation, les icônes et le CV.

### Mettre à jour le CV ou la vidéo Fluency

- **CV.** La page de téléchargement propose le [PDF français](photos/CVAM2026F.pdf). Pour activer la version anglaise, déposer son PDF dans `photos/` et renseigner `CV.en` au début de `script.js`. Le choix du document est indépendant de la langue de navigation.
- **Vidéo Fluency.** Le livret cherche le fichier facultatif `photos/Fluency Présentation.mp4` à l’ouverture. Tant que le fichier est absent, un texte de remplacement s’affiche. La lecture se lance manuellement.

## Contact

Pour échanger au sujet d’un projet ou d’une alternance, mes coordonnées sont sur la [carte de contact](https://armand-mlr.github.io/mon-portfolio/#contact) et sur [LinkedIn](https://www.linkedin.com/in/armand-mulier/).
