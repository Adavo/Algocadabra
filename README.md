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

## Son

- Une petite musique de fond magique est jouée par le navigateur lui-même (Web Audio, aucun fichier audio),
  à partir du premier toucher de l'enfant. Elle baisse automatiquement pendant que la voix lit une consigne.
- Le son (tout couper, volume de la voix, musique et son volume) se règle dans l'espace parents ; les enfants n'ont que 👂 pour réécouter la consigne.
- La musique s'arrête quand la page est cachée (autre onglet, tablette en veille).
- Les navigateurs interdisent tout son avant un premier toucher : un écran titre avec un gros bouton « Jouer »
  débloque la musique et la voix, puis la sorcière accueille l'enfant à voix haute.
- iPad / iPhone : le son se débloque à la fin du toucher (règle de Safari). Depuis iOS 16.4, il joue
  même en mode silencieux ; sur un iOS plus ancien, désactiver le mode silencieux (cloche du centre de contrôle).
- La voix des consignes est choisie automatiquement parmi les voix françaises de l'appareil, en préférant
  les voix « naturelles » (Edge : « Natural », Chrome : « Google français », iPad/Mac : « Premium »).
  Un parent peut en choisir une autre dans l'espace parents. Les consignes sont lues phrase par phrase.

Comme dans un jeu vidéo, la page ne défile jamais : chaque écran est réduit automatiquement s'il est trop grand
pour la fenêtre (`ajuster()` dans `js/app.js`).

Les labyrinthes, terrains et sorts sont générés au hasard : chaque partie est différente.
La progression est gardée dans le navigateur (localStorage).

## Ajouter du contenu

- Un décor ou une histoire : `js/decors.js`
- Un jeu : un fichier dans `js/jeux/` qui ajoute `Jeux.monId`, puis l'ajouter dans la liste de `js/fichiers.js` et dans `GROUPES` (`js/app.js`).
- Les outils de quadrillage (plus court chemin, plateau, exécution d'un programme) sont dans `js/jeux/grille.js`.

## Mises à jour sans cache

`index.html` ne fait que charger `js/fichiers.js`, qui charge ensuite le CSS et les scripts.
Chaque fichier est demandé avec un paramètre `?v=` différent à chaque visite : le navigateur
reprend donc toujours la dernière version publiée, sans avoir à vider son cache.

## Espace parents

Le bouton ⚙️ en haut à droite ouvre l'espace parents : son, volume de la voix, musique (marche/arrêt et volume), choix de la voix,
remise à zéro de la progression, et ce que chaque jeu apprend. Pour y entrer, il faut taper sur le pavé de chiffres la réponse
à une question de culture générale (une date) tirée au hasard parmi 5, trop difficile pour les enfants et jamais lue à voix haute.
Les questions sont dans `js/parents.js`.

## Voix enregistrée (Piper)

Les consignes peuvent être jouées depuis des fichiers MP3 enregistrés avec [Piper](https://github.com/rhasspy/piper),
une voix de synthèse française gratuite qui tourne sur l'ordinateur, sans compte. Chaque phrase qui a son fichier
est jouée depuis ce fichier ; les autres sont lues par la voix du navigateur.

```bash
python -m pip install -r outils/voix/requirements.txt   # une seule fois
python outils/voix/generer-voix.py                       # à relancer quand une phrase change
```

- `node outils/voix/lister-phrases.js` affiche toutes les phrases que le site peut dire (environ 400).
- Les textes sont dans `js/phrases.js` (général) et dans `textes` / `phrases()` de chaque jeu :
  une phrase ajoutée là est automatiquement enregistrée au prochain lancement du script.
- Options : `--voix fr_FR-upmc-medium` pour une autre voix, `--lenteur 1.2` pour parler plus lentement,
  `--tout` pour tout réenregistrer.
- Les fichiers vont dans `voix/fichiers/` avec `voix/catalogue.json` ; la voix téléchargée (~60 Mo)
  reste dans `outils/voix/modeles/` (non publiée).

## Icône

`icones/icone.svg` est l'icône (le chaudron), avec ses versions PNG pour l'onglet du navigateur
(`favicon-32.png`) et l'écran d'accueil de l'iPad (`apple-touch-icon.png`, 180 × 180).
