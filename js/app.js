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

function barre(retour, titre) {
  // Seule l'oreille est pour les enfants ; le son se règle dans l'espace parents (⚙️).
  return el('header', { class: 'barre' }, [
    retour
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

function nouvelEcran(...enfants) {
  partie++;
  racine.replaceChildren(...enfants);
  window.scrollTo(0, 0);
}

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
    derniereConsigne = 'Bienvenue chez la sorcière ! Dans son chaudron magique, il y a des jeux. Choisis : les jeux pour les petits, ou les jeux pour les grands.';
    vapeur.append(...Object.entries(GROUPES).map(([id, g], i) => el('button', {
      class: 'bulle grosse-bulle', style: `--d:${i * 0.2}s`,
      onclick: () => { Son.pop(); ecranAccueil(id); consigne(id === 'petits' ? 'Les jeux pour les petits ! Choisis une bulle.' : 'Les jeux pour les grands ! Choisis une bulle.'); },
    }, [el('span', { class: 'emoji-bulle', text: g.icone }), el('span', { class: 'nom', text: g.nom }), el('small', { text: g.age })])));
  } else {
    derniereConsigne = 'Choisis une bulle du chaudron.';
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

  const chaudron = el('div', { class: 'chaudron-zone' }, [vapeur]);
  chaudron.insertAdjacentHTML('beforeend', CHAUDRON_SVG);
  chaudron.append(el('div', { class: 'feu', 'aria-hidden': 'true' }, ['🔥', '🔥', '🔥'].map(f => el('span', { text: f }))));

  nouvelEcran(
    barre(groupe ? () => ecranAccueil(null) : null, groupe ? GROUPES[groupe].icone + ' ' + GROUPES[groupe].nom : '✨ Algocadabra ✨'),
    el('main', { class: 'maison' }, [
      el('div', { class: 'piece' }, [
        el('div', { class: 'fenetre', 'aria-hidden': 'true' }, [el('span', { text: '🌙' }), el('span', { class: 'chauve-souris', text: '🦇' })]),
        el('div', { class: 'etagere', 'aria-hidden': 'true' }, ['🧪', '📕', '🔮', '🕯️', '⚗️', '🍄', '📗'].map(e => el('span', { text: e }))),
        el('div', { class: 'toile', 'aria-hidden': 'true', text: '🕸️' }),
        el('div', { class: 'scene' }, [
          el('button', {
            class: 'sorciere', 'aria-label': 'La sorcière', text: '🧙‍♀️',
            onclick: () => { Son.pop(); Son.dire(derniereConsigne); },
          }),
          chaudron,
          el('div', { class: 'chat', 'aria-hidden': 'true', text: '🐈‍⬛' }),
        ]),
        el('div', { class: 'plancher', 'aria-hidden': 'true' }),
      ]),
    ]),
  );
}

// ---------- Un jeu : choisir un niveau ----------

function ecranNiveaux(jeu) {
  consigne(jeu.nom + '. Choisis un niveau.');
  const faits = Progres.reussis(jeu);
  const boutons = jeu.niveaux.map((_, i) => {
    const ouvert = i <= faits;
    return el('button', {
      class: 'niveau' + (i < faits ? ' fait' : '') + (ouvert ? '' : ' ferme'),
      'aria-label': 'Niveau ' + (i + 1) + (ouvert ? '' : ', fermé'),
      onclick: () => {
        if (!ouvert) { Son.oups(); Son.dire("Réussis d'abord le niveau d'avant !"); return; }
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
  consigne(suivant ? 'Bravo, tu as gagné une étoile ! On continue ?' : 'Bravo ! Tu as fini tous les niveaux de ce jeu !');
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

ecranAccueil(null);
