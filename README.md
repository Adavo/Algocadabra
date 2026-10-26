# ✨ Algocadabra

Petits jeux pour découvrir l'algorithmique, en français, dans la maison d'une sorcière.
Les jeux sortent de son chaudron magique, en deux groupes : « Pour les petits » et « Pour les grands ».

## Lancer

Double-cliquer sur `index.html` : le site s'ouvre dans le navigateur, sans installation ni Internet.
(La police arrondie se télécharge si Internet est disponible ; sinon une police du système est utilisée.)

## Pour les petits (dès 4 ans)

Pas besoin de savoir lire : toutes les consignes sont dites à voix haute (bouton 👂 pour répéter).
Le décor change à chaque manche (potions, fées, licornes, chatons, sirène, espace, dinosaures…),
sans jamais étiqueter un univers « pour filles » ou « pour garçons ».

| Jeu | Notion | Niveaux |
| --- | --- | --- |
| Les suites | motifs qui se répètent (base des boucles) | 5 |
| Le chemin | écrire un programme de flèches, corriger ses erreurs | 5 |
| Les étapes | remettre une action dans l'ordre (séquence d'instructions) | 4 |
| Le rangement | trier du plus petit au plus grand (tri par sélection) | 5 |

## Pour les grands (dès 7 ans)

| Jeu | Notion | Niveaux |
| --- | --- | --- |
| La grotte de la chauve-souris | planifier tout le trajet avec un nombre de blocs limité : boucles « répéter N fois », sous-objectif (la clé) | 5 |
| Le grimoire ensorcelé | déboguer : trouver et corriger 1 ou 2 erreurs dans le programme de la sorcière | 5 |
| Le tri de la sorcière | conditions « SI … ALORS … SINON » pour ranger les ingrédients, règle à deviner d'après des exemples, puis « SINON SI » | 5 |
| La balance des potions | trier en comparant deux à deux, avec un nombre de pesées limité | 5 |

Les labyrinthes, terrains et sorts sont générés au hasard : chaque partie est différente.
La progression est gardée dans le navigateur (localStorage).

## Ajouter du contenu

- Un décor ou une histoire : `js/decors.js`
- Un jeu : un fichier dans `js/jeux/` qui ajoute `Jeux.monId`, puis l'ajouter dans `index.html` et dans `GROUPES` (`js/app.js`).
- Les outils de quadrillage (plus court chemin, plateau, exécution d'un programme) sont dans `js/jeux/grille.js`.
