// Espace parents : réglages et explications, derrière une question trop difficile pour les enfants.
// La question n'est jamais lue à voix haute, et la réponse se tape au clavier : pas de devinette au hasard.

// Des dates de culture générale : faciles pour un adulte, inconnues des jeunes enfants.
const QUESTIONS_PARENTS = [
  { question: 'En quelle année a eu lieu la prise de la Bastille ?', reponse: 1789 },
  { question: 'En quelle année la France a-t-elle gagné sa première Coupe du monde de football ?', reponse: 1998 },
  { question: 'En quelle année le mur de Berlin est-il tombé ?', reponse: 1989 },
  { question: 'En quelle année a commencé la Première Guerre mondiale ?', reponse: 1914 },
  { question: 'En quelle année s\'est terminée la Seconde Guerre mondiale ?', reponse: 1945 },
];

let derniereQuestion = null;

function ouvrirEspaceParents() {
  if (document.querySelector('.fenetre-parents')) return; // déjà ouvert
  Son.pop();
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  const fenetre = el('div', { class: 'fenetre-parents', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Espace parents' });
  const boite = el('div', { class: 'boite-parents' });
  const fermer = () => {
    fenetre.remove();
    document.removeEventListener('keydown', clavier);
    // Après une remise à zéro, on revient au chaudron pour que les étoiles soient à jour.
    if (boite.dataset.remisAZero) ecranAccueil(null);
  };
  // Échap ferme ; sur ordinateur, les touches du clavier remplissent aussi le pavé de chiffres.
  const clavier = e => {
    if (e.key === 'Escape') fermer();
    else if (boite.touche && /^[0-9]$|^Backspace$/.test(e.key)) boite.touche(e.key);
  };
  document.addEventListener('keydown', clavier);
  fenetre.addEventListener('click', e => { if (e.target === fenetre) fermer(); });
  fenetre.append(boite);
  document.body.append(fenetre);
  afficherQuestion(boite, fermer);
}

function afficherQuestion(boite, fermer) {
  const choix = QUESTIONS_PARENTS.filter(q => q !== derniereQuestion);
  const q = choix[hasard(choix.length)];
  derniereQuestion = q;

  // Un pavé de chiffres à l'écran plutôt que le clavier de la tablette.
  // La réponse est vérifiée dès que tous les chiffres sont tapés (les réponses sont des années).
  const longueur = String(q.reponse).length;
  let saisie = '';
  let attente = false;
  const cases = Array.from({ length: longueur }, () => el('span', { class: 'case-chiffre' }));
  const affichage = el('div', { class: 'affichage-reponse', 'aria-live': 'polite', 'aria-label': 'Ta réponse' }, cases);
  const message = el('p', { class: 'message-porte' });

  const dessiner = () => cases.forEach((c, i) => {
    c.textContent = saisie[i] || '';
    c.classList.toggle('remplie', i < saisie.length);
  });

  const verifier = () => {
    if (Number(saisie) === q.reponse) {
      boite.touche = null;
      Son.succes();
      afficherEspace(boite, fermer);
      return;
    }
    attente = true;
    Son.oups();
    secouer(affichage);
    message.textContent = 'Ce n\'est pas la bonne réponse. Voici une autre question.';
    setTimeout(() => { if (boite.isConnected) afficherQuestion(boite, fermer); }, 1400);
  };

  boite.touche = touche => {
    if (attente) return;
    if (touche === 'Backspace') saisie = saisie.slice(0, -1);
    else if (saisie.length < longueur) saisie += touche;
    Son.pop();
    dessiner();
    if (saisie.length === longueur) verifier();
  };

  const pave = el('div', { class: 'pave' }, [
    ...['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(c => el('button', { class: 'touche', text: c, onclick: () => boite.touche(c) })),
    el('span'),
    el('button', { class: 'touche', text: '0', onclick: () => boite.touche('0') }),
    el('button', { class: 'touche effacer', text: '⌫', 'aria-label': 'Effacer le dernier chiffre', onclick: () => boite.touche('Backspace') }),
  ]);

  boite.replaceChildren(
    enTeteParents('🔒 Espace parents', fermer),
    el('p', { text: 'Pour entrer, réponds à cette question :' }),
    // Espace insécable avant « ? » : le point d'interrogation ne part jamais seul à la ligne.
    el('p', { class: 'question-porte', text: q.question.replace(/ \?$/, String.fromCharCode(160) + '?') }),
    affichage,
    pave,
    message,
  );
}

function enTeteParents(titre, fermer) {
  return el('div', { class: 'entete-parents' }, [
    el('h2', { text: titre }),
    el('button', { class: 'rond', 'aria-label': 'Fermer', text: '✖️', onclick: () => { Son.pop(); fermer(); } }),
  ]);
}

function afficherEspace(boite, fermer) {
  const section = (titre, enfants) => el('section', { class: 'section-parents' }, [el('h3', { text: titre }), ...enfants]);

  const caseACocher = (id, texte, coche, basculer) => {
    const c = el('input', { type: 'checkbox', id });
    c.checked = coche;
    c.addEventListener('change', basculer);
    return el('label', { for: id, class: 'case-a-cocher' }, [c, ' ' + texte]);
  };
  const curseurVolume = (nom, depart, regler) => {
    const c = el('input', { type: 'range', min: '0', max: '100', step: '5', 'aria-label': nom });
    c.value = depart;
    const valeur = el('span', { class: 'valeur-volume', text: depart + ' %' });
    c.addEventListener('input', () => { regler(Number(c.value)); valeur.textContent = c.value + ' %'; });
    return el('div', { class: 'ligne-voix' }, [el('span', { class: 'nom-volume', text: nom }), c, valeur]);
  };

  // Son : tout couper, volume de la voix, musique
  const reglagesSon = el('div', { class: 'reglage' }, [
    caseACocher('parents-son', '🔊 Son (voix, bruitages et musique)', Son.actif, () => Son.basculer()),
    curseurVolume('Volume de la voix', Son.volumeVoix, v => Son.reglerVolumeVoix(v)),
    caseACocher('parents-musique', '🎵 Musique de fond', Son.musiqueActive, () => Son.basculerMusique()),
    curseurVolume('Volume de la musique', Son.musique.reglage, v => Son.musique.reglerVolume(v)),
  ]);

  // Progression
  const effacer = el('button', {
    class: 'bouton-texte petit danger', text: '🗑️ Remettre la progression à zéro',
    onclick: () => {
      if (!confirm('Effacer toutes les étoiles et revenir au niveau 1 dans tous les jeux ?')) return;
      Progres.tout = {};
      Stockage.ecrire('algocadabra-progres-v2', {});
      boite.dataset.remisAZero = '1';
      effacer.textContent = '✔️ Progression remise à zéro';
      effacer.disabled = true;
    },
  });

  const jeux = Object.values(GROUPES).map(g => el('div', { class: 'groupe-parents' }, [
    el('h4', { text: `${g.icone} ${g.nom} (${g.age})` }),
    ...g.jeux.map(id => el('details', { class: 'jeu-parents' }, [
      el('summary', { text: `${Jeux[id].icone} ${Jeux[id].nom}` }),
      el('p', { text: Jeux[id].concept }),
    ])),
  ]));

  boite.replaceChildren(
    enTeteParents('⚙️ Espace parents', fermer),
    section('🎛️ Réglages', [
      reglagesSon,
      choixDeLaVoix(),
      el('div', { class: 'reglage centre' }, [effacer]),
    ]),
    section('📖 À propos', [
      el('p', { text: "Algocadabra fait découvrir la pensée algorithmique. Toutes les consignes sont dites à voix haute (bouton 👂 pour les répéter) : les plus jeunes n'ont pas besoin de savoir lire." }),
      el('p', { text: "Les décors changent à chaque partie (fées, licornes, chatons, potions, espace…) pour que chaque enfant y trouve son bonheur. La progression est enregistrée dans ce navigateur uniquement, rien n'est envoyé sur Internet." }),
    ]),
    section('🧩 Ce que chaque jeu apprend', jeux),
  );
}

// Les voix disponibles dépendent de l'appareil et du navigateur : le parent peut choisir la plus agréable.
function choixDeLaVoix() {
  const liste = el('select', { 'aria-label': 'Voix des consignes' });
  const conseil = el('p', { class: 'conseil-voix' });
  const naturelle = v => /natural|neural|premium|enhanced|google|online/i.test(v.name);

  function remplir() {
    const voix = Son.voixFrancaises();
    liste.replaceChildren(
      el('option', { value: '', text: 'Automatique' + (voix[0] ? ' (' + voix[0].name + ')' : '') }),
      ...voix.map(v => el('option', { value: v.voiceURI, text: (naturelle(v) ? '⭐ ' : '') + v.name })),
    );
    liste.value = voix.some(v => v.voiceURI === Son.voixParent) ? Son.voixParent : '';
    conseil.textContent = !voix.length
      ? "Ce navigateur n'a pas de voix française : les consignes ne seront pas lues."
      : voix.some(naturelle) ? '⭐ = voix naturelle, la moins « robot ».' : '';
  }
  remplir();
  // Une seule liste à jour à la fois.
  if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = remplir;
  liste.addEventListener('change', () => {
    Son.choisirVoixParent(liste.value || null);
    Son.dire('Bonjour ! Je suis la voix de la sorcière. On va bien s\'amuser !');
  });

  return el('div', { class: 'reglage' }, [
    el('label', { text: '🗣️ Voix des consignes' }),
    el('div', { class: 'ligne-voix' }, [
      liste,
      el('button', {
        class: 'bouton-texte petit', text: '▶️ Écouter',
        onclick: () => Son.dire('Bonjour ! Je suis la voix de la sorcière. On va bien s\'amuser !'),
      }),
    ]),
    conseil,
  ]);
}
