// La balance : les potions se ressemblent, on ne peut connaître leur poids qu'en les comparant deux à deux.

const COULEURS_POTIONS = [
  ['#ef4444', 'rouge'], ['#f97316', 'orange'], ['#facc15', 'jaune'],
  ['#22c55e', 'verte'], ['#3b82f6', 'bleue'], ['#a855f7', 'violette'],
];

Jeux.balance = {
  id: 'balance',
  nom: 'La balance des potions',
  icone: '⚖️🧪',
  concept: "Trier en comparant deux objets à la fois, comme un ordinateur. Avec un nombre de pesées limité, il faut une méthode : trouver la plus légère puis recommencer (tri par sélection), ou insérer chaque potion à sa place (tri par insertion).",
  manches: 1,
  niveaux: [
    { nb: 3 },
    { nb: 4 },
    { nb: 4, max: 6 },
    { nb: 5, max: 10 },
    { nb: 6, max: 15 },
  ],

  lancerManche(zone, { config, premiere, consigne, enCours, reussi, recommencer }) {
    const poids = melanger(Array.from({ length: config.nb }, (_, i) => i + 1));
    const potions = melanger(COULEURS_POTIONS).slice(0, config.nb).map(([couleur, nom], i) => ({ couleur, nom, poids: poids[i] }));
    // Où est chaque potion : 'reserve', 'g', 'd' (plateaux) ou un numéro de case de l'étagère.
    const lieu = new Map(potions.map(p => [p, 'reserve']));
    let choisie = null;
    let pesees = 0;
    let dernierePaire = '';
    let fini = false;

    const elements = new Map(potions.map(p => [p, el('button', {
      class: 'fiole', style: `--c:${p.couleur}`, 'aria-label': 'Potion ' + p.nom,
      onclick: e => { e.stopPropagation(); toucherPotion(p); },
    })]));

    const reserve = el('div', { class: 'reserve', onclick: () => deplacer('reserve') });
    const plateauG = el('div', { class: 'plateau-balance', role: 'button', tabindex: '0', 'aria-label': 'Plateau de gauche', onclick: () => deplacer('g') });
    const plateauD = el('div', { class: 'plateau-balance', role: 'button', tabindex: '0', 'aria-label': 'Plateau de droite', onclick: () => deplacer('d') });
    const fleau = el('div', { class: 'fleau' }, [
      el('div', { class: 'suspente gauche' }, [plateauG]),
      el('div', { class: 'suspente droite' }, [plateauD]),
    ]);
    const balance = el('div', { class: 'balance' }, [fleau, el('div', { class: 'pied' })]);
    const cases = Array.from({ length: config.nb }, (_, i) => el('div', {
      class: 'case-etagere', role: 'button', tabindex: '0', 'aria-label': 'Place ' + (i + 1), onclick: () => deplacer(i),
    }));
    const compteur = el('p', { class: 'compteur' });

    function occupant(endroit) {
      return potions.find(p => lieu.get(p) === endroit);
    }

    function toucherPotion(p) {
      if (fini) return;
      if (choisie === p) { choisie = null; Son.pop(); return dessiner(); }
      if (choisie && lieu.get(p) !== 'reserve') return deplacer(lieu.get(p));
      choisie = p;
      Son.pop();
      dessiner();
    }

    // Pose la potion choisie à un endroit ; s'il est occupé, les deux potions échangent leur place.
    function deplacer(endroit) {
      if (fini || !choisie) return;
      const avant = lieu.get(choisie);
      if (endroit !== 'reserve') {
        const autre = occupant(endroit);
        if (autre) lieu.set(autre, avant);
      }
      lieu.set(choisie, endroit);
      choisie = null;
      Son.pop();
      peser();
      dessiner();
    }

    function peser() {
      const g = occupant('g'), d = occupant('d');
      let angle = 0;
      if (g && !d) angle = -10;
      if (d && !g) angle = 10;
      if (g && d) {
        angle = g.poids > d.poids ? -14 : 14;
        const paire = [g.nom, d.nom].sort().join('+');
        if (paire !== dernierePaire) {
          dernierePaire = paire;
          pesees++;
          Son.pas();
          if (config.max && pesees > config.max) trop();
        }
      } else {
        dernierePaire = '';
      }
      fleau.style.setProperty('--angle', angle + 'deg');
    }

    async function trop() {
      fini = true;
      Son.oups();
      Son.dire(`Oh non, plus de ${config.max} pesées ! La potion s'est évaporée. On recommence avec une méthode : cherche d'abord la plus légère.`);
      await attendre(4000);
      if (enCours()) recommencer();
    }

    function dessiner() {
      reserve.replaceChildren();
      plateauG.replaceChildren();
      plateauD.replaceChildren();
      cases.forEach((c, i) => c.replaceChildren(el('span', { class: 'numero', text: String(i + 1) })));
      for (const p of potions) {
        const e = elements.get(p);
        e.classList.toggle('choisie', p === choisie);
        const l = lieu.get(p);
        (l === 'reserve' ? reserve : l === 'g' ? plateauG : l === 'd' ? plateauD : cases[l]).append(e);
      }
      compteur.textContent = '⚖️ Pesées : ' + pesees + (config.max ? ' / ' + config.max : '');
      verifier.disabled = potions.some(p => typeof lieu.get(p) !== 'number');
    }

    const verifier = el('button', {
      class: 'bouton-texte vert', text: '✔️ Vérifier',
      onclick: () => {
        if (fini) return;
        const bien = potions.filter(p => p.poids === lieu.get(p) + 1).length;
        if (bien === potions.length) { fini = true; return reussi(); }
        Son.oups();
        secouer(etagere);
        Son.dire(`${bien} potion${bien > 1 ? 's sont' : ' est'} à la bonne place sur ${potions.length}. Utilise la balance pour vérifier !`);
      },
    });
    const etagere = el('div', { class: 'etagere-rangement' }, [
      el('span', { class: 'bout', text: '🪶' }),
      ...cases,
      el('span', { class: 'bout', text: '🪨' }),
    ]);

    dessiner();
    peser();
    zone.append(
      compteur,
      balance,
      reserve,
      el('p', { class: 'legende', text: 'De la plus légère 🪶 à la plus lourde 🪨' }),
      etagere,
      verifier,
    );

    const texteMax = config.max ? ` Attention, tu n'as que ${config.max} pesées !` : '';
    consigne((premiere
      ? 'Les potions ont toutes la même taille, mais pas le même poids. Range-les de la plus légère à la plus lourde. Touche une potion, puis un plateau de la balance pour la peser. Quand tu sais, pose-les sur l\'étagère et appuie sur Vérifier.'
      : 'Range les potions de la plus légère à la plus lourde.') + texteMax);
  },
};
