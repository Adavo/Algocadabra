// Le labyrinthe : planifier tout le trajet de la chauve-souris avant de lancer le programme,
// avec un nombre de blocs limité qui oblige à utiliser les répétitions (les boucles).

// Labyrinthe parfait de k × k salles, dessiné sur (2k+1) × (2k+1) cases (murs compris).
function creuserLabyrinthe(k, ouvertures) {
  const n = 2 * k + 1;
  const murs = new Set();
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) murs.add(x + ',' + y);
  const salle = s => ({ x: 2 * s.x + 1, y: 2 * s.y + 1 });
  const vus = new Set(['0,0']);
  const pile = [{ x: 0, y: 0 }];
  murs.delete(cleCase(salle(pile[0])));
  while (pile.length) {
    const s = pile[pile.length - 1];
    const voisines = melanger(Object.values(DIRECTIONS))
      .map(d => ({ x: s.x + d.dx, y: s.y + d.dy, d }))
      .filter(v => v.x >= 0 && v.y >= 0 && v.x < k && v.y < k && !vus.has(cleCase(v)));
    if (!voisines.length) { pile.pop(); continue; }
    const v = voisines[0];
    vus.add(cleCase(v));
    const a = salle(s);
    murs.delete(cleCase({ x: a.x + v.d.dx, y: a.y + v.d.dy }));
    murs.delete(cleCase(salle(v)));
    pile.push({ x: v.x, y: v.y });
  }
  // Quelques murs intérieurs en moins : il y a alors plusieurs chemins possibles.
  for (let i = 0; i < ouvertures; i++) {
    const x = 1 + hasard(n - 2), y = 1 + hasard(n - 2);
    if ((x + y) % 2 === 1) murs.delete(x + ',' + y);
  }
  return { n, murs, salle };
}

function genererLabyrinthe(c) {
  for (let essai = 0; essai < 400; essai++) {
    const { n, murs, salle } = creuserLabyrinthe(c.salles, c.ouvertures || 0);
    const depart = salle({ x: 0, y: hasard(c.salles) });
    const sortie = salle({ x: c.salles - 1, y: hasard(c.salles) });
    let cle = null;
    let chemin = plusCourtChemin(n, depart, sortie, murs);
    if (c.cle) {
      cle = salle({ x: hasard(c.salles), y: hasard(c.salles) });
      if (memeCase(cle, depart) || memeCase(cle, sortie)) continue;
      const aller = plusCourtChemin(n, depart, cle, murs);
      const retour = plusCourtChemin(n, cle, sortie, murs);
      // La clé doit être en dehors du chemin direct, sinon elle ne demande aucune réflexion.
      if (aller.length + retour.length <= chemin.length) continue;
      chemin = aller.concat(retour);
    }
    const blocs = enBlocs(chemin).length;
    if (blocs >= c.blocsMin && blocs <= c.blocsMaxi) {
      return { n, murs, depart, sortie, cle, blocsMax: blocs + c.marge };
    }
  }
  return null;
}

Jeux.labyrinthe = {
  id: 'labyrinthe',
  nom: 'La grotte de la chauve-souris',
  icone: '🦇🌕',
  concept: "Planifier un algorithme en entier avant de l'exécuter. Le nombre de blocs est limité : il faut repérer les déplacements répétés et utiliser « répéter N fois », c'est-à-dire une boucle. Avec la clé, il faut découper le problème en deux sous-objectifs.",
  manches: 2,
  niveaux: [
    { salles: 3, blocsMin: 3, blocsMaxi: 5, marge: 2 },
    { salles: 4, blocsMin: 5, blocsMaxi: 7, marge: 1 },
    { salles: 4, blocsMin: 6, blocsMaxi: 9, marge: 1, cle: true },
    { salles: 5, blocsMin: 6, blocsMaxi: 9, marge: 0, ouvertures: 3 },
    { salles: 5, blocsMin: 8, blocsMaxi: 11, marge: 0, cle: true, ouvertures: 2 },
  ],

  textes: {
    pasDeBlocs: "Ajoute d'abord des blocs !",
    mur: 'Aïe, un mur ! Le bloc en rouge ne marche pas. Corrige ton programme.',
    sortieFermee: "La sortie est fermée : il faut d'abord prendre la clé !",
    pasSortie: "Le programme est fini mais la chauve-souris n'est pas sortie. Continue ton programme !",
    plusDeBlocs: "Tu as utilisé tous tes blocs ! Touche le nombre d'un bloc pour le répéter plusieurs fois.",
    intro: blocs => `Fais sortir la chauve-souris de la grotte, jusqu'à la lune. Tu n'as que ${blocs} blocs : touche le nombre d'un bloc pour le répéter plusieurs fois. Prépare tout le programme, puis appuie sur le bouton vert.`,
    encore: blocs => `Une nouvelle grotte ! Tu as ${blocs} blocs.`,
    cle: "Attention : la sortie est fermée, il faut d'abord prendre la clé.",
  },

  // Tout ce que ce jeu peut dire (pour enregistrer les fichiers audio),
  // pour chaque nombre de blocs possible d'un niveau à l'autre.
  phrases() {
    const T = this.textes;
    const nombres = new Set(this.niveaux.flatMap(c =>
      Array.from({ length: c.blocsMaxi - c.blocsMin + 1 }, (_, i) => c.blocsMin + i + c.marge)));
    return [
      T.pasDeBlocs, T.mur, T.sortieFermee, T.pasSortie, T.plusDeBlocs, T.cle,
      ...[...nombres].flatMap(b => [T.intro(b), T.encore(b)]),
    ];
  },

  lancerManche(zone, { config, premiere, consigne, enCours, reussi }) {
    const T = Jeux.labyrinthe.textes;
    const lab = genererLabyrinthe(config);
    const { n, murs, depart, sortie, cle, blocsMax } = lab;
    const programme = [];
    let occupe = false;
    let aCle = false;

    const { plateau, heros, placer, caseEn } = creerPlateau(n, (x, y) => {
      const p = { x, y };
      if (murs.has(cleCase(p))) return { classe: 'mur' };
      if (memeCase(p, sortie)) return { texte: '🌕', classe: 'sortie' };
      if (cle && memeCase(p, cle)) return { texte: '🗝️' };
      return {};
    }, '🦇');
    plateau.classList.add('grotte');
    placer(depart);

    const compteur = el('p', { class: 'compteur' });
    const bande = el('div', { class: 'programme blocs' });

    function dessiner(actif = -1, erreur = -1) {
      compteur.textContent = `🧱 ${programme.length} / ${blocsMax} blocs` + (cle ? (aCle ? '  ·  🗝️ ✔️' : '  ·  🗝️ à prendre') : '');
      const lignes = programme.map((b, i) => el('div', {
        class: 'bloc' + (i === actif ? ' active' : '') + (i === erreur ? ' erreur' : ''),
      }, [
        el('span', { class: 'bloc-fleche', text: DIRECTIONS[b.dir].symbole }),
        el('button', {
          class: 'bloc-fois', text: '× ' + b.fois, 'aria-label': 'Répéter ' + b.fois + ' fois, toucher pour changer',
          onclick: () => { if (occupe) return; b.fois = b.fois % 9 + 1; Son.pop(); dessiner(); },
        }),
        el('button', {
          class: 'bloc-suppr', text: '✖', 'aria-label': 'Enlever ce bloc',
          onclick: () => { if (occupe) return; programme.splice(i, 1); Son.pop(); dessiner(); },
        }),
      ]));
      const vides = Array.from({ length: blocsMax - programme.length }, () => el('div', { class: 'bloc vide' }));
      bande.replaceChildren(...lignes, ...vides);
    }

    function reinitialiser(erreur) {
      if (!enCours()) return;
      aCle = false;
      if (cle) caseEn(cle).textContent = '🗝️';
      placer(depart);
      dessiner(-1, erreur);
      occupe = false;
      zone.classList.remove('occupe');
    }

    async function executer() {
      if (occupe) return;
      if (!programme.length) { Son.dire(T.pasDeBlocs); return; }
      occupe = true;
      zone.classList.add('occupe');
      const r = await jouerBlocs({
        blocs: programme, depart, taille: n, placer, enCours,
        estBloque: q => murs.has(cleCase(q)),
        arrive: p => memeCase(p, sortie) && (!cle || aCle),
        surBloc: i => dessiner(i),
        surPas: p => {
          if (cle && !aCle && memeCase(p, cle)) { aCle = true; caseEn(cle).textContent = ''; Son.pop(); dessiner(); }
        },
      });
      if (r.fin === 'stop') return;
      if (r.fin === 'gagne') { heros.classList.add('arrive'); return reussi(); }
      Son.oups();
      if (r.fin === 'mur') {
        secouer(heros);
        Son.dire(T.mur);
      } else if (memeCase(r.pos, sortie)) {
        Son.dire(T.sortieFermee);
      } else {
        Son.dire(T.pasSortie);
      }
      await attendre(1800);
      reinitialiser(r.fin === 'mur' ? r.bloc : -1);
    }

    const fleches = Object.entries(DIRECTIONS).map(([cleDir, d]) => el('button', {
      class: 'fleche fleche-' + cleDir, text: d.symbole, 'aria-label': 'Ajouter un bloc ' + d.nom,
      onclick: () => {
        if (occupe) return;
        if (programme.length >= blocsMax) {
          Son.oups();
          Son.dire(T.plusDeBlocs);
          return;
        }
        programme.push({ dir: cleDir, fois: 1 });
        Son.pop();
        dessiner();
      },
    }));

    dessiner();
    zone.classList.add('jeu-chemin');
    zone.append(
      plateau,
      el('div', { class: 'pupitre' }, [
        compteur,
        bande,
        el('div', { class: 'commandes' }, [
          el('div', { class: 'croix' }, fleches),
          el('div', { class: 'actions' }, [
            el('button', {
              class: 'rond', text: '🗑️', 'aria-label': 'Tout effacer',
              onclick: () => { if (!occupe) { programme.length = 0; Son.pop(); dessiner(); } },
            }),
            el('button', { class: 'rond gros vert', text: '▶️', 'aria-label': 'Lancer le programme', onclick: executer }),
          ]),
        ]),
      ]),
    );

    consigne((premiere ? T.intro(blocsMax) : T.encore(blocsMax)) + (cle ? ' ' + T.cle : ''));
  },
};
