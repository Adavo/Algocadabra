// Le tri de la sorcière : écrire une règle « SI … ALORS … SINON … » qui range les ingrédients
// qui défilent sur le tapis. Plus tard, il faut deviner la règle à partir d'exemples,
// puis enchaîner deux conditions (« SINON SI »).

const INGREDIENTS = [
  { e: '🍄', un: "c'est un champignon", les: 'les champignons' },
  { e: '🎃', un: "c'est une citrouille", les: 'les citrouilles' },
  { e: '⭐', un: "c'est une étoile", les: 'les étoiles' },
  { e: '🍎', un: "c'est une pomme", les: 'les pommes' },
  { e: '🐸', un: "c'est une grenouille", les: 'les grenouilles' },
  { e: '💎', un: "c'est un cristal", les: 'les cristaux' },
];

const RANGEMENTS = {
  chaudron: { icone: '🍲', nom: 'Chaudron', dans: 'dans le chaudron' },
  bocal: { icone: '🫙', nom: 'Bocal', dans: 'dans le bocal' },
  panier: { icone: '🧺', nom: 'Panier', dans: 'dans le panier' },
};

// Les conditions qu'on peut choisir, selon les sortes demandées par le niveau.
function conditionsPour(sortes, types) {
  const c = [];
  if (sortes.includes('type')) {
    for (const t of types) {
      const i = INGREDIENTS.find(x => x.e === t);
      c.push({ id: t, texte: i.un + ' ' + t, groupe: i.les, test: o => o.type === t });
    }
  }
  if (sortes.includes('taille')) {
    c.push({ id: 'grand', texte: "c'est grand", groupe: 'les grands ingrédients', test: o => o.grand });
    c.push({ id: 'petit', texte: "c'est petit", groupe: 'les petits ingrédients', test: o => !o.grand });
  }
  if (sortes.includes('brille')) {
    c.push({ id: 'brille', texte: 'ça brille ✨', groupe: 'les ingrédients qui brillent', test: o => o.brille });
    c.push({ id: 'terne', texte: 'ça ne brille pas', groupe: 'les ingrédients qui ne brillent pas', test: o => !o.brille });
  }
  return c;
}

// Où une règle { conds, dests } envoie un ingrédient, et quelle ligne de la règle a décidé.
function appliquerRegle(regle, o) {
  if (regle.conds[0].test(o)) return { dest: regle.dests[0], ligne: 0 };
  if (regle.conds.length > 1 && regle.conds[1].test(o)) return { dest: regle.dests[1], ligne: 1 };
  return { dest: regle.dests[regle.dests.length - 1], ligne: regle.conds.length };
}

function permutations(t) {
  if (t.length <= 1) return [t];
  return t.flatMap((x, i) => permutations([...t.slice(0, i), ...t.slice(i + 1)]).map(p => [x, ...p]));
}

// Toutes les règles qu'un enfant pourrait écrire avec les choix proposés.
function toutesLesRegles(conds, destIds, imbrique) {
  const regles = [];
  for (const dests of permutations(destIds)) {
    for (const c1 of conds) {
      if (!imbrique) { regles.push({ conds: [c1], dests }); continue; }
      for (const c2 of conds) if (c2 !== c1) regles.push({ conds: [c1, c2], dests });
    }
  }
  return regles;
}

const memeTri = (r1, r2, objets) => objets.every(o => appliquerRegle(r1, o).dest === appliquerRegle(r2, o).dest);

function genererTri(c) {
  const destIds = c.imbrique ? ['chaudron', 'bocal', 'panier'] : ['chaudron', 'bocal'];
  for (let essai = 0; essai < 800; essai++) {
    const types = melanger(INGREDIENTS).slice(0, c.types).map(i => i.e);
    const objet = () => ({ type: types[hasard(types.length)], grand: Math.random() < 0.5, brille: Math.random() < 0.4 });
    const conds = conditionsPour(c.sortes, types);
    const regles = toutesLesRegles(conds, destIds, c.imbrique);
    const cible = regles[hasard(regles.length)];
    const tapis = Array.from({ length: c.nb }, objet);
    const exemples = Array.from({ length: c.exemples || 0 }, objet);

    // Chaque rangement doit recevoir au moins un ingrédient (deux s'il n'y en a que deux).
    const minimum = c.imbrique ? 1 : 2;
    const assez = objets => destIds.every(d => objets.filter(o => appliquerRegle(cible, o).dest === d).length >= minimum);
    if (!assez(tapis)) continue;
    if (c.exemples) {
      if (!assez(exemples)) continue;
      // Les exemples doivent suffire : toute règle qui les explique doit ranger le tapis de la même façon.
      if (regles.some(r => memeTri(r, cible, exemples) && !memeTri(r, cible, tapis))) continue;
    }
    return { types, conds, destIds, cible, tapis, exemples };
  }
  return null;
}

function dessinIngredient(o, petit) {
  return el('span', {
    class: 'ingredient' + (o.grand ? ' grand' : '') + (petit ? ' mini' : ''),
    'aria-label': INGREDIENTS.find(i => i.e === o.type).un.replace("c'est ", '') + (o.grand ? ', grand' : ', petit') + (o.brille ? ', qui brille' : ''),
  }, [o.type, o.brille ? el('span', { class: 'paillettes', text: '✨' }) : null]);
}

Jeux.conditions = {
  id: 'conditions',
  nom: 'Le tri de la sorcière',
  icone: '🍄❓',
  concept: "Les conditions : « SI c'est vrai, ALORS on fait ceci, SINON on fait cela ». Le programme prend une décision différente selon chaque ingrédient. Dans les niveaux avec exemples, il faut d'abord deviner la règle (raisonnement par induction) ; à la fin, on enchaîne deux conditions avec « SINON SI ».",
  manches: 2,
  niveaux: [
    { sortes: ['type'], types: 3, nb: 6 },
    { sortes: ['type', 'taille', 'brille'], types: 3, nb: 7 },
    { sortes: ['type', 'taille', 'brille'], types: 3, nb: 8, exemples: 7 },
    { sortes: ['type', 'taille', 'brille'], types: 3, nb: 8, imbrique: true },
    { sortes: ['type', 'brille'], types: 3, nb: 9, exemples: 9, imbrique: true },
  ],

  lancerManche(zone, { config, premiere, consigne, enCours, reussi }) {
    const tri = genererTri(config);
    const { conds, destIds, cible, tapis, exemples } = tri;
    const nbLignes = cible.conds.length + 1;
    const regle = { conds: cible.conds.map(() => null), dests: destIds.map(() => null) };
    let actif = null; // { sorte: 'cond' | 'dest', i }
    let occupe = false;

    // La parole de la sorcière
    let texte;
    if (config.exemples) {
      texte = "J'ai commencé à ranger mes ingrédients. Trouve ma règle, puis écris-la pour ranger ceux du tapis !";
    } else if (cible.conds.length === 1) {
      texte = `Mets ${cible.conds[0].groupe} ${RANGEMENTS[cible.dests[0]].dans}, et tout le reste ${RANGEMENTS[cible.dests[1]].dans}.`;
    } else {
      texte = `Mets ${cible.conds[0].groupe} ${RANGEMENTS[cible.dests[0]].dans}. Pour les autres : ${cible.conds[1].groupe} ${RANGEMENTS[cible.dests[1]].dans}, et tout le reste ${RANGEMENTS[cible.dests[2]].dans}.`;
    }
    const bulle = el('div', { class: 'parole' }, [el('span', { class: 'qui', text: '🧙‍♀️' }), el('p', { text: '« ' + texte + ' »' })]);

    // Les exemples déjà rangés
    let blocExemples = null;
    if (config.exemples) {
      blocExemples = el('div', { class: 'exemples' }, destIds.map(d => el('div', { class: 'bac petit-bac' }, [
        el('div', { class: 'bac-titre', text: RANGEMENTS[d].icone + ' ' + RANGEMENTS[d].nom }),
        el('div', { class: 'bac-contenu' }, exemples.filter(o => appliquerRegle(cible, o).dest === d).map(o => dessinIngredient(o, true))),
      ])));
    }

    // Le tapis
    const objets = tapis.map(o => ({ o, n: dessinIngredient(o) }));
    const tapisEl = el('div', { class: 'tapis' }, objets.map(x => x.n));

    // L'éditeur de règle
    const panneau = el('div', { class: 'panneau-choix' });
    const lignes = [];
    function emplacement(sorte, i) {
      const valeur = sorte === 'cond' ? regle.conds[i] : regle.dests[i];
      const texteCase = valeur == null ? '?' : sorte === 'cond' ? valeur.texte : RANGEMENTS[valeur].icone + ' ' + RANGEMENTS[valeur].nom;
      const estActif = actif && actif.sorte === sorte && actif.i === i;
      return el('button', {
        class: 'emplacement-regle ' + sorte + (valeur == null ? ' vide' : '') + (estActif ? ' ouvert' : ''),
        text: texteCase,
        onclick: () => {
          if (occupe) return;
          actif = estActif ? null : { sorte, i };
          Son.pop();
          dessinerRegle();
        },
      });
    }
    const editeur = el('div', { class: 'regle' });
    function dessinerRegle() {
      lignes.length = 0;
      const mot = t => el('span', { class: 'mot-cle', text: t });
      for (let i = 0; i < cible.conds.length; i++) {
        lignes.push(el('div', { class: 'ligne-regle' }, [mot(i === 0 ? 'SI' : 'SINON SI'), emplacement('cond', i), mot('ALORS →'), emplacement('dest', i)]));
      }
      lignes.push(el('div', { class: 'ligne-regle' }, [mot('SINON →'), emplacement('dest', nbLignes - 1)]));
      editeur.replaceChildren(...lignes);

      panneau.replaceChildren();
      if (!actif) return;
      const options = actif.sorte === 'cond'
        ? conds.map(c => ({ texte: c.texte, valeur: c }))
        : destIds.map(d => ({ texte: RANGEMENTS[d].icone + ' ' + RANGEMENTS[d].nom, valeur: d }));
      panneau.append(...options.map(op => el('button', {
        class: 'puce', text: op.texte,
        onclick: () => {
          (actif.sorte === 'cond' ? regle.conds : regle.dests)[actif.i] = op.valeur;
          actif = null;
          Son.pop();
          dessinerRegle();
        },
      })));
    }

    // Les rangements
    const bacs = Object.fromEntries(destIds.map(d => [d, el('div', { class: 'bac-contenu' })]));
    const blocBacs = el('div', { class: 'bacs' }, destIds.map(d => el('div', { class: 'bac' }, [
      el('div', { class: 'bac-titre', text: RANGEMENTS[d].icone + ' ' + RANGEMENTS[d].nom }),
      bacs[d],
    ])));

    function remettreSurLeTapis() {
      for (const x of objets) {
        x.n.classList.remove('faux', 'actif');
        tapisEl.append(x.n);
      }
      lignes.forEach(l => l.classList.remove('active'));
    }

    async function executer() {
      if (occupe) return;
      if (regle.conds.includes(null) || regle.dests.includes(null)) {
        Son.oups();
        Son.dire('Complète toute la règle : touche chaque point d\'interrogation.');
        editeur.querySelectorAll('.vide').forEach(secouer);
        return;
      }
      occupe = true;
      actif = null;
      dessinerRegle();
      zone.classList.add('occupe');
      let erreurs = 0;
      for (const x of objets) {
        const { dest, ligne } = appliquerRegle(regle, x.o);
        lignes.forEach((l, i) => l.classList.toggle('active', i === ligne));
        x.n.classList.add('actif');
        await attendre(650);
        if (!enCours()) return;
        x.n.classList.remove('actif');
        bacs[dest].append(x.n);
        if (dest !== appliquerRegle(cible, x.o).dest) {
          erreurs++;
          x.n.classList.add('faux');
          Son.oups();
        } else {
          Son.pas();
        }
        await attendre(250);
      }
      lignes.forEach(l => l.classList.remove('active'));
      if (!erreurs) return reussi();
      Son.dire(erreurs === 1
        ? "Un ingrédient n'est pas à la bonne place. Regarde-le bien, puis change ta règle !"
        : `${erreurs} ingrédients ne sont pas à la bonne place. Regarde-les bien, puis change ta règle !`);
      await attendre(3000);
      if (!enCours()) return;
      remettreSurLeTapis();
      occupe = false;
      zone.classList.remove('occupe');
    }

    dessinerRegle();
    zone.classList.add('jeu-tri-magique');
    zone.append(...[
      bulle,
      blocExemples,
      el('p', { class: 'legende', text: 'Sur le tapis :' }),
      tapisEl,
      editeur,
      panneau,
      el('div', { class: 'actions' }, [el('button', { class: 'rond gros vert', text: '▶️', 'aria-label': 'Lancer la règle', onclick: executer })]),
      blocBacs,
    ].filter(Boolean));

    const debut = premiere
      ? (cible.conds.length > 1
        ? 'Cette fois, la règle a deux conditions : SI, puis SINON SI, puis SINON. '
        : 'Écris une règle pour ranger les ingrédients : SI quelque chose est vrai, ALORS on le range ici, SINON on le range là. Touche les points d\'interrogation pour choisir. ')
      : '';
    consigne(debut + texte);
  },
};
