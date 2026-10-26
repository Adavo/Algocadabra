// Navigation : la maison de la sorcière → le chaudron (jeux) → niveaux → jeu.

const GROUPES = {
  petits: { nom: 'Pour les petits', icone: '🐣', age: 'dès 4 ans', jeux: ['suites', 'chemin', 'etapes', 'tri'] },
  grands: { nom: 'Pour les grands', icone: '🦉', age: 'dès 7 ans', jeux: ['labyrinthe', 'grimoire', 'conditions', 'balance'] },
};
const MAGIE = ['✨', '⭐', '🌟', '💫', '🪄', '🔮'];

const racine = document.getElementById('app');

const Progres = {
  tout: Stockage.lire('algocadabra-progres-v2', {}),
  // Nombre de niveaux réussis pour un jeu.
  reussis(jeu) {
    return Math.min(this.tout[jeu.id] || 0, jeu.niveaux.length);
  },
  valider(jeu, niveau) {
    this.tout[jeu.id] = Math.max(this.tout[jeu.id] || 0, niveau + 1);
    Stockage.ecrire('algocadabra-progres-v2', this.tout);
  },
};

let derniereConsigne = '';
let partie = 0; // change à chaque écran : les animations d'un ancien écran s'arrêtent

const groupeDe = jeu => Object.keys(GROUPES).find(g => GROUPES[g].jeux.includes(jeu.id));

// Une page web ne peut pas fermer l'application : « Quitter » arrête la musique et la voix
// et revient à l'écran titre, comme le menu d'un jeu.
function quitter() {
  Son.pop();
  Son.pause();
  ecranTitre();
}

// retour : fonction du bouton en haut à gauche ; sur le tout premier écran, c'est « Quitter ».
function barre(retour, titre, { quitte = false } = {}) {
  // Seule l'oreille est pour les enfants ; le son se règle dans l'espace parents (⚙️).
  return el('header', { class: 'barre' }, [
    quitte
      ? el('button', { class: 'rond', 'aria-label': 'Quitter', title: 'Quitter', text: '🚪', onclick: quitter })
      : retour
        ? el('button', { class: 'rond', 'aria-label': 'Retour', text: '⬅️', onclick: () => { Son.pop(); retour(); } })
        : el('span', { class: 'rond vide' }),
    el('h1', { text: titre }),
    el('div', { class: 'boutons-barre' }, [
      el('button', { class: 'rond', 'aria-label': 'Répéter la consigne', text: '👂', onclick: () => Son.dire(derniereConsigne) }),
      el('button', { class: 'rond', 'aria-label': 'Espace parents (réglages)', title: 'Espace parents', text: '⚙️', onclick: ouvrirEspaceParents }),
    ]),
  ]);
}

function consigne(texte) {
  derniereConsigne = texte;
  Son.dire(texte);
}

// Comme un jeu vidéo : chaque écran remplit la fenêtre, sans défilement.
// Le contenu de <main> est dessiné sur une largeur de référence (900 px au plus), puis agrandi
// ou réduit avec « zoom » pour remplir l'écran. Contrairement à une mise à l'échelle d'image,
// zoom redessine tout à la bonne taille : les textes et les dessins restent nets sur iPad.
const LARGEUR_DESSIN = 900;
const ZOOM_MAX = 2;

// Dès que le contenu de l'écran change (manche suivante, choix qui s'ouvrent…), on réajuste.
let ajustementPrevu = false;
const surveillant = new MutationObserver(mutations => {
  const contenu = racine.querySelector(':scope > main > .ajuste');
  // Nos propres réglages de taille sur le cadre ne comptent pas.
  if (ajustementPrevu || mutations.every(m => m.target === contenu)) return;
  ajustementPrevu = true;
  setTimeout(() => { ajustementPrevu = false; ajusterEcran(); }, 0);
});
const observateur = new ResizeObserver(() => ajusterEcran());

function ajuster(main) {
  const contenu = main && main.querySelector(':scope > .ajuste');
  if (!contenu) return;
  const s = getComputedStyle(main);
  const hauteur = main.clientHeight - parseFloat(s.paddingTop) - parseFloat(s.paddingBottom);
  const largeur = main.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight);
  // On mesure le dessin à sa taille de référence, puis on choisit le zoom qui remplit l'écran.
  contenu.style.zoom = '1';
  contenu.style.width = Math.min(largeur, LARGEUR_DESSIN) + 'px';
  const zoom = Math.min(ZOOM_MAX, largeur / contenu.scrollWidth, hauteur / contenu.scrollHeight);
  contenu.style.zoom = String(Math.floor(zoom * 1000) / 1000);
}

function nouvelEcran(...enfants) {
  partie++;
  observateur.disconnect();
  surveillant.disconnect();
  for (const e of enfants) {
    if (e.tagName !== 'MAIN') continue;
    // Les décors « .plein-ecran » (murs, fenêtre, sol…) restent collés aux bords, hors du cadre ajusté.
    const decors = [...e.children].filter(c => c.classList.contains('plein-ecran'));
    const reste = [...e.childNodes].filter(c => !decors.includes(c));
    e.replaceChildren(...decors, el('div', { class: 'ajuste' }, reste));
  }
  racine.replaceChildren(...enfants);
  // On surveille une fois dans la page : le jeu ajoute son contenu juste après, et il change en cours de partie.
  const main = racine.querySelector(':scope > main');
  if (main) {
    observateur.observe(main);
    surveillant.observe(main.querySelector(':scope > .ajuste'), {
      childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class'],
    });
  }
  ajusterEcran();
  requestAnimationFrame(ajusterEcran);
}

function ajusterEcran() {
  ajuster(racine.querySelector(':scope > main'));
}
window.addEventListener('resize', ajusterEcran);
window.addEventListener('orientationchange', () => setTimeout(ajusterEcran, 300));
// La police arrondie arrive un peu après : les textes changent de taille.
if (document.fonts) document.fonts.ready.then(ajusterEcran);

function etoiles(nb, total) {
  return el('div', { class: 'etoiles', 'aria-label': nb + ' sur ' + total },
    Array.from({ length: total }, (_, i) => el('span', { class: i < nb ? 'pleine' : '', text: '★' })));
}

// ---------- Accueil : la maison de la sorcière ----------

const CHAUDRON_SVG = `
<svg class="chaudron" viewBox="0 0 300 210" aria-hidden="true">
  <defs>
    <radialGradient id="potion" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#d9f99d"/><stop offset="100%" stop-color="#4ade80"/>
    </radialGradient>
    <linearGradient id="fonte" x1="0" x2="1">
      <stop offset="0%" stop-color="#3b3355"/><stop offset="45%" stop-color="#26213a"/><stop offset="100%" stop-color="#15121f"/>
    </linearGradient>
  </defs>
  <rect x="62" y="170" width="18" height="34" rx="6" fill="#15121f"/>
  <rect x="220" y="170" width="18" height="34" rx="6" fill="#15121f"/>
  <path d="M28 58 Q22 196 150 196 Q278 196 272 58 Z" fill="url(#fonte)"/>
  <path d="M60 110 Q70 160 120 172" stroke="#ffffff22" stroke-width="10" fill="none" stroke-linecap="round"/>
  <ellipse cx="150" cy="56" rx="122" ry="24" fill="url(#potion)"/>
  <g class="bulles-svg">
    <circle cx="110" cy="54" r="9" fill="#bbf7d0"/>
    <circle cx="170" cy="50" r="6" fill="#bbf7d0"/>
    <circle cx="200" cy="58" r="10" fill="#bbf7d0"/>
    <circle cx="140" cy="60" r="5" fill="#bbf7d0"/>
  </g>
  <ellipse cx="150" cy="56" rx="130" ry="28" fill="none" stroke="#4a4166" stroke-width="12"/>
</svg>`;

let groupeCourant = null;

function ecranAccueil(groupe = groupeCourant) {
  groupeCourant = groupe;
  const vapeur = el('div', { class: 'vapeur' });

  if (!groupe) {
    derniereConsigne = TEXTES.bienvenue;
    vapeur.append(...Object.entries(GROUPES).map(([id, g], i) => el('button', {
      class: 'bulle grosse-bulle', style: `--d:${i * 0.2}s`,
      onclick: () => { Son.pop(); ecranAccueil(id); consigne(TEXTES.groupe[id]); },
    }, [el('span', { class: 'emoji-bulle', text: g.icone }), el('span', { class: 'nom', text: g.nom }), el('small', { text: g.age })])));
  } else {
    derniereConsigne = TEXTES.choisirBulle;
    vapeur.append(...GROUPES[groupe].jeux.map((id, i) => {
      const jeu = Jeux[id];
      return el('button', {
        class: 'bulle', style: `--d:${i * 0.15}s`,
        onclick: () => { Son.pop(); ecranNiveaux(jeu); },
      }, [
        el('span', { class: 'emoji-bulle', text: jeu.icone }),
        el('span', { class: 'nom', text: jeu.nom }),
        etoiles(Progres.reussis(jeu), jeu.niveaux.length),
      ]);
    }));
  }

  // Le chaudron est posé sur le plancher, comme le reste du décor ; seules les bulles sont au centre.
  const chaudron = el('div', { class: 'chaudron-zone plein-ecran' });
  chaudron.insertAdjacentHTML('beforeend', CHAUDRON_SVG);
  chaudron.append(el('div', { class: 'feu', 'aria-hidden': 'true' }, ['🔥', '🔥', '🔥'].map(f => el('span', { text: f }))));

  nouvelEcran(
    barre(groupe ? () => ecranAccueil(null) : null, groupe ? GROUPES[groupe].icone + ' ' + GROUPES[groupe].nom : '✨ Algocadabra ✨', { quitte: !groupe }),
    // La pièce remplit tout l'écran : le décor « plein-ecran » reste collé aux bords,
    // et seul le chaudron avec ses bulles est agrandi ou réduit au milieu.
    el('main', { class: 'maison' }, [
      el('div', { class: 'fenetre plein-ecran', 'aria-hidden': 'true' }, [el('span', { text: '🌙' }), el('span', { class: 'chauve-souris', text: '🦇' })]),
      el('div', { class: 'etagere plein-ecran', 'aria-hidden': 'true' }, ['🧪', '📕', '🔮', '🕯️', '⚗️', '🍄', '📗'].map(e => el('span', { text: e }))),
      el('div', { class: 'toile plein-ecran', 'aria-hidden': 'true', text: '🕸️' }),
      el('div', { class: 'plancher plein-ecran', 'aria-hidden': 'true' }),
      el('button', {
        class: 'sorciere plein-ecran', 'aria-label': 'La sorcière', text: '🧙‍♀️',
        onclick: () => { Son.pop(); Son.dire(derniereConsigne); },
      }),
      el('div', { class: 'chat plein-ecran', 'aria-hidden': 'true', text: '🐈‍⬛' }),
      chaudron,
      vapeur,
    ]),
  );
}

// ---------- Un jeu : choisir un niveau ----------

function ecranNiveaux(jeu) {
  consigne(TEXTES.choisirNiveau(jeu));
  const faits = Progres.reussis(jeu);
  const boutons = jeu.niveaux.map((_, i) => {
    const ouvert = i <= faits;
    return el('button', {
      class: 'niveau' + (i < faits ? ' fait' : '') + (ouvert ? '' : ' ferme'),
      'aria-label': 'Niveau ' + (i + 1) + (ouvert ? '' : ', fermé'),
      onclick: () => {
        if (!ouvert) { Son.oups(); Son.dire(TEXTES.niveauFerme); return; }
        Son.pop();
        lancerNiveau(jeu, i);
      },
    }, [el('span', { text: ouvert ? String(i + 1) : '🔒' }), i < faits ? el('small', { text: '★' }) : null]);
  });
  nouvelEcran(
    barre(() => ecranAccueil(groupeDe(jeu)), jeu.nom),
    el('main', {}, [
      el('div', { class: 'grand-emoji centre', text: jeu.icone }),
      el('div', { class: 'grille-niveaux' }, boutons),
    ]),
  );
}

// ---------- Le jeu ----------

function lancerNiveau(jeu, niveau) {
  const nbManches = jeu.manches;
  const points = Array.from({ length: nbManches }, () => el('span', { class: 'point' }));
  const zone = el('section', { class: 'zone-jeu' });
  nouvelEcran(
    barre(() => ecranNiveaux(jeu), jeu.icone + ' Niveau ' + (niveau + 1)),
    el('main', {}, [el('div', { class: 'manches' }, points), zone]),
  );
  const maPartie = partie;
  let manche = 0;

  function jouerManche() {
    zone.replaceChildren();
    zone.className = 'zone-jeu';
    jeu.lancerManche(zone, {
      decor: tirerDecor(),
      niveau,
      config: jeu.niveaux[niveau],
      premiere: manche === 0,
      consigne,
      enCours: () => partie === maPartie,
      recommencer: () => { if (partie === maPartie) jouerManche(); },
      reussi: async () => {
        if (partie !== maPartie) return;
        points[manche].classList.add('gagne');
        Son.succes();
        Son.dire(ENCOURAGEMENTS[hasard(ENCOURAGEMENTS.length)]);
        await attendre(1400);
        if (partie !== maPartie) return;
        manche++;
        if (manche < nbManches) jouerManche();
        else finNiveau(jeu, niveau);
      },
    });
  }
  jouerManche();
}

function finNiveau(jeu, niveau) {
  Progres.valider(jeu, niveau);
  Son.fete();
  confettis(MAGIE);
  const suivant = niveau + 1 < jeu.niveaux.length;
  consigne(suivant ? TEXTES.etoile : TEXTES.toutFini);
  const fenetre = el('div', { class: 'fete' }, [
    el('div', { class: 'boite-fete' }, [
      el('div', { class: 'grosse-etoile', text: '⭐' }),
      el('p', { class: 'bravo', text: 'Bravo !' }),
      el('div', { class: 'choix-fete' }, [
        el('button', { class: 'rond gros', 'aria-label': 'Retour au chaudron', text: '🏠', onclick: () => { fenetre.remove(); ecranAccueil(groupeDe(jeu)); } }),
        el('button', { class: 'rond gros', 'aria-label': 'Rejouer', text: '🔁', onclick: () => { fenetre.remove(); lancerNiveau(jeu, niveau); } }),
        suivant
          ? el('button', { class: 'rond gros vert', 'aria-label': 'Niveau suivant', text: '▶️', onclick: () => { fenetre.remove(); lancerNiveau(jeu, niveau + 1); } })
          : null,
      ]),
    ]),
  ]);
  document.body.append(fenetre);
}

// ---------- Écran titre ----------
// Les navigateurs (surtout sur iPad) interdisent tout son avant un premier toucher :
// ce gros bouton « Jouer » débloque la musique et la voix avant d'entrer dans la maison.

function ecranTitre() {
  const jouer = () => {
    Son.debloquer();
    Son.reprendre();
    Son.pop();
    ecranAccueil(null);
    consigne(derniereConsigne);
  };
  nouvelEcran(el('main', { class: 'titre' }, [
    el('div', { class: 'etincelles', 'aria-hidden': 'true' }, ['✨', '⭐', '🌙', '✨', '💫', '⭐'].map(e => el('span', { text: e }))),
    el('h1', { class: 'grand-titre', text: 'Algocadabra' }),
    el('p', { class: 'sous-titre-titre', text: 'Les jeux magiques de la sorcière' }),
    el('div', { class: 'personnages', 'aria-hidden': 'true' }, [
      el('span', { class: 'sorciere-titre', text: '🧙‍♀️' }),
      el('span', { class: 'chat-titre', text: '🐈‍⬛' }),
    ]),
    el('button', { class: 'bouton-jouer', 'aria-label': 'Jouer', onclick: jouer }, [
      el('span', { class: 'triangle', 'aria-hidden': 'true' }),
    ]),
    el('p', { class: 'indice-titre', text: '👆 Touche pour jouer' }),
  ]));
}

ecranTitre();
