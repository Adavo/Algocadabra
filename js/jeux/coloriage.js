// Le coloriage codé : chaque symbole correspond à une couleur ; en coloriant les cases selon le code,
// un dessin apparaît.

const COULEURS_CODE = {
  R: { couleur: '#ef4444', symbole: '●', nom: 'rouge' },
  J: { couleur: '#facc15', symbole: '★', nom: 'jaune' },
  V: { couleur: '#22c55e', symbole: '▲', nom: 'vert' },
  M: { couleur: '#92400e', symbole: '■', nom: 'marron' },
  P: { couleur: '#f9a8d4', symbole: '♥', nom: 'rose' },
  B: { couleur: '#3b82f6', symbole: '◆', nom: 'bleu' },
  O: { couleur: '#f97316', symbole: '✿', nom: 'orange' },
};

// Les dessins : une lettre par case (voir COULEURS_CODE), un point pour une case à laisser vide.
const DESSINS_CODES = [
  // 5 × 5
  { nom: 'cœur', lignes: ['.R.R.', 'RPRRR', 'RRRRR', '.RRR.', '..R..'] },
  { nom: 'champignon', lignes: ['.RRR.', 'RJRJR', 'RRRRR', '..J..', '.JJJ.'] },
  { nom: 'sapin', lignes: ['..V..', '.VVV.', 'VVVVV', '..M..', '..M..'] },
  { nom: 'soleil', lignes: ['J.J.J', '.JJJ.', 'JJJJJ', '.JJJ.', 'J.J.J'] },
  { nom: 'fleur', lignes: ['.PPP.', 'PPJPP', '.PPP.', '..V..', '.VVV.'] },
  { nom: 'maison', lignes: ['..R..', '.RRR.', 'RRRRR', '.MJM.', '.MMM.'] },
  { nom: 'champignon tacheté', lignes: ['.RRR.', 'RJRJR', 'RRRRR', '..M..', '.MMM.'] },
  // 6 × 6
  { nom: 'pomme', lignes: ['...V..', '..V...', '.RRRR.', 'RJRRRR', 'RRRRRR', '.RRRR.'] },
  { nom: 'tulipe', lignes: ['..PP..', '.PJJP.', '..PP..', '...V..', 'V..V..', '.VVV..'] },
  { nom: 'poisson', lignes: ['......', '.OOO.O', 'OBOOOO', 'OOOOOO', '.OOO.O', '......'] },
  { nom: 'chalet', lignes: ['..RR..', '.RRRR.', 'RRRRRR', '.BMMB.', '.MJJM.', '.MJJM.'] },
  { nom: 'gros champignon', lignes: ['..RR..', '.RJRR.', 'RRRRJR', '..MM..', '..MM..', '.VVVV.'] },
  // 7 × 7
  { nom: 'arc-en-ciel', lignes: ['.......', 'RRRRRRR', 'OOOOOOO', 'JJJJJJJ', 'VVVVVVV', 'BBBBBBB', '.......'] },
  { nom: 'bateau', lignes: ['...J...', '...JR..', '...JRR.', '...J...', 'MMMMMMM', '.MMMMM.', 'BBBBBBB'] },
  { nom: 'fusée', lignes: ['...R...', '..BBB..', '..BJB..', '..BBB..', '.BBBBB.', '..O.O..', '..O.O..'] },
];

const couleursDuDessin = d => new Set(d.lignes.join('').replace(/\./g, '')).size;

Jeux.coloriage = {
  id: 'coloriage',
  nom: 'Le coloriage codé',
  icone: '🎨🟥',
  concept: "Coder et décoder une information : chaque symbole représente une couleur, et suivre le code fait apparaître une image. C'est ainsi qu'un ordinateur garde une image : une grille de petits carrés (les pixels), chacun avec un code de couleur.",
  manches: 2,
  niveaux: [
    // taille : côté de la grille ; couleurs : nombre de couleurs du dessin (de min à max).
    { taille: 5, couleursMin: 1, couleursMax: 2 },
    { taille: 5, couleursMin: 3, couleursMax: 3 },
    { taille: 6, couleursMin: 2, couleursMax: 3 },
    { taille: 6, couleursMin: 4, couleursMax: 4 },
    { taille: 7, couleursMin: 4, couleursMax: 5 },
  ],

  textes: {
    intro: 'Chaque symbole a sa couleur. Choisis une couleur en bas, puis touche les cases qui ont le même symbole : un dessin va apparaître !',
    choisis: "Choisis d'abord une couleur en bas !",
    faux: 'Oups ! Regarde le symbole de la case.',
    encore: 'Un nouveau dessin à colorier !',
  },

  // Tout ce que ce jeu peut dire (pour enregistrer les fichiers audio).
  phrases() {
    return Object.values(this.textes);
  },

  lancerManche(zone, { config, premiere, consigne, reussi }) {
    const T = Jeux.coloriage.textes;
    const possibles = DESSINS_CODES.filter(d => d.lignes.length === config.taille
      && couleursDuDessin(d) >= config.couleursMin && couleursDuDessin(d) <= config.couleursMax);
    const dessin = possibles[hasard(possibles.length)];
    const codes = [...new Set(dessin.lignes.join('').replace(/\./g, ''))];
    let choisie = null;
    let restantes = dessin.lignes.join('').replace(/\./g, '').length;

    const grille = el('div', { class: 'grille-coloriage', style: `--n:${dessin.lignes[0].length}` });
    dessin.lignes.forEach(ligne => [...ligne].forEach(code => {
      if (code === '.') return grille.append(el('span', { class: 'case-code vide' }));
      const c = COULEURS_CODE[code];
      const casee = el('button', {
        class: 'case-code', text: c.symbole, 'aria-label': 'Case ' + c.nom,
        onclick: () => {
          if (casee.classList.contains('coloriee')) return;
          if (!choisie) { Son.oups(); Son.dire(T.choisis); return; }
          if (choisie !== code) { Son.oups(); secouer(casee); Son.dire(T.faux); return; }
          Son.pas();
          casee.classList.add('coloriee');
          casee.style.setProperty('--c', c.couleur);
          restantes--;
          if (!restantes) {
            grille.classList.add('fini');
            reussi();
          }
        },
      });
      grille.append(casee);
    }));

    const pots = codes.map(code => {
      const c = COULEURS_CODE[code];
      const pot = el('button', {
        class: 'pot-couleur', style: `--c:${c.couleur}`, text: c.symbole, 'aria-label': 'Couleur ' + c.nom,
        onclick: () => {
          choisie = code;
          Son.pop();
          pots.forEach(p => p.classList.toggle('choisi', p === pot));
        },
      });
      return pot;
    });

    zone.append(grille, el('div', { class: 'palette' }, pots));
    consigne(premiere ? T.intro : T.encore);
  },
};
