// Petits utilitaires partagés par toutes les activités.

// Chaque fichier de js/jeux/ ajoute son activité ici.
const Jeux = {};

function el(tag, attrs = {}, enfants = []) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') n.className = v;
    else if (k === 'onclick') n.addEventListener('click', v);
    else if (k === 'style') n.style.cssText = v;
    else if (k === 'text') n.textContent = v;
    else n.setAttribute(k, v);
  }
  for (const e of [].concat(enfants)) {
    if (e == null) continue;
    n.append(typeof e === 'string' ? document.createTextNode(e) : e);
  }
  return n;
}

function hasard(n) {
  return Math.floor(Math.random() * n);
}

function melanger(tableau) {
  const t = tableau.slice();
  for (let i = t.length - 1; i > 0; i--) {
    const j = hasard(i + 1);
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}

function attendre(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Fait trembler un élément (mauvaise réponse), sans jamais punir.
function secouer(noeud) {
  noeud.classList.remove('secoue');
  void noeud.offsetWidth;
  noeud.classList.add('secoue');
}

// Pluie d'emojis du monde courant pour fêter une réussite.
function confettis(emojis) {
  const couche = el('div', { class: 'confettis', 'aria-hidden': 'true' });
  for (let i = 0; i < 28; i++) {
    const c = el('span', { text: emojis[hasard(emojis.length)] });
    c.style.left = Math.random() * 100 + 'vw';
    c.style.animationDelay = Math.random() * 0.8 + 's';
    c.style.fontSize = 1.5 + Math.random() * 1.8 + 'rem';
    couche.append(c);
  }
  document.body.append(couche);
  setTimeout(() => couche.remove(), 3500);
}

// Stockage local protégé : le site doit marcher même si le navigateur le bloque.
const Stockage = {
  lire(cle, defaut) {
    try {
      const v = localStorage.getItem(cle);
      return v === null ? defaut : JSON.parse(v);
    } catch (e) {
      return defaut;
    }
  },
  ecrire(cle, valeur) {
    try {
      localStorage.setItem(cle, JSON.stringify(valeur));
    } catch (e) { /* tant pis, la progression ne sera pas gardée */ }
  },
};
