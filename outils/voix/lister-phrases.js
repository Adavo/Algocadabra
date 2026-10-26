// Liste toutes les phrases que le site peut dire, avec la clé (nom de fichier) de chacune.
// Charge les fichiers du site dans Node, sans navigateur, et appelle toutesLesPhrases() (js/phrases.js).
//
//   node outils/voix/lister-phrases.js            → affiche le nombre de phrases et quelques exemples
//   node outils/voix/lister-phrases.js --json     → la liste complète en JSON (utilisé par generer-voix.py)

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RACINE = path.join(__dirname, '..', '..');

// Les fichiers du site, dans l'ordre de js/fichiers.js, sauf ceux qui ont besoin d'un navigateur.
const BESOIN_NAVIGATEUR = ['js/son.js', 'js/parents.js', 'js/app.js'];
const liste = fs.readFileSync(path.join(RACINE, 'js', 'fichiers.js'), 'utf8');
const fichiers = [...liste.matchAll(/'(js\/[^']+\.js)'/g)]
  .map(m => m[1])
  .filter(f => !BESOIN_NAVIGATEUR.includes(f));

const contexte = vm.createContext({ console });
for (const f of fichiers) {
  vm.runInContext(fs.readFileSync(path.join(RACINE, f), 'utf8'), contexte, { filename: f });
}

const phrases = vm.runInContext('toutesLesPhrases().map(texte => ({ cle: clePhrase(texte), texte }))', contexte);

// Deux phrases différentes ne doivent jamais avoir le même nom de fichier.
const vues = new Map();
for (const p of phrases) {
  if (vues.has(p.cle) && vues.get(p.cle) !== p.texte) {
    console.error(`Collision de clé ${p.cle} : « ${vues.get(p.cle)} » et « ${p.texte} »`);
    process.exit(1);
  }
  vues.set(p.cle, p.texte);
}

if (process.argv.includes('--json')) {
  process.stdout.write(JSON.stringify(phrases, null, 1));
} else {
  console.log(`${phrases.length} phrases (${phrases.reduce((n, p) => n + p.texte.length, 0)} caractères)`);
  for (const p of phrases.slice(0, 8)) console.log(`  ${p.cle}  ${p.texte}`);
  console.log('  …');
}
