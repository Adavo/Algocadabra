// Les suites : trouver ce qui manque dans un motif qui se répète.
// Chaque niveau ajoute une seule nouveauté, pour que la difficulté se sente bien.

Jeux.suites = {
  id: 'suites',
  nom: 'Les suites',
  icone: '🎃⭐',
  concept: "Repérer une régularité (un motif qui se répète) et prévoir la suite. C'est la base des boucles en programmation : une même séquence répétée plusieurs fois.",
  manches: 3,
  niveaux: [
    {
      motifs: ['AB'], choix: 2, trous: 1, place: 'fin', longueur: 6,
      intro: "Regarde bien la suite. Quelle image vient à la place du point d'interrogation ?",
      rappel: 'Quelle image vient après ?',
    },
    {
      motifs: ['ABC'], choix: 3, trous: 1, place: 'fin', longueur: 7,
      intro: 'Maintenant, il y a trois images qui se répètent. Laquelle vient après ?',
      rappel: 'Trois images qui se répètent. Laquelle vient après ?',
    },
    {
      motifs: ['AAB', 'ABB', 'AABB'], choix: 3, trous: 1, place: 'fin', longueur: 8, decale: true,
      intro: "Attention, certaines images sont là deux fois de suite ! Regarde bien tout le motif avant de choisir.",
      rappel: 'Regarde bien tout le motif. Quelle image vient après ?',
    },
    {
      motifs: ['ABC', 'AAB', 'ABB', 'AABB'], choix: 4, trous: 1, place: 'milieu', longueur: 9, decale: true,
      intro: "Cette fois, l'image cachée est au milieu de la suite ! Laquelle manque ?",
      rappel: "L'image cachée est au milieu. Laquelle manque ?",
    },
    {
      motifs: ['AABC', 'ABBC', 'ABCC'], choix: 4, trous: 2, place: 'fin', longueur: 9, decale: true,
      intro: 'Il manque deux images à la fin ! Trouve la première, puis la deuxième.',
      rappel: 'Deux images manquent. La première, puis la deuxième !',
    },
  ],

  textes: {
    suivante: 'Oui ! Et la suivante ?',
  },

  // Tout ce que ce jeu peut dire (pour enregistrer les fichiers audio).
  phrases() {
    return [...this.niveaux.flatMap(n => [n.intro, n.rappel]), this.textes.suivante];
  },

  lancerManche(zone, { decor, config, premiere, consigne, reussi }) {
    const motif = config.motifs[hasard(config.motifs.length)];
    const lettres = [...new Set(motif)];
    const images = melanger(decor.motifs);
    const sens = Object.fromEntries(lettres.map((l, i) => [l, images[i]]));
    const tour = motif.length;
    const decalage = config.decale ? hasard(tour) : 0;
    // Au plus 9 cases en tout, pour que toute la suite tienne sur une seule ligne.
    const suite = Array.from({ length: config.longueur }, (_, i) => sens[motif[(i + decalage) % tour]]);

    // Où sont les cases à trouver : à la fin, ou au milieu (avec au moins un motif complet avant).
    let caches;
    if (config.place === 'milieu') {
      const i = tour + hasard(config.longueur - tour - 1);
      caches = [i];
    } else {
      caches = Array.from({ length: config.trous }, (_, k) => config.longueur - config.trous + k);
    }
    const reponses = caches.map(i => suite[i]);
    let prochain = 0;

    const cases = suite.map((e, i) => caches.includes(i)
      ? el('span', { class: 'case-suite trou', text: '?' })
      : el('span', { class: 'case-suite', text: e }));
    const trous = caches.map(i => cases[i]);
    const marquerActif = () => trous.forEach((t, k) => t.classList.toggle('attente', k > prochain));
    marquerActif();
    const ligne = el('div', { class: 'ligne-suite', style: `--nb:${config.longueur}` }, cases);

    // Les choix : les bonnes réponses, les autres images du motif, puis d'autres images du décor.
    const proposes = [...new Set(reponses)];
    for (const e of [...melanger(Object.values(sens)), ...images]) {
      if (proposes.length >= config.choix) break;
      if (!proposes.includes(e)) proposes.push(e);
    }

    const choix = el('div', { class: 'choix' }, melanger(proposes).map(e => {
      const b = el('button', {
        class: 'carte-choix', text: e,
        onclick: () => {
          if (prochain >= reponses.length) return;
          if (e !== reponses[prochain]) {
            Son.oups();
            secouer(b);
            Son.dire(ESSAIE_ENCORE[hasard(ESSAIE_ENCORE.length)]);
            return;
          }
          const t = trous[prochain];
          t.textContent = e;
          t.classList.remove('trou');
          t.classList.add('juste');
          prochain++;
          if (prochain === reponses.length) return reussi();
          Son.pop();
          Son.dire(Jeux.suites.textes.suivante);
          marquerActif();
        },
      });
      return b;
    }));

    zone.append(ligne, el('div', { class: 'indice', text: '👇' }), choix);
    consigne(premiere ? config.intro : config.rappel);
  },
};
