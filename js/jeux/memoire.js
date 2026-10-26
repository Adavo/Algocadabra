// La mémoire de la fée : des images s'allument (avec chacune sa note) dans un ordre,
// puis il faut les toucher dans le même ordre.

const NOTES_MEMOIRE = [523, 659, 784, 1047, 880];

Jeux.memoire = {
  id: 'memoire',
  nom: 'La mémoire',
  icone: '🔔✨',
  concept: "Retenir puis reproduire une suite d'instructions, dans l'ordre. C'est ce que fait un ordinateur avec un programme : il exécute les étapes une par une, sans en oublier ni les mélanger.",
  manches: 3,
  niveaux: [
    // objets : images à l'écran ; longueurs : nombre d'images à retenir à chaque manche.
    { objets: 3, longueurs: [2, 2, 3] },
    { objets: 3, longueurs: [3, 3, 4] },
    { objets: 4, longueurs: [3, 4, 4] },
    { objets: 4, longueurs: [4, 5, 5] },
    { objets: 5, longueurs: [5, 5, 6] },
  ],

  textes: {
    intro: "Regarde et écoute bien : les images vont s'allumer. Ensuite, touche-les dans le même ordre !",
    regarde: 'Regarde bien !',
    aToi: 'À toi !',
    rate: 'Oups ! Regarde encore une fois.',
  },

  // Tout ce que ce jeu peut dire (pour enregistrer les fichiers audio).
  phrases() {
    return Object.values(this.textes);
  },

  lancerManche(zone, { decor, config, premiere, manche, consigne, enCours, reussi }) {
    const T = Jeux.memoire.textes;
    const images = melanger(decor.motifs).slice(0, config.objets);
    const longueur = config.longueurs[Math.min(manche, config.longueurs.length - 1)];
    // Jamais deux fois la même image de suite : plus facile à suivre pour les petits.
    const suite = [];
    while (suite.length < longueur) {
      const i = hasard(images.length);
      if (i !== suite[suite.length - 1]) suite.push(i);
    }
    let attendu = 0;
    let aLEcoute = false;

    const boutons = images.map((e, i) => el('button', {
      class: 'carte-memoire', text: e, style: `--note:${i}`, 'aria-label': 'Image ' + (i + 1),
      onclick: () => toucher(i),
    }));
    const grille = el('div', { class: 'grille-memoire' }, boutons);
    const etat = el('p', { class: 'etat-memoire', text: '👀' });

    function allumer(i) {
      const b = boutons[i];
      b.classList.remove('allume');
      void b.offsetWidth;
      b.classList.add('allume');
      Son.ton(NOTES_MEMOIRE[i]);
    }

    async function montrer() {
      aLEcoute = false;
      grille.classList.add('demonstration');
      etat.textContent = '👀';
      // On attend la fin de la consigne avant de montrer la suite.
      await attendre(400);
      while (Son.parle && enCours()) await attendre(200);
      await attendre(300);
      for (const i of suite) {
        if (!enCours()) return;
        allumer(i);
        await attendre(800);
      }
      if (!enCours()) return;
      attendu = 0;
      aLEcoute = true;
      grille.classList.remove('demonstration');
      etat.textContent = '👆';
      Son.dire(T.aToi);
    }

    function toucher(i) {
      if (!aLEcoute) return;
      allumer(i);
      if (i !== suite[attendu]) {
        aLEcoute = false;
        Son.oups();
        secouer(boutons[i]);
        Son.dire(T.rate);
        setTimeout(() => { if (enCours()) montrer(); }, 600);
        return;
      }
      attendu++;
      if (attendu === suite.length) {
        aLEcoute = false;
        etat.textContent = '⭐';
        reussi();
      }
    }

    zone.append(etat, grille);
    consigne(premiere ? T.intro : T.regarde);
    montrer();
  },
};
