// L'aventure : le chaudron de la sorcière a perdu ses 5 cristaux ; le chat part les chercher
// dans 5 lieux (de la maison au sommet des étoiles). Chaque lieu est un chemin de 10 étapes,
// une par activité, au niveau du lieu (lieu 1 = niveau 1… lieu 5 = niveau 5).
// Aucun texte à lire pour l'enfant : les scènes sont des images animées, racontées par la voix.

// L'ordre des activités sur le chemin d'un lieu : on alterne les genres de jeux.
const ORDRE_AVENTURE = ['suites', 'memoire', 'chemin', 'tresor', 'etapes', 'recette', 'tri', 'machine', 'tour', 'coloriage'];
const ETAPES_PAR_LIEU = ORDRE_AVENTURE.length;

const AVENTURE = {
  textes: {
    intro1: 'Chez la sorcière, le chaudron magique brille grâce à cinq cristaux.',
    intro2: 'Mais un matin… pouf ! Les cristaux se sont envolés dans tout le pays !',
    intro3: "Le chat de la sorcière part les chercher. Tu viens l'aider ?",
    carte: 'Touche le lieu où se trouve le chat pour continuer le voyage.',
    rejouer: 'Tu as retrouvé tous les cristaux ! Tu peux rejouer dans tous les lieux du voyage.',
    lieuFerme: "Ce lieu est encore dans les nuages. Termine d'abord le voyage d'avant !",
    bienvenue: m => `Bienvenue ${m.dans} ! Le cristal ${m.couleurCristal} est caché par ici. Joue aux jeux du chemin pour le retrouver !`,
    etapeFermee: "Cette étape n'est pas encore ouverte. Joue d'abord celle où se trouve le chat !",
    suite: 'Bravo ! On continue le chemin ?',
    cristal: m => `Bravo ! Tu as trouvé le cristal ${m.couleurCristal} !`,
    enRoute: m => `En route vers ${m.vers} !`,
    fin1: 'Le chat rapporte les cinq cristaux à la maison.',
    fin2: 'Les cristaux retournent dans le chaudron, et il brille de toutes les couleurs !',
    fin3: 'Bravo ! Grâce à toi, la magie est revenue. Merci pour ton aide !',
  },

  // Tout ce que l'aventure peut dire (pour enregistrer les fichiers audio).
  phrases() {
    const T = this.textes;
    return [
      T.intro1, T.intro2, T.intro3, T.carte, T.rejouer, T.lieuFerme, T.etapeFermee, T.suite, T.fin1, T.fin2, T.fin3,
      ...MONDES_AVENTURE.flatMap(m => [T.bienvenue(m), T.cristal(m), T.enRoute(m)]),
    ];
  },

  // Où en est l'enfant : nombre d'étapes réussies (0 à 50) et si l'histoire du début a été vue.
  lire() {
    return Stockage.lire('algocadabra-aventure', { etapes: 0, introVue: false });
  },
  ecrire(etat) {
    Stockage.ecrire('algocadabra-aventure', etat);
  },
  lieuCourant(etat) {
    return Math.min(Math.floor(etat.etapes / ETAPES_PAR_LIEU), MONDES_AVENTURE.length - 1);
  },
  cristauxTrouves(etat) {
    return Math.floor(etat.etapes / ETAPES_PAR_LIEU);
  },
};

// ---------- Petits outils de dessin ----------

const cristal = (couleur, classe = '') => el('span', { class: 'cristal ' + classe, style: `--c:${couleur}`, 'aria-hidden': 'true' });

// Un élément placé sur la scène (coordonnées du dessin de référence, centre de l'élément).
function poser(element, x, y) {
  element.style.left = x + 'px';
  element.style.top = y + 'px';
  return element;
}

// Le fond du jeu prend la couleur du lieu (matin, midi, après-midi, coucher de soleil, nuit).
function teinter(monde) {
  const s = document.documentElement.style;
  if (monde) {
    s.setProperty('--nuit1', monde.ciel[0]);
    s.setProperty('--nuit2', monde.ciel[1]);
  } else {
    s.removeProperty('--nuit1');
    s.removeProperty('--nuit2');
  }
}

function ouvrirAventure() {
  const etat = AVENTURE.lire();
  if (etat.introVue) return ecranCarte();
  jouerScenes(SCENES_INTRO, () => {
    AVENTURE.ecrire({ ...AVENTURE.lire(), introVue: true });
    ecranCarte();
  });
}

// ---------- Les scènes racontées (sans texte) ----------
// Chaque scène dessine des personnages animés et la voix raconte ; elle passe toute seule
// quand la voix a fini, ou tout de suite avec le bouton ⏭️.

function jouerScenes(scenes, suite) {
  teinter(null);
  let numero = 0;
  let fini = false;
  const scene = el('div', { class: 'scene-histoire' });
  const passer = el('button', { class: 'rond gros passer', 'aria-label': 'Passer', text: '⏭️', onclick: () => { Son.pop(); suivante(); } });
  nouvelEcran(el('main', { class: 'cinematique' }, [scene, el('div', { class: 'plein-ecran bouton-passer' }, [passer])]));
  const maPartie = partie;

  async function montrer() {
    const n = numero;
    scene.replaceChildren();
    scenes[n].dessiner(scene);
    Son.dire(scenes[n].texte);
    const debut = Date.now();
    await attendre(500);
    while ((Son.parle || Date.now() - debut < 3000) && partie === maPartie && n === numero) await attendre(200);
    await attendre(900);
    if (partie === maPartie && n === numero) suivante();
  }

  function suivante() {
    if (fini || partie !== maPartie) return;
    numero++;
    if (numero >= scenes.length) {
      fini = true;
      Son.taire();
      suite();
      return;
    }
    montrer();
  }

  montrer();
}

// La sorcière et son chaudron, au centre de la scène.
function dessinerChaudron(scene, classe = '') {
  const c = el('div', { class: 'chaudron-histoire ' + classe });
  c.insertAdjacentHTML('beforeend', CHAUDRON_SVG);
  return poser(c, 470, 400);
}

const SCENES_INTRO = [
  {
    texte: AVENTURE.textes.intro1,
    dessiner(scene) {
      scene.append(
        poser(el('span', { class: 'perso sorciere-histoire berce', text: '🧙‍♀️' }), 200, 380),
        dessinerChaudron(scene),
        ...MONDES_AVENTURE.map((m, i) => poser(cristal(m.cristal, 'flotte'), 330 + i * 70, 170 + (i % 2) * 40)),
        poser(el('span', { class: 'perso petit', text: '✨' }), 700, 160),
      );
    },
  },
  {
    texte: AVENTURE.textes.intro2,
    dessiner(scene) {
      // Les cristaux partent dans toutes les directions.
      const directions = [[-420, -260], [-200, -330], [0, -360], [220, -330], [430, -260]];
      scene.append(
        poser(el('span', { class: 'perso sorciere-histoire secoue-long', text: '🧙‍♀️' }), 200, 380),
        dessinerChaudron(scene, 'tremble'),
        poser(el('span', { class: 'perso pouf', text: '💨' }), 470, 240),
        ...MONDES_AVENTURE.map((m, i) => {
          const c = cristal(m.cristal, 'envol');
          c.style.setProperty('--dx', directions[i][0] + 'px');
          c.style.setProperty('--dy', directions[i][1] + 'px');
          c.style.animationDelay = (0.6 + i * 0.12) + 's';
          return poser(c, 470, 250);
        }),
      );
    },
  },
  {
    texte: AVENTURE.textes.intro3,
    dessiner(scene) {
      scene.append(
        poser(el('span', { class: 'perso chat-histoire arrive-gauche', text: '🐈‍⬛' }), 450, 400),
        poser(el('span', { class: 'perso petit apparait-tard', text: '🗺️' }), 600, 300),
        ...MONDES_AVENTURE.map((m, i) => poser(cristal('#ffffff33', 'vide'), 300 + i * 75, 160)),
      );
    },
  },
];

const SCENES_FIN = [
  {
    texte: AVENTURE.textes.fin1,
    dessiner(scene) {
      scene.append(
        poser(el('span', { class: 'perso chat-histoire saute-doux', text: '🐈‍⬛' }), 450, 400),
        ...MONDES_AVENTURE.map((m, i) => poser(cristal(m.cristal, 'flotte'), 310 + i * 80, 200 + (i % 2) * 40)),
      );
    },
  },
  {
    texte: AVENTURE.textes.fin2,
    dessiner(scene) {
      scene.append(
        dessinerChaudron(scene, 'arc-en-ciel'),
        ...MONDES_AVENTURE.map((m, i) => {
          const c = cristal(m.cristal, 'plonge');
          c.style.setProperty('--dx', (470 - (310 + i * 80)) + 'px');
          c.style.animationDelay = (0.4 + i * 0.35) + 's';
          return poser(c, 310 + i * 80, 160);
        }),
      );
    },
  },
  {
    texte: AVENTURE.textes.fin3,
    dessiner(scene) {
      scene.append(
        poser(el('span', { class: 'perso sorciere-histoire danse', text: '🧙‍♀️' }), 200, 380),
        dessinerChaudron(scene, 'arc-en-ciel'),
        poser(el('span', { class: 'perso chat-histoire danse', text: '🐈‍⬛' }), 740, 420),
        poser(el('span', { class: 'perso petit', text: '🌈' }), 470, 170),
      );
      Son.fete();
      confettis(['✨', '⭐', '🌟', ...MONDES_AVENTURE.map(m => m.ami)]);
    },
  },
];

// ---------- La carte du pays ----------
// La maison de la sorcière au centre ; les 4 autres lieux tout autour, reliés par un chemin qui fait
// le tour de la maison : le potager à droite, la forêt en bas, le lac à gauche, le sommet en haut.
// Le ciel va du jour (en bas) à la nuit étoilée (en haut), comme le voyage.

const CENTRE_CARTE = [450, 320];
const PLACES_CARTE = [CENTRE_CARTE, [740, 340], [450, 530], [160, 340], [450, 100]];

// Un chemin arrondi qui passe par les lieux, en tournant autour de la maison.
function cheminAutour(points) {
  if (points.length < 2) return '';
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [ax, ay] = points[i - 1], [bx, by] = points[i];
    // Le point de contrôle s'éloigne du centre : le chemin s'arrondit vers l'extérieur.
    const mx = (ax + bx) / 2, my = (ay + by) / 2;
    const ecart = i === 1 ? 0.15 : 0.55;
    const cx = mx + (mx - CENTRE_CARTE[0]) * ecart, cy = my + (my - CENTRE_CARTE[1]) * ecart;
    d += ` Q ${cx} ${cy} ${bx} ${by}`;
  }
  return d;
}

function ecranCarte(annonce) {
  teinter(null);
  const etat = AVENTURE.lire();
  const courant = AVENTURE.lieuCourant(etat);
  const trouves = AVENTURE.cristauxTrouves(etat);
  const toutFini = trouves >= MONDES_AVENTURE.length;

  // Le paysage dessiné (js/illustrations.js), avec le chemin de terre qui fait le tour de la maison.
  const paysage = el('div', { class: 'illustration-carte' });
  paysage.innerHTML = svgPaysageCarte(cheminAutour(PLACES_CARTE));

  // Par-dessus le chemin de terre : des étincelles dorées là où le chat est déjà passé.
  const parcouru = el('div', { class: 'trace-carte' });
  parcouru.innerHTML = `<svg viewBox="0 0 900 600" aria-hidden="true">
    <path d="${cheminAutour(PLACES_CARTE.slice(0, toutFini ? PLACES_CARTE.length : courant + 1))}" class="chemin-dore"/>
  </svg>`;

  // Chaque lieu du dessin se touche : un halo pour celui en cours, un nuage pour ceux pas encore atteints.
  const lieux = MONDES_AVENTURE.map((m, i) => {
    const ouvert = i <= courant || toutFini;
    const zone = poser(el('button', {
      class: 'zone-lieu' + (i === 0 ? ' zone-maison' : '') + (ouvert ? '' : ' cache') + (i === courant && !toutFini ? ' actuel' : ''),
      'aria-label': m.nom,
      onclick: () => {
        if (!ouvert) { Son.oups(); Son.dire(AVENTURE.textes.lieuFerme); return; }
        Son.pop();
        ecranLieu(m, { arrivee: true });
      },
    }, [i < trouves ? cristal(m.cristal, 'badge') : null]), PLACES_CARTE[i][0], PLACES_CARTE[i][1]);
    if (!ouvert) zone.insertAdjacentHTML('beforeend', SVG_NUAGE);
    return zone;
  });

  // Le chat attend à côté du lieu en cours (devant la maison quand tout est fini).
  const ouEstLeChat = toutFini ? PLACES_CARTE[0] : PLACES_CARTE[courant];
  const chat = poser(el('div', { class: 'chat-carte' }), ouEstLeChat[0] - (courant === 0 || toutFini ? 100 : 86), ouEstLeChat[1] + 40);
  chat.innerHTML = SVG_CHAT;

  // Les 5 cristaux à retrouver, en haut à gauche.
  const reserve = poser(el('div', { class: 'reserve-cristaux' }, MONDES_AVENTURE.map((m, i) =>
    cristal(i < trouves ? m.cristal : '#ffffff22', i < trouves ? 'trouve' : 'vide'))), 190, 46);

  nouvelEcran(
    barre(() => ecranAccueil(null), '🗺️ ' + (toutFini ? '🎉' : '')),
    el('main', { class: 'carte-pays' }, [
      el('div', { class: 'scene-carte' }, [paysage, parcouru, ...lieux, chat, reserve]),
    ]),
  );
  consigne(annonce || (toutFini ? AVENTURE.textes.rejouer : AVENTURE.textes.carte));
}

// ---------- Le chemin d'un lieu (10 étapes) ----------

// Les 10 pierres en deux rangées qui serpentent ; le cristal attend au bout.
const PIERRES = [
  ...[190, 340, 490, 640, 790].map(x => [x, 170]),
  ...[790, 640, 490, 340, 190].map(x => [x, 390]),
];
const PLACE_CRISTAL = [70, 390];

function ecranLieu(monde, { arrivee = false, depuis = null } = {}) {
  teinter(monde);
  const etat = AVENTURE.lire();
  const indexLieu = MONDES_AVENTURE.indexOf(monde);
  const premiereEtape = indexLieu * ETAPES_PAR_LIEU;
  const faites = Math.max(0, Math.min(ETAPES_PAR_LIEU, etat.etapes - premiereEtape));
  const cristalTrouve = faites >= ETAPES_PAR_LIEU;

  // Le décor dessiné du lieu (js/illustrations.js), avec son chemin qui relie les pierres.
  const decor = el('div', { class: 'illustration-carte' });
  decor.innerHTML = svgDecorLieu(monde.id, 'M ' + [...PIERRES, PLACE_CRISTAL].map(p => p.join(' ')).join(' L '));

  const trace = el('div', { class: 'trace-carte' });
  trace.innerHTML = `<svg viewBox="0 0 900 520" aria-hidden="true">
    <polyline points="${[...PIERRES, PLACE_CRISTAL].map(p => p.join(',')).join(' ')}" class="chemin-a-venir"/>
    <polyline points="${[...PIERRES.slice(0, faites + 1), ...(cristalTrouve ? [PLACE_CRISTAL] : [])].map(p => p.join(',')).join(' ')}" class="chemin-fait"/>
  </svg>`;

  const pierres = ORDRE_AVENTURE.map((id, k) => {
    const jeu = Jeux[id];
    const etatPierre = k < faites ? 'faite' : k === faites ? 'courante' : 'fermee';
    return poser(el('button', {
      class: 'pierre ' + etatPierre, 'aria-label': jeu.nom,
      onclick: () => {
        if (etatPierre === 'fermee') { Son.oups(); Son.dire(AVENTURE.textes.etapeFermee); return; }
        Son.pop();
        lancerEtape(monde, k);
      },
    }, [
      el('span', { class: 'icone-pierre', text: jeu.icone.match(/\p{Extended_Pictographic}/u)?.[0] || '⭐' }),
      k < faites ? el('span', { class: 'etoile-pierre', text: '⭐' }) : null,
    ]), PIERRES[k][0], PIERRES[k][1]);
  });

  // Le chat est assis sur l'étape à jouer ; s'il vient de réussir, il saute depuis la précédente.
  const ou = cristalTrouve ? PLACE_CRISTAL : PIERRES[faites];
  const chat = el('div', { class: 'chat-lieu' });
  chat.innerHTML = SVG_CHAT;
  if (depuis !== null && PIERRES[depuis]) {
    poser(chat, PIERRES[depuis][0], PIERRES[depuis][1] - 58);
    setTimeout(() => { chat.classList.add('saute-vers'); poser(chat, ou[0], ou[1] - 58); }, 500);
  } else {
    poser(chat, ou[0], ou[1] - 58);
  }

  const tresor = poser(el('div', { class: 'socle-cristal' + (cristalTrouve ? ' trouve' : '') }, [
    cristal(cristalTrouve ? monde.cristal : '#ffffff40', cristalTrouve ? 'grand trouve' : 'grand cache'),
    el('span', { class: 'ami-socle', text: monde.ami }),
  ]), PLACE_CRISTAL[0], PLACE_CRISTAL[1]);

  nouvelEcran(
    barre(() => ecranCarte(), monde.icone + ' ' + monde.nom),
    el('main', { class: 'lieu-aventure' }, [el('div', { class: 'scene-lieu' }, [decor, trace, ...pierres, tresor, chat])]),
  );
  if (arrivee) consigne(cristalTrouve ? AVENTURE.textes.cristal(monde) : AVENTURE.textes.bienvenue(monde));
}

function lancerEtape(monde, k) {
  teinter(monde);
  const niveau = MONDES_AVENTURE.indexOf(monde);
  lancerNiveau(Jeux[ORDRE_AVENTURE[k]], niveau, {
    decor: monde,
    retour: () => ecranLieu(monde),
    fin: () => apresEtape(monde, k),
  });
}

function apresEtape(monde, k) {
  const etat = AVENTURE.lire();
  const numero = MONDES_AVENTURE.indexOf(monde) * ETAPES_PAR_LIEU + k;
  const nouvelle = numero === etat.etapes;
  if (nouvelle) AVENTURE.ecrire({ ...etat, etapes: etat.etapes + 1 });
  Son.fete();
  confettis(['✨', '⭐', monde.ami, ...monde.motifs.slice(0, 2)]);
  if (nouvelle && k === ETAPES_PAR_LIEU - 1) return ceremonieCristal(monde);
  ecranLieu(monde, { depuis: nouvelle ? k : null });
  consigne(AVENTURE.textes.suite);
}

// ---------- Le cristal retrouvé ----------

function ceremonieCristal(monde) {
  const index = MONDES_AVENTURE.indexOf(monde);
  const suivant = MONDES_AVENTURE[index + 1];
  teinter(monde);
  nouvelEcran(el('main', { class: 'ceremonie' }, [
    el('div', { class: 'scene-ceremonie' }, [
      cristal(monde.cristal, 'geant'),
      el('span', { class: 'ami-ceremonie danse', text: monde.ami }),
      el('span', { class: 'chat-ceremonie danse', text: '🐈‍⬛' }),
    ]),
  ]));
  const maPartie = partie;
  Son.fete();
  confettis(['✨', '💎', '⭐', monde.ami]);
  Son.dire(AVENTURE.textes.cristal(monde));
  (async () => {
    await attendre(800);
    while (Son.parle && partie === maPartie) await attendre(200);
    await attendre(1200);
    if (partie !== maPartie) return;
    if (suivant) ecranCarte(AVENTURE.textes.enRoute(suivant));
    else jouerScenes(SCENES_FIN, () => ecranCarte());
  })();
}
