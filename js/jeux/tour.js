// La tour : reconstruire la tour du modèle, de bas en haut, avec des blocs de couleur.

// Chaque couleur a aussi sa forme : on peut les distinguer sans voir les couleurs.
const BLOCS_TOUR = [
  { id: 'rouge', couleur: '#ef4444', forme: '●' },
  { id: 'bleu', couleur: '#3b82f6', forme: '■' },
  { id: 'jaune', couleur: '#facc15', forme: '★' },
  { id: 'vert', couleur: '#22c55e', forme: '▲' },
  { id: 'violet', couleur: '#a855f7', forme: '♥' },
];

function dessinBrique(bloc) {
  return el('span', { class: 'brique', style: `--c:${bloc.couleur}`, text: bloc.forme });
}

Jeux.tour = {
  id: 'tour',
  nom: 'La tour',
  icone: '🧱🏰',
  concept: "Décomposer un problème : pour refaire la tour, il faut l'analyser bloc par bloc et la construire dans le bon ordre, en commençant par le bas. On découpe un grand objectif en petites étapes simples.",
  manches: 2,
  niveaux: [
    // hauteur : blocs de la tour ; couleurs : blocs proposés dans la palette.
    { hauteur: 3, couleurs: 4 },
    { hauteur: 4, couleurs: 4 },
    { hauteur: 5, couleurs: 5 },
    { hauteur: 6, couleurs: 5 },
    { hauteur: 7, couleurs: 5 },
  ],

  textes: {
    intro: 'Construis la même tour que le modèle. Commence par le bas !',
    faux: 'Regarde le modèle : quel bloc vient maintenant ?',
    encore: 'Une nouvelle tour !',
  },

  // Tout ce que ce jeu peut dire (pour enregistrer les fichiers audio).
  phrases() {
    return Object.values(this.textes);
  },

  lancerManche(zone, { decor, config, premiere, consigne, reussi }) {
    const T = Jeux.tour.textes;
    const palette = melanger(BLOCS_TOUR).slice(0, config.couleurs);
    // Jamais deux fois la même couleur l'une sur l'autre : la tour se lit mieux.
    const modele = [];
    while (modele.length < config.hauteur) {
      const b = palette[hasard(palette.length)];
      if (b !== modele[modele.length - 1]) modele.push(b);
    }
    const construction = [];

    // Les tours sont dessinées du bas vers le haut (column-reverse dans le CSS).
    const tourModele = el('div', { class: 'tour' }, modele.map(dessinBrique));
    const tourEnfant = el('div', { class: 'tour en-construction' });
    const emplacements = () => {
      // Des emplacements vides en pointillés montrent la hauteur à atteindre.
      tourEnfant.replaceChildren(
        ...construction.map(dessinBrique),
        ...Array.from({ length: modele.length - construction.length }, (_, i) =>
          el('span', { class: 'brique vide' + (i === 0 ? ' prochaine' : '') })),
      );
    };

    const boutons = palette.map(b => {
      const bouton = el('button', { class: 'carte-choix choix-brique', 'aria-label': 'Bloc ' + b.id, onclick: () => poser(b, bouton) }, [dessinBrique(b)]);
      return bouton;
    });

    function poser(bloc, bouton) {
      if (construction.length >= modele.length) return;
      if (bloc !== modele[construction.length]) {
        Son.oups();
        secouer(bouton);
        Son.dire(T.faux);
        return;
      }
      Son.pop();
      construction.push(bloc);
      emplacements();
      if (construction.length === modele.length) {
        // Le personnage du décor monte tout en haut de la tour.
        tourEnfant.append(el('span', { class: 'sommet', text: decor.heros }));
        reussi();
      }
    }

    emplacements();
    zone.append(
      el('div', { class: 'chantier' }, [
        el('div', { class: 'colonne-tour' }, [el('p', { class: 'legende', text: '👀 Modèle' }), tourModele]),
        el('div', { class: 'colonne-tour' }, [el('p', { class: 'legende', text: '🛠️ Ta tour' }), tourEnfant]),
      ]),
      el('div', { class: 'choix' }, boutons),
    );
    consigne(premiere ? T.intro : T.encore);
  },
};
