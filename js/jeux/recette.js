// La recette de la sorcière : suivre une recette en images, dans l'ordre, pour préparer une potion.

Jeux.recette = {
  id: 'recette',
  nom: 'La recette',
  icone: '📜🧪',
  concept: "Suivre un algorithme : la recette donne les étapes dans l'ordre, et il faut les exécuter une par une, sans en sauter ni les inverser. Dans « Les étapes », on remet l'ordre ; ici, on suit un ordre donné.",
  manches: 2,
  niveaux: [
    // etapes : longueur de la recette ; choix : ingrédients proposés (les autres sont des pièges) ;
    // repetitions : un ingrédient peut revenir plusieurs fois ; sansAide : l'étape en cours n'est plus surlignée.
    { etapes: 3, choix: 4 },
    { etapes: 4, choix: 4 },
    { etapes: 4, choix: 5, repetitions: true },
    { etapes: 5, choix: 5, repetitions: true },
    { etapes: 6, choix: 5, repetitions: true, sansAide: true },
  ],

  textes: {
    intro: "La sorcière prépare une potion. Regarde la recette, et mets les ingrédients dans le chaudron, dans l'ordre !",
    faux: "Regarde la recette : qu'est-ce qui vient maintenant ?",
    encore: 'Une nouvelle recette !',
  },

  // Tout ce que ce jeu peut dire (pour enregistrer les fichiers audio).
  phrases() {
    return Object.values(this.textes);
  },

  lancerManche(zone, { decor, config, premiere, consigne, reussi }) {
    const T = Jeux.recette.textes;
    const ingredients = melanger(decor.motifs);
    const proposes = ingredients.slice(0, config.choix);
    let recette;
    if (config.repetitions) {
      // Au moins un ingrédient revient (il faut compter), mais jamais deux fois de suite le même.
      do {
        recette = [];
        while (recette.length < config.etapes) {
          const e = proposes[hasard(proposes.length)];
          if (e !== recette[recette.length - 1]) recette.push(e);
        }
      } while (new Set(recette).size === recette.length);
    } else {
      recette = ingredients.slice(0, config.etapes);
    }
    let etape = 0;
    const surligner = k => { if (!config.sansAide && lignes[k]) lignes[k].classList.add('en-cours'); };

    const lignes = recette.map((e, k) => el('div', { class: 'ligne-recette' }, [
      el('span', { class: 'numero-recette', text: String(k + 1) }),
      el('span', { class: 'ingredient-recette', text: e }),
      el('span', { class: 'coche-recette', text: '✔️' }),
    ]));
    const carte = el('div', { class: 'carte-recette' }, [el('div', { class: 'titre-recette', text: '📜' }), ...lignes]);

    const marmite = el('div', { class: 'marmite' });
    marmite.insertAdjacentHTML('beforeend', CHAUDRON_SVG);

    surligner(0);
    const choix = melanger(proposes).map(e => {
      const b = el('button', { class: 'carte-choix', text: e, onclick: () => ajouter(e, b) });
      return b;
    });

    function ajouter(e, bouton) {
      if (etape >= recette.length) return;
      if (e !== recette[etape]) {
        Son.oups();
        secouer(bouton);
        if (!config.sansAide) secouer(lignes[etape]);
        Son.dire(T.faux);
        return;
      }
      Son.pop();
      // L'ingrédient tombe dans le chaudron.
      const plouf = el('span', { class: 'plouf', text: e });
      marmite.append(plouf);
      setTimeout(() => plouf.remove(), 900);
      lignes[etape].classList.remove('en-cours');
      lignes[etape].classList.add('faite');
      etape++;
      if (etape === recette.length) {
        marmite.classList.add('prete');
        reussi();
      } else {
        surligner(etape);
      }
    }

    zone.append(
      el('div', { class: 'cuisine' }, [carte, marmite]),
      el('div', { class: 'choix' }, choix),
    );
    consigne(premiere ? T.intro : T.encore);
  },
};
