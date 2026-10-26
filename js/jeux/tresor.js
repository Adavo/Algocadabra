// La chasse au trésor : le trésor est caché dans une des boîtes ; à chaque boîte ouverte,
// un indice dit s'il est plus à gauche ou plus à droite. Seule la boîte ouverte s'éteint.

Jeux.tresor = {
  id: 'tresor',
  nom: 'La chasse au trésor',
  icone: '🎁💎',
  concept: "Chercher avec méthode : chaque indice (« plus à gauche », « plus à droite ») élimine toute une partie des cachettes. En ouvrant la boîte du milieu, on élimine la moitié des cachettes à chaque fois : c'est la recherche par dichotomie, utilisée partout en informatique.",
  manches: 3,
  niveaux: [
    // boites : nombre de cachettes ; essais : nombre d'essais permis (rien = pas de limite).
    // Avec la bonne méthode (ouvrir au milieu), 3 essais suffisent pour 7 boîtes et 4 pour 9.
    { boites: 5 },
    { boites: 6 },
    { boites: 7 },
    { boites: 7, essais: 4 },
    { boites: 9, essais: 4 },
  ],

  textes: {
    intro: 'Le trésor est caché dans une des boîtes ! Ouvre une boîte : je te dirai si le trésor est plus à gauche ou plus à droite.',
    gauche: 'Plus à gauche !',
    droite: 'Plus à droite !',
    encore: "Le trésor s'est caché ailleurs ! Cherche-le.",
    limite: essais => `Attention, tu n'as que ${essais} essais : réfléchis bien avant d'ouvrir !`,
    perdu: "Oh non, plus d'essais ! Le trésor était là. On recommence !",
  },

  // Tout ce que ce jeu peut dire (pour enregistrer les fichiers audio).
  phrases() {
    const T = this.textes;
    const limites = [...new Set(this.niveaux.filter(c => c.essais).map(c => c.essais))];
    return [T.intro, T.gauche, T.droite, T.encore, T.perdu, ...limites.map(T.limite)];
  },

  lancerManche(zone, { decor, config, premiere, consigne, enCours, reussi, recommencer }) {
    const T = Jeux.tresor.textes;
    const cachette = hasard(config.boites);
    let restants = config.essais || Infinity;
    let fini = false;

    const indice = el('div', { class: 'indice-tresor', text: '🔍' });
    // Les essais qui restent, en petites lanternes.
    const lanternes = el('div', { class: 'essais-tresor', 'aria-label': 'Essais' });
    const dessinerEssais = () => {
      if (!config.essais) return;
      lanternes.replaceChildren(...Array.from({ length: config.essais }, (_, i) =>
        el('span', { class: i < restants ? 'reste' : 'utilise', text: '🏮' })));
    };
    dessinerEssais();

    const boites = Array.from({ length: config.boites }, (_, i) => el('button', {
      class: 'boite-tresor', text: '🎁', 'aria-label': 'Boîte ' + (i + 1),
      onclick: () => ouvrir(i),
    }));

    function ouvrir(i) {
      const boite = boites[i];
      if (fini || boite.classList.contains('exclue') || boite.classList.contains('ouverte')) return;
      restants--;
      dessinerEssais();
      if (i === cachette) {
        fini = true;
        boite.textContent = decor.but;
        boite.classList.add('ouverte', 'trouve');
        indice.textContent = '🎉';
        reussi();
        return;
      }
      Son.pas();
      // Seule la boîte ouverte s'éteint : c'est à l'enfant de se servir de l'indice pour éliminer les autres.
      boite.textContent = '💨';
      boite.classList.add('ouverte', 'exclue');
      if (restants <= 0) {
        // Plus d'essais : on montre où était le trésor, puis une nouvelle cachette.
        fini = true;
        boites[cachette].textContent = decor.but;
        boites[cachette].classList.add('ouverte', 'revele');
        indice.textContent = '😮';
        Son.oups();
        Son.dire(T.perdu);
        setTimeout(() => { if (enCours()) recommencer(); }, 3500);
        return;
      }
      const aGauche = cachette < i;
      indice.textContent = aGauche ? '⬅️' : '➡️';
      indice.classList.remove('apparait');
      void indice.offsetWidth;
      indice.classList.add('apparait');
      Son.dire(aGauche ? T.gauche : T.droite);
    }

    zone.append(indice, el('div', { class: 'rangee-tresor' }, boites), lanternes);
    const texteLimite = config.essais ? ' ' + T.limite(config.essais) : '';
    consigne((premiere ? T.intro : T.encore) + texteLimite);
  },
};
