// La machine magique : deux exemples montrent ce que fait la machine à un objet ;
// il faut deviner ce qui sortira pour le suivant.

// Un objet : { e: emoji, grand: bool, nb: nombre d'exemplaires }.
// Chaque règle dit quel objet elle reçoit (entree) et ce qu'elle en fait (applique).
const REGLES_MACHINE = {
  grandit: { entree: { grand: false, nb: 1 }, applique: o => ({ ...o, grand: true }) },
  retrecit: { entree: { grand: true, nb: 1 }, applique: o => ({ ...o, grand: false }) },
  double: { entree: { grand: false, nb: 1 }, applique: o => ({ ...o, nb: 2 }) },
  triple: { entree: { grand: false, nb: 1 }, applique: o => ({ ...o, nb: 3 }) },
  moitie: { entree: { grand: false, nb: 2 }, applique: o => ({ ...o, nb: 1 }) },
  // Deux règles à la fois.
  'grandit+double': { entree: { grand: false, nb: 1 }, applique: o => ({ ...o, grand: true, nb: 2 }) },
  'retrecit+double': { entree: { grand: true, nb: 1 }, applique: o => ({ ...o, grand: false, nb: 2 }) },
  'grandit+triple': { entree: { grand: false, nb: 1 }, applique: o => ({ ...o, grand: true, nb: 3 }) },
};

const memeObjet = (a, b) => a.e === b.e && a.grand === b.grand && a.nb === b.nb;

function dessinObjet(o, classe = '') {
  return el('span', { class: 'objet-machine ' + (o.grand ? 'grand ' : '') + classe },
    Array.from({ length: o.nb }, () => el('span', { text: o.e })));
}

Jeux.machine = {
  id: 'machine',
  nom: 'La machine magique',
  icone: '🎩✨',
  concept: "Comprendre une transformation à partir d'exemples, puis la prévoir : un objet entre, la machine applique toujours la même règle, un résultat sort. C'est l'idée d'une fonction en programmation (entrée → règle → sortie).",
  manches: 2,
  niveaux: [
    // regles : celles que la machine peut avoir ; choix : nombre de réponses proposées.
    { regles: ['grandit', 'double'], choix: 3 },
    { regles: ['grandit', 'retrecit', 'double'], choix: 3 },
    { regles: ['double', 'triple', 'moitie'], choix: 3 },
    { regles: ['grandit+double', 'retrecit+double'], choix: 4 },
    { regles: ['grandit+double', 'retrecit+double', 'grandit+triple'], choix: 4 },
  ],

  textes: {
    intro: "Voici une machine magique. Regarde ce qu'elle fait aux objets ! Que va-t-il sortir pour le dernier ?",
    faux: 'Regarde bien ce que fait la machine.',
    encore: 'Une autre machine magique !',
  },

  // Tout ce que ce jeu peut dire (pour enregistrer les fichiers audio).
  phrases() {
    return Object.values(this.textes);
  },

  lancerManche(zone, { decor, config, premiere, manche, consigne, reussi }) {
    const T = Jeux.machine.textes;
    // Une règle différente à chaque manche : on tire la première au hasard, puis on passe à la suivante.
    if (premiere) Jeux.machine.premiereRegle = hasard(config.regles.length);
    const regle = REGLES_MACHINE[config.regles[(Jeux.machine.premiereRegle + manche) % config.regles.length]];
    const [a, b, c] = melanger(decor.motifs).map(e => ({ e, ...regle.entree }));
    const reponse = regle.applique(c);

    const ligne = (entree, sortie) => el('div', { class: 'ligne-machine' }, [
      dessinObjet(entree),
      el('span', { class: 'tapis-machine', text: '➡️' }),
      el('span', { class: 'chapeau', text: '🎩' }),
      el('span', { class: 'tapis-machine', text: '➡️' }),
      sortie,
    ]);
    const trou = el('span', { class: 'objet-machine trou', text: '?' });

    // Les pièges : l'objet sans changement, puis ce que donneraient les autres règles.
    const pieges = [c, ...Object.values(REGLES_MACHINE).map(r => r.applique(c))]
      .filter((o, i, t) => !memeObjet(o, reponse) && t.findIndex(x => memeObjet(x, o)) === i);
    const proposes = [reponse, c, ...melanger(pieges.filter(o => !memeObjet(o, c)))].slice(0, config.choix);
    let fini = false;
    const choix = melanger(proposes).map(o => {
      const bouton = el('button', {
        class: 'carte-choix choix-machine',
        onclick: () => {
          if (fini) return;
          if (!memeObjet(o, reponse)) {
            Son.oups();
            secouer(bouton);
            Son.dire(T.faux);
            return;
          }
          fini = true;
          trou.replaceWith(dessinObjet(o, 'juste'));
          bouton.classList.add('juste');
          reussi();
        },
      }, [dessinObjet(o)]);
      return bouton;
    });

    zone.append(
      el('div', { class: 'atelier-machine' }, [ligne(a, dessinObjet(regle.applique(a))), ligne(b, dessinObjet(regle.applique(b))), ligne(c, trou)]),
      el('div', { class: 'indice', text: '👇' }),
      el('div', { class: 'choix' }, choix),
    );
    consigne(premiere ? T.intro : T.encore);
  },
};
