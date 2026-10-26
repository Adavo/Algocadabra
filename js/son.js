// Voix (synthèse vocale en français) et petits bruitages.
// Les enfants de 4 ans ne lisent pas encore : chaque consigne est dite à voix haute.

const Son = (() => {
  let voix = null;
  let actif = Stockage.lire('algocadabra-son', true);
  let ctx = null;

  function choisirVoix() {
    const fr = speechSynthesis.getVoices().filter(v => v.lang && v.lang.toLowerCase().startsWith('fr'));
    voix = fr.find(v => /google|denise|julie|amelie|audrey|hortense/i.test(v.name)) || fr[0] || null;
  }

  if ('speechSynthesis' in window) {
    choisirVoix();
    speechSynthesis.addEventListener('voiceschanged', choisirVoix);
  }

  function dire(texte) {
    if (!actif || !('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texte);
    u.lang = 'fr-FR';
    if (voix) u.voice = voix;
    u.rate = 0.9;
    u.pitch = 1.1;
    speechSynthesis.speak(u);
  }

  function note(freq, debut, duree, type = 'sine', volume = 0.12) {
    if (!actif) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const t = ctx.currentTime + debut;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(volume, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + duree);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + duree + 0.05);
    } catch (e) { /* pas de son, pas grave */ }
  }

  return {
    dire,
    pop: () => note(660, 0, 0.12, 'triangle'),
    pas: () => note(520, 0, 0.1, 'sine', 0.08),
    succes: () => { note(523, 0, 0.15); note(659, 0.12, 0.15); note(784, 0.24, 0.3); },
    fete: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => note(f, i * 0.12, 0.25, 'triangle')),
    oups: () => { note(330, 0, 0.15, 'sine', 0.1); note(262, 0.12, 0.25, 'sine', 0.1); },
    get actif() { return actif; },
    basculer() {
      actif = !actif;
      Stockage.ecrire('algocadabra-son', actif);
      if (!actif && 'speechSynthesis' in window) speechSynthesis.cancel();
      return actif;
    },
  };
})();

const ENCOURAGEMENTS = ['Bravo !', 'Super !', 'Génial !', 'Trop fort !', 'Magnifique !', 'Youpi !'];
const ESSAIE_ENCORE = ['Essaie encore !', 'Presque ! Essaie encore.', 'Oups ! Regarde bien.'];
