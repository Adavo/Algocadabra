// Outils communs aux jeux sur quadrillage (chemin, labyrinthe, grimoire).

const DIRECTIONS = {
  haut: { dx: 0, dy: -1, symbole: '⬆️', nom: 'en haut' },
  bas: { dx: 0, dy: 1, symbole: '⬇️', nom: 'en bas' },
  gauche: { dx: -1, dy: 0, symbole: '⬅️', nom: 'à gauche' },
  droite: { dx: 1, dy: 0, symbole: '➡️', nom: 'à droite' },
};
const ORDRE_DIRECTIONS = ['haut', 'droite', 'bas', 'gauche'];

const cleCase = p => p.x + ',' + p.y;
const memeCase = (a, b) => a.x === b.x && a.y === b.y;

// Plus court chemin entre deux cases, sous forme de liste de directions, ou null si impossible.
function plusCourtChemin(taille, depart, arrivee, bloques) {
  const venu = new Map([[cleCase(depart), null]]);
  const file = [depart];
  while (file.length) {
    const p = file.shift();
    if (memeCase(p, arrivee)) {
      const chemin = [];
      for (let k = cleCase(p); venu.get(k); k = cleCase(venu.get(k).de)) chemin.unshift(venu.get(k).dir);
      return chemin;
    }
    for (const [dir, d] of Object.entries(DIRECTIONS)) {
      const q = { x: p.x + d.dx, y: p.y + d.dy };
      if (q.x < 0 || q.y < 0 || q.x >= taille || q.y >= taille) continue;
      if (bloques.has(cleCase(q)) || venu.has(cleCase(q))) continue;
      venu.set(cleCase(q), { de: p, dir });
      file.push(q);
    }
  }
  return null;
}

function distance(taille, depart, arrivee, bloques) {
  const c = plusCourtChemin(taille, depart, arrivee, bloques);
  return c ? c.length : -1;
}

// Terrain ouvert avec quelques obstacles, où l'arrivée est à une distance voulue.
function genererTerrain(c) {
  const n = c.taille;
  const caseAuHasard = () => ({ x: hasard(n), y: hasard(n) });
  for (let essai = 0; essai < 2000; essai++) {
    const depart = caseAuHasard();
    const arrivee = caseAuHasard();
    if (c.droit && depart.x !== arrivee.x && depart.y !== arrivee.y) continue;
    const bloques = new Set();
    while (bloques.size < c.obstacles) {
      const o = caseAuHasard();
      if (memeCase(o, depart) || memeCase(o, arrivee)) continue;
      bloques.add(cleCase(o));
    }
    const d = distance(n, depart, arrivee, bloques);
    // Avec des obstacles, on veut qu'au moins un gêne vraiment (sinon ils ne servent à rien).
    if (c.obstacles && d === Math.abs(depart.x - arrivee.x) + Math.abs(depart.y - arrivee.y) && essai < 1500) continue;
    if (d >= c.min && d <= c.max) return { depart, arrivee, bloques };
  }
  return { depart: { x: 0, y: 0 }, arrivee: { x: n - 1, y: 0 }, bloques: new Set() };
}

// ['droite','droite','bas'] → [{dir:'droite', fois:2}, {dir:'bas', fois:1}]
function enBlocs(chemin) {
  const blocs = [];
  for (const dir of chemin) {
    const dernier = blocs[blocs.length - 1];
    if (dernier && dernier.dir === dir) dernier.fois++;
    else blocs.push({ dir, fois: 1 });
  }
  return blocs;
}

// Dessine un quadrillage carré. contenu(x, y) renvoie { texte, classe } pour chaque case.
function creerPlateau(taille, contenu, emojiHeros) {
  const plateau = el('div', { class: 'plateau', style: `--n:${taille}` });
  const cases = [];
  for (let y = 0; y < taille; y++) {
    for (let x = 0; x < taille; x++) {
      const c = contenu(x, y) || {};
      const n = el('div', { class: 'case ' + (c.classe || ''), text: c.texte || '' });
      cases.push(n);
      plateau.append(n);
    }
  }
  const heros = el('div', { class: 'heros', text: emojiHeros });
  plateau.append(heros);
  return {
    plateau,
    heros,
    caseEn: p => cases[p.y * taille + p.x],
    placer(p) {
      heros.style.left = (p.x * 100 / taille) + '%';
      heros.style.top = (p.y * 100 / taille) + '%';
    },
  };
}

// Fait jouer un programme en blocs { dir, fois } pas à pas.
// estBloque(q) : la case q est-elle interdite ? arrive(p) : vrai si le but est atteint en p.
// Renvoie { fin: 'gagne' | 'mur' | 'fini' | 'stop', bloc, pos }.
async function jouerBlocs({ blocs, depart, taille, estBloque, arrive, placer, enCours, surBloc, surPas, vitesse = 300 }) {
  let p = { ...depart };
  for (let i = 0; i < blocs.length; i++) {
    surBloc(i);
    const d = DIRECTIONS[blocs[i].dir];
    for (let k = 0; k < blocs[i].fois; k++) {
      await attendre(vitesse);
      if (!enCours()) return { fin: 'stop' };
      const q = { x: p.x + d.dx, y: p.y + d.dy };
      if (q.x < 0 || q.y < 0 || q.x >= taille || q.y >= taille || estBloque(q)) return { fin: 'mur', bloc: i, pos: p };
      p = q;
      placer(p);
      Son.pas();
      if (surPas) surPas(p);
      if (arrive(p)) return { fin: 'gagne', bloc: i, pos: p };
    }
  }
  return { fin: 'fini', bloc: blocs.length - 1, pos: p };
}
