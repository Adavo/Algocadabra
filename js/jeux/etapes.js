// Les étapes : remettre les images d'une petite histoire dans le bon ordre.

let dernieresHistoires = [];

Jeux.etapes = {
  id: 'etapes',
  nom: 'Les étapes',
  icone: '1️⃣2️⃣3️⃣',
  concept: "Un algorithme, c'est une recette : des étapes à faire dans le bon ordre. Ici l'enfant remet les étapes d'une action de la vie quotidienne dans l'ordre, et comprend que changer l'ordre change le résultat.",
  manches: 2,
  niveaux: [{ etapes: 3 }, { etapes: 3 }, { etapes: 4 }, { etapes: 4 }, { etapes: 5 }],

  textes: {
    intro: "Remets les images dans le bon ordre. Touche d'abord ce qui se passe en premier.",
    histoire: titre => 'Histoire : ' + titre + '.',
    certainesBonnes: 'Certaines images sont à la bonne place. Essaie de replacer les autres !',
    pasToutAFait: "Pas tout à fait. Réfléchis : qu'est-ce qu'on fait en premier ?",
  },

  // Tout ce que ce jeu peut dire (pour enregistrer les fichiers audio) :
  // les consignes, le titre de chaque histoire et chaque image, lue quand on la touche.
  phrases() {
    const T = this.textes;
    const histoires = [...tousLesDecors().flatMap(d => d.histoires), ...HISTOIRES_COMMUNES];
    return [
      T.intro, T.certainesBonnes, T.pasToutAFait,
      ...histoires.map(h => T.histoire(h.titre)),
      ...histoires.flatMap(h => h.etapes.map(([, texte]) => texte)),
    ];
  },

  lancerManche(zone, { decor, config, premiere, consigne, reussi }) {
    const T = Jeux.etapes.textes;
    const toutes = [...decor.histoires, ...HISTOIRES_COMMUNES].filter(h => h.etapes.length === config.etapes);
    const neuves = toutes.filter(h => !dernieresHistoires.includes(h.titre));
    const candidates = neuves.length ? neuves : toutes;
    // On préfère les histoires du décor tiré quand il en reste.
    const duDecor = candidates.filter(h => decor.histoires.includes(h));
    const pool = duDecor.length ? duDecor : candidates;
    const histoire = pool[hasard(pool.length)];
    dernieresHistoires = [histoire.titre, ...dernieresHistoires].slice(0, 3);

    const etapes = histoire.etapes.map(([emoji, texte], rang) => ({ emoji, texte, rang }));
    let ordre = melanger(etapes);
    while (ordre.every((e, i) => e.rang === i)) ordre = melanger(etapes);

    const places = new Array(etapes.length).fill(null);
    const bloquees = new Set();

    const cases = places.map((_, i) => el('button', {
      class: 'place', 'aria-label': 'Étape ' + (i + 1),
      onclick: () => {
        const e = places[i];
        if (!e || bloquees.has(i)) return;
        places[i] = null;
        Son.pop();
        dessiner();
      },
    }));
    const cartes = ordre.map(e => el('button', {
      class: 'carte-etape', text: e.emoji, 'aria-label': e.texte,
      onclick: () => {
        const libre = places.indexOf(null);
        if (libre < 0 || places.includes(e)) return;
        places[libre] = e;
        Son.pop();
        Son.dire(e.texte);
        dessiner();
        if (!places.includes(null)) setTimeout(verifier, 700);
      },
    }));

    function dessiner() {
      cases.forEach((c, i) => {
        const e = places[i];
        c.replaceChildren(el('span', { class: 'numero', text: String(i + 1) }), e ? el('span', { class: 'emoji', text: e.emoji }) : '');
        c.classList.toggle('juste', bloquees.has(i));
      });
      cartes.forEach((c, i) => { c.style.visibility = places.includes(ordre[i]) ? 'hidden' : 'visible'; });
    }

    function verifier() {
      const fausses = [];
      places.forEach((e, i) => { if (e.rang === i) bloquees.add(i); else fausses.push(i); });
      dessiner();
      if (!fausses.length) return reussi();
      Son.oups();
      Son.dire(bloquees.size ? T.certainesBonnes : T.pasToutAFait);
      fausses.forEach(i => secouer(cases[i]));
      setTimeout(() => { fausses.forEach(i => { places[i] = null; }); dessiner(); }, 900);
    }

    dessiner();
    zone.append(
      el('p', { class: 'titre-histoire', text: histoire.titre }),
      el('div', { class: 'places' }, cases),
      el('div', { class: 'indice', text: '👆' }),
      el('div', { class: 'choix' }, cartes),
    );
    consigne((premiere ? T.intro + ' ' : '') + T.histoire(histoire.titre));
  },
};
