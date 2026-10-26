// Le chemin : écrire un petit programme de flèches pour guider le personnage.

const MAX_FLECHES = 14;

// « jusqu'à la fleur », mais « jusqu'au gâteau ».
const jusqua = nom => nom.startsWith('le ') ? "jusqu'au " + nom.slice(3) : "jusqu'à " + nom;

Jeux.chemin = {
  id: 'chemin',
  nom: 'Le chemin',
  icone: '🐈‍⬛➡️',
  concept: "Écrire un programme : une suite d'instructions (les flèches) que le personnage exécute dans l'ordre, une par une. Si ça ne marche pas, on cherche l'erreur et on corrige : c'est le « débogage ».",
  manches: 2,
  niveaux: [
    { taille: 3, min: 1, max: 2, obstacles: 0, droit: true },
    { taille: 4, min: 2, max: 3, obstacles: 0 },
    { taille: 4, min: 3, max: 4, obstacles: 1 },
    { taille: 5, min: 4, max: 6, obstacles: 2 },
    { taille: 5, min: 6, max: 7, obstacles: 4 },
  ],

  lancerManche(zone, { decor, config, premiere, consigne, enCours, reussi }) {
    const n = config.taille;
    const { depart, arrivee, bloques } = genererTerrain(config);
    const programme = [];
    let occupe = false;

    const plateau = el('div', { class: 'plateau', style: `--n:${n}` });
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const contenu = bloques.has(x + ',' + y) ? decor.obstacle
          : (x === arrivee.x && y === arrivee.y) ? decor.but : '';
        plateau.append(el('div', { class: 'case' + (contenu === decor.obstacle ? ' bloquee' : ''), text: contenu }));
      }
    }
    const heros = el('div', { class: 'heros', text: decor.heros });
    plateau.append(heros);
    const placer = p => {
      heros.style.left = (p.x * 100 / n) + '%';
      heros.style.top = (p.y * 100 / n) + '%';
    };
    placer(depart);

    const bande = el('div', { class: 'programme', 'aria-label': 'Mon programme' });
    function dessinerProgramme(actif = -1) {
      bande.replaceChildren(...programme.map((d, i) => el('button', {
        class: 'instruction' + (i === actif ? ' active' : ''),
        text: DIRECTIONS[d].symbole,
        'aria-label': 'Retirer cette flèche',
        onclick: () => { if (occupe) return; programme.splice(i, 1); Son.pop(); dessinerProgramme(); },
      })));
      if (!programme.length) bande.append(el('span', { class: 'vide-programme', text: '…' }));
    }
    dessinerProgramme();

    const fleches = Object.entries(DIRECTIONS).map(([cle, d]) => el('button', {
      class: 'fleche fleche-' + cle, text: d.symbole, 'aria-label': d.nom,
      onclick: () => {
        if (occupe) return;
        if (programme.length >= MAX_FLECHES) { Son.oups(); return; }
        programme.push(cle);
        Son.pop();
        dessinerProgramme();
      },
    }));

    async function executer() {
      if (occupe) return;
      if (!programme.length) { Son.dire('Choisis d\'abord des flèches !'); return; }
      occupe = true;
      zone.classList.add('occupe');
      let p = { ...depart };
      for (let i = 0; i < programme.length; i++) {
        dessinerProgramme(i);
        const d = DIRECTIONS[programme[i]];
        const q = { x: p.x + d.dx, y: p.y + d.dy };
        await attendre(350);
        if (!enCours()) return;
        const dehors = q.x < 0 || q.y < 0 || q.x >= n || q.y >= n;
        if (dehors || bloques.has(q.x + ',' + q.y)) {
          secouer(heros);
          Son.oups();
          Son.dire((dehors ? 'Oups, on sort du plateau !' : `Oups, on ne peut pas passer sur ${decor.nomObstacles} !`)
            + ' Regarde la flèche qui clignote et corrige-la.');
          await attendre(1800);
          return recommencer(i);
        }
        p = q;
        placer(p);
        Son.pas();
        if (p.x === arrivee.x && p.y === arrivee.y) {
          heros.classList.add('arrive');
          return reussi();
        }
      }
      await attendre(500);
      if (!enCours()) return;
      Son.oups();
      Son.dire('Presque ! Il manque des flèches pour arriver ' + jusqua(decor.nomBut) + '.');
      await attendre(1200);
      recommencer(-1);
    }

    function recommencer(erreur) {
      if (!enCours()) return;
      placer(depart);
      dessinerProgramme(erreur);
      occupe = false;
      zone.classList.remove('occupe');
    }

    zone.classList.add('jeu-chemin');
    zone.append(
      plateau,
      el('div', { class: 'pupitre' }, [bande, el('div', { class: 'commandes' }, [
        el('div', { class: 'croix' }, fleches),
        el('div', { class: 'actions' }, [
          el('button', {
            class: 'rond', text: '↩️', 'aria-label': 'Effacer la dernière flèche',
            onclick: () => { if (!occupe && programme.pop()) { Son.pop(); dessinerProgramme(); } },
          }),
          el('button', {
            class: 'rond', text: '🗑️', 'aria-label': 'Tout effacer',
            onclick: () => { if (!occupe) { programme.length = 0; Son.pop(); dessinerProgramme(); } },
          }),
          el('button', { class: 'rond gros vert', text: '▶️', 'aria-label': 'Lancer le programme', onclick: executer }),
        ]),
      ])]),
    );

    const texteObstacles = config.obstacles
      ? ` Attention : ${decor.nomObstacles} bloquent le chemin, on ne peut pas passer dessus. Il faut faire le tour !`
      : '';
    consigne((premiere
      ? `Aide ${decor.nomHeros} à aller ${jusqua(decor.nomBut)}. Choisis les flèches, puis appuie sur le bouton vert.`
      : `Encore ! Emmène ${decor.nomHeros} ${jusqua(decor.nomBut)}.`) + texteObstacles);
  },
};
