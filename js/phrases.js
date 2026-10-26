// Tout ce que la voix peut dire, et les outils pour retrouver le fichier audio de chaque phrase.
// Ce fichier n'utilise pas le navigateur : outils/voix/lister-phrases.js le charge aussi avec Node
// pour connaître toutes les phrases à enregistrer avec Piper.

const ENCOURAGEMENTS = ['Bravo !', 'Super !', 'Génial !', 'Trop fort !', 'Magnifique !', 'Youpi !'];
const ESSAIE_ENCORE = ['Essaie encore !', 'Presque ! Essaie encore.', 'Oups ! Regarde bien.'];

// Les phrases de la maison, des menus et de l'espace parents.
const TEXTES = {
  bienvenue: 'Bienvenue chez la sorcière ! Dans son chaudron magique, il y a des jeux. Choisis : les jeux pour les petits, ou les jeux pour les grands.',
  groupe: {
    petits: 'Les jeux pour les petits ! Choisis une bulle.',
    grands: 'Les jeux pour les grands ! Choisis une bulle.',
  },
  choisirBulle: 'Choisis une bulle du chaudron.',
  choisirNiveau: jeu => jeu.nom + '. Choisis un niveau.',
  niveauFerme: "Réussis d'abord le niveau d'avant !",
  etoile: 'Bravo, tu as gagné une étoile ! On continue ?',
  toutFini: 'Bravo ! Tu as fini tous les niveaux de ce jeu !',
  testVoix: "Bonjour ! Je suis la voix de la sorcière. On va bien s'amuser !",
};

// Le texte affiché n'est pas toujours bon à lire : on retire les emojis et les guillemets,
// on écrit « × 3 » en toutes lettres et on évite que « SI » soit épelé lettre par lettre.
function pourLaVoix(texte) {
  return texte
    .replace(/\p{Extended_Pictographic}|[\uFE0F\u200D\u20E3\u2190-\u21FF]/gu, '')
    .replace(/[\u00AB\u00BB]/g, '')
    .replace(/\u00D7\s*(\d+)(?!\s*fois)/g, '$1 fois')
    .replace(/\u00D7/g, '')
    .replace(/\b([A-ZÀ-Ý]{2,})\b/g, m => m.toLowerCase())
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// Une consigne est lue phrase par phrase : chaque phrase a son propre fichier audio.
function decouperPhrases(texte) {
  return pourLaVoix(texte).split(/(?<=[.!?…])\s+/).filter(Boolean);
}

// Le nom du fichier audio d'une phrase : une empreinte courte de son texte (FNV-1a sur 32 bits).
// Si le texte change d'une seule lettre, c'est un autre fichier : il sera régénéré.
function clePhrase(phrase) {
  let h = 0x811c9dc5;
  for (let i = 0; i < phrase.length; i++) {
    h ^= phrase.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

// Toutes les phrases que le site peut dire : les textes généraux, plus celles de chaque jeu
// (chaque jeu liste les siennes, toutes variantes comprises, dans sa fonction phrases()).
function toutesLesPhrases() {
  const textes = [
    ...ENCOURAGEMENTS,
    ...ESSAIE_ENCORE,
    TEXTES.bienvenue,
    ...Object.values(TEXTES.groupe),
    TEXTES.choisirBulle,
    TEXTES.niveauFerme,
    TEXTES.etoile,
    TEXTES.toutFini,
    TEXTES.testVoix,
    ...Object.values(Jeux).map(TEXTES.choisirNiveau),
    ...Object.values(Jeux).flatMap(jeu => (jeu.phrases ? jeu.phrases() : [])),
  ];
  return [...new Set(textes.flatMap(decouperPhrases))];
}
