// Le rangement : ranger du plus petit au plus grand en cherchant à chaque fois le plus petit.

Jeux.tri = {
  id: 'tri',
  nom: 'Le rangement',
  icone: '🧪🧪',
  concept: "Trier, c'est ranger selon une règle. L'enfant applique sans le savoir le « tri par sélection » : à chaque étape, on cherche le plus petit de ceux qui restent et on le pose à la suite.",
  manches: 3,
  niveaux: [
    { nb: 3, ecart: 1.8 },
    { nb: 3, ecart: 1.2 },
    { nb: 4, ecart: 0.9 },
    { nb: 5, ecart: 0.75 },
    { nb: 5, ecart: 0.6 },
  ],

  textes: {
    plusPetit: 'Cherche le plus petit !',
    plusPetitRestant: 'Cherche le plus petit de ceux qui restent !',
    intro: "Range du plus petit au plus grand. Touche d'abord le plus petit.",
    encore: 'Encore ! Du plus petit au plus grand.',
  },

  // Tout ce que ce jeu peut dire (pour enregistrer les fichiers audio).
  phrases() {
    return Object.values(this.textes);
  },

  lancerManche(zone, { decor, config, premiere, consigne, reussi }) {
    const T = Jeux.tri.textes;
    const base = 2.2;
    const objets = Array.from({ length: config.nb }, (_, rang) => ({ rang, taille: base + rang * config.ecart }));
    let suivant = 0;

    const rangee = el('div', { class: 'rangee' }, objets.map(() => el('div', { class: 'emplacement' })));
    const tas = el('div', { class: 'tas' });
    for (const o of melanger(objets)) {
      const b = el('button', {
        class: 'objet', text: decor.tri, style: `font-size:${o.taille}rem`,
        'aria-label': 'Taille ' + (o.rang + 1),
        onclick: () => {
          if (o.rang !== suivant) {
            Son.oups();
            secouer(b);
            Son.dire(suivant === 0 ? T.plusPetit : T.plusPetitRestant);
            return;
          }
          Son.pop();
          b.disabled = true;
          rangee.children[suivant].append(b);
          suivant++;
          if (suivant === objets.length) reussi();
        },
      });
      tas.append(b);
    }

    zone.append(
      el('div', { class: 'consigne-tri', text: '🤏 ➡️ 👐' }),
      rangee,
      el('div', { class: 'indice', text: '👆' }),
      tas,
    );
    consigne(premiere ? T.intro : T.encore);
  },
};
