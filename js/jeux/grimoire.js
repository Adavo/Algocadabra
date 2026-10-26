// Le grimoire : le sort (programme) de la sorcière contient des erreurs, il faut les trouver et les corriger.

// Exécute un programme sans animation : arrive-t-il au but ?
function sortReussi(blocs, depart, arrivee, taille, bloques) {
  let p = { ...depart };
  for (const b of blocs) {
    const d = DIRECTIONS[b.dir];
    for (let k = 0; k < b.fois; k++) {
      p = { x: p.x + d.dx, y: p.y + d.dy };
      if (p.x < 0 || p.y < 0 || p.x >= taille || p.y >= taille || bloques.has(cleCase(p))) return false;
      if (memeCase(p, arrivee)) return true;
    }
  }
  return false;
}

// Ajoute des erreurs au bon programme : une flèche changée, ou un nombre de répétitions faux.
function abimerSort(bon, nbErreurs, avecNombres, verifier) {
  for (let essai = 0; essai < 200; essai++) {
    const sort = bon.map(b => ({ ...b }));
    for (const i of melanger(sort.map((_, i) => i)).slice(0, nbErreurs)) {
      const b = sort[i];
      if (avecNombres && Math.random() < 0.4) {
        b.fois = b.fois > 1 && Math.random() < 0.5 ? b.fois - 1 : b.fois + 1;
      } else {
        const autres = ORDRE_DIRECTIONS.filter(d => d !== b.dir);
        b.dir = autres[hasard(autres.length)];
      }
    }
    if (!verifier(sort)) return sort;
  }
  return null;
}

Jeux.grimoire = {
  id: 'grimoire',
  nom: 'Le grimoire ensorcelé',
  icone: '📖🐞',
  concept: "Déboguer : lire un programme écrit par quelqu'un d'autre, le tester, repérer où il se trompe et le corriger sans tout réécrire. C'est une grande partie du vrai travail de programmeur.",
  manches: 2,
  niveaux: [
    { taille: 4, obstacles: 2, min: 4, max: 5, erreurs: 1 },
    { taille: 5, obstacles: 3, min: 5, max: 6, erreurs: 1 },
    { taille: 5, obstacles: 3, min: 6, max: 7, erreurs: 1, nombres: true },
    { taille: 6, obstacles: 5, min: 7, max: 9, erreurs: 2, nombres: true },
    { taille: 6, obstacles: 6, min: 8, max: 10, erreurs: 2, nombres: true },
  ],

  textes: {
    citrouille: "Le chat s'est cogné contre une citrouille !",
    horsPlateau: 'Le chat est sorti du plateau !',
    ligneRouge: 'Le problème est sur la ligne en rouge, ou peut-être avant.',
    fini: "Le sort est fini, mais le chat n'est pas sur la potion. Cherche l'erreur !",
    intro: (erreurs, nombres) => `La sorcière a écrit un sort pour amener son chat jusqu'à la potion, mais il y a ${erreurs > 1 ? 'deux erreurs' : 'une erreur'}. Attention, le chat ne peut pas passer sur les citrouilles ! Lance le sort pour voir ce qui se passe, puis touche une flèche${nombres ? ' ou un nombre' : ''} pour la changer.`,
    encore: erreurs => `Un nouveau sort avec ${erreurs > 1 ? 'deux erreurs' : 'une erreur'}. À toi de jouer !`,
  },

  // Tout ce que ce jeu peut dire (pour enregistrer les fichiers audio), pour chaque niveau.
  phrases() {
    const T = this.textes;
    return [
      T.citrouille, T.horsPlateau, T.ligneRouge, T.fini,
      ...this.niveaux.flatMap(c => [T.intro(c.erreurs, c.nombres), T.encore(c.erreurs)]),
    ];
  },

  lancerManche(zone, { config, premiere, consigne, enCours, reussi }) {
    const T = Jeux.grimoire.textes;
    const n = config.taille;
    let terrain, original;
    do {
      terrain = genererTerrain(config);
      const chemin = plusCourtChemin(n, terrain.depart, terrain.arrivee, terrain.bloques);
      const bon = config.nombres ? enBlocs(chemin) : chemin.map(dir => ({ dir, fois: 1 }));
      original = abimerSort(bon, config.erreurs, config.nombres,
        s => sortReussi(s, terrain.depart, terrain.arrivee, n, terrain.bloques));
    } while (!original);
    const { depart, arrivee, bloques } = terrain;
    let sort = original.map(b => ({ ...b }));
    let occupe = false;

    const { plateau, heros, placer } = creerPlateau(n, (x, y) => {
      if (bloques.has(x + ',' + y)) return { texte: '🎃', classe: 'bloquee' };
      if (x === arrivee.x && y === arrivee.y) return { texte: '🧪' };
      return {};
    }, '🐈‍⬛');
    placer(depart);

    const livre = el('ol', { class: 'grimoire' });
    function dessiner(actif = -1, erreur = -1) {
      livre.replaceChildren(...sort.map((b, i) => {
        const change = b.dir !== original[i].dir || b.fois !== original[i].fois;
        return el('li', { class: 'ligne-sort' + (i === actif ? ' active' : '') + (i === erreur ? ' erreur' : '') + (change ? ' change' : '') }, [
          el('button', {
            class: 'bloc-fleche', text: DIRECTIONS[b.dir].symbole, 'aria-label': 'Changer la direction',
            onclick: () => {
              if (occupe) return;
              b.dir = ORDRE_DIRECTIONS[(ORDRE_DIRECTIONS.indexOf(b.dir) + 1) % 4];
              Son.pop();
              dessiner();
            },
          }),
          config.nombres
            ? el('button', {
              class: 'bloc-fois', text: '× ' + b.fois, 'aria-label': 'Changer le nombre de répétitions',
              onclick: () => { if (occupe) return; b.fois = b.fois % 9 + 1; Son.pop(); dessiner(); },
            })
            : null,
        ]);
      }));
    }

    async function executer() {
      if (occupe) return;
      occupe = true;
      zone.classList.add('occupe');
      const r = await jouerBlocs({
        blocs: sort, depart, taille: n, placer, enCours,
        estBloque: q => bloques.has(cleCase(q)),
        arrive: p => memeCase(p, arrivee),
        surBloc: i => dessiner(i),
      });
      if (r.fin === 'stop') return;
      if (r.fin === 'gagne') { heros.classList.add('arrive'); return reussi(); }
      Son.oups();
      if (r.fin === 'mur') {
        secouer(heros);
        const p = DIRECTIONS[sort[r.bloc].dir];
        const q = { x: r.pos.x + p.dx, y: r.pos.y + p.dy };
        const obstacle = bloques.has(cleCase(q));
        Son.dire((obstacle ? T.citrouille : T.horsPlateau) + ' ' + T.ligneRouge);
      } else {
        Son.dire(T.fini);
      }
      await attendre(1800);
      if (!enCours()) return;
      placer(depart);
      dessiner(-1, r.fin === 'mur' ? r.bloc : -1);
      occupe = false;
      zone.classList.remove('occupe');
    }

    dessiner();
    zone.classList.add('jeu-chemin');
    zone.append(
      plateau,
      el('div', { class: 'pupitre' }, [
        el('p', { class: 'compteur', text: config.erreurs > 1 ? '🐞 Ce sort contient 2 erreurs' : '🐞 Ce sort contient 1 erreur' }),
        livre,
        el('div', { class: 'actions' }, [
          el('button', {
            class: 'rond', text: '↺', 'aria-label': 'Remettre le sort de départ',
            onclick: () => { if (!occupe) { sort = original.map(b => ({ ...b })); Son.pop(); dessiner(); } },
          }),
          el('button', { class: 'rond gros vert', text: '▶️', 'aria-label': 'Lancer le sort', onclick: executer }),
        ]),
      ]),
    );

    consigne(premiere ? T.intro(config.erreurs, config.nombres) : T.encore(config.erreurs));
  },
};
