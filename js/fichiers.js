// Tous les fichiers du site, chargés dans cet ordre.
// Pour ajouter un jeu : ajouter son fichier ici (index.html n'a pas besoin de changer).

(function () {
  const STYLES = ['css/style.css'];
  const SCRIPTS = [
    'js/outils.js',
    'js/phrases.js',
    'js/son.js',
    'js/decors.js',
    'js/jeux/grille.js',
    // Pour les petits
    'js/jeux/suites.js',
    'js/jeux/chemin.js',
    'js/jeux/etapes.js',
    'js/jeux/tri.js',
    // Pour les grands
    'js/jeux/labyrinthe.js',
    'js/jeux/grimoire.js',
    'js/jeux/conditions.js',
    'js/jeux/balance.js',
    'js/parents.js',
    'js/app.js',
  ];

  // Un ?v= différent à chaque visite : jamais de vieille version en cache.
  // Inutile en ouvrant index.html directement depuis le disque (file://).
  const version = location.protocol === 'file:' ? '' : '?v=' + Date.now();

  for (const f of STYLES) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = f + version;
    document.head.appendChild(l);
  }
  for (const f of SCRIPTS) {
    const s = document.createElement('script');
    s.src = f + version;
    s.async = false; // exécutés dans l'ordre de la liste
    document.body.appendChild(s);
  }
})();
