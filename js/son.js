// Voix (synthèse vocale en français), petits bruitages et musique de fond.
// Les enfants de 4 ans ne lisent pas encore : chaque consigne est dite à voix haute.
// Pendant que la voix parle, la musique baisse pour ne pas la couvrir.

const Son = (() => {
  let voix = null;
  let actif = Stockage.lire('algocadabra-son', true);
  let musiqueActive = Stockage.lire('algocadabra-musique', true);
  // Volume de la voix réglé par les parents, en pourcentage.
  let volumeVoix = Stockage.lire('algocadabra-volume-voix', 100);
  let ctx = null;

  function contexte() {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    // iOS met le son en « interrupted » (autre appli, appel, veille) : on le relance aussi dans ce cas.
    if (ctx.state !== 'running' && !document.hidden) {
      const reprise = ctx.resume();
      if (reprise && reprise.catch) reprise.catch(() => {});
    }
    return ctx;
  }

  // ---------- La voix ----------
  // Les voix « naturelles » (réseaux de neurones) sonnent beaucoup moins robot que les anciennes :
  // Edge propose « Microsoft Denise/Vivienne/Eloise Online (Natural) », Chrome « Google français »,
  // iPad/Mac/Android des voix « Premium » ou « Enhanced ».

  let voixParent = Stockage.lire('algocadabra-voix', null);

  function noteVoix(v) {
    let n = 0;
    if (/natural|neural|naturelle/i.test(v.name)) n += 100;
    if (/premium|enhanced|amélioré|ameliore/i.test(v.name)) n += 90;
    if (/google/i.test(v.name)) n += 60;
    if (/online/i.test(v.name)) n += 30;
    if (/denise|vivienne|eloise|audrey|amélie|amelie|marie|aurélie/i.test(v.name)) n += 10;
    if (/^fr[-_]FR/i.test(v.lang)) n += 5;
    // Les vieilles voix de Windows sont les plus « robot ».
    if (/hortense|julie|paul/i.test(v.name) && !/online|natural/i.test(v.name)) n -= 20;
    return n;
  }

  function voixFrancaises() {
    if (!('speechSynthesis' in window)) return [];
    return speechSynthesis.getVoices()
      .filter(v => v.lang && v.lang.toLowerCase().startsWith('fr'))
      .sort((a, b) => noteVoix(b) - noteVoix(a));
  }

  function choisirVoix() {
    const fr = voixFrancaises();
    voix = fr.find(v => v.voiceURI === voixParent) || fr[0] || null;
  }

  if ('speechSynthesis' in window) {
    choisirVoix();
    speechSynthesis.addEventListener('voiceschanged', choisirVoix);
  }

  const estNaturelle = v => v && noteVoix(v) >= 60;

  function enonce(phrase) {
    const u = new SpeechSynthesisUtterance(phrase);
    u.lang = 'fr-FR';
    if (voix) u.voice = voix;
    // Une voix naturelle sonne mieux sans retouche ; une ancienne voix, un peu plus lente et douce.
    u.rate = estNaturelle(voix) ? 0.95 : 0.88;
    u.pitch = estNaturelle(voix) ? 1 : 1.05;
    u.volume = volumeVoix / 100;
    return u;
  }

  // Dit une phrase avec la voix du navigateur et attend qu'elle soit finie
  // (avec une limite de temps : certains navigateurs oublient de signaler la fin).
  function direUnePhrase(phrase) {
    return new Promise(fini => {
      if (!('speechSynthesis' in window)) return fini();
      const u = enonce(phrase);
      const limite = setTimeout(fini, 2000 + phrase.length * 120);
      u.onend = u.onerror = () => { clearTimeout(limite); fini(); };
      speechSynthesis.speak(u);
    });
  }

  // ---------- La voix enregistrée (fichiers créés avec Piper, voir outils/voix/) ----------
  // Si voix/catalogue.json existe, chaque phrase qui a un fichier est jouée depuis ce fichier,
  // et la voix du navigateur ne lit que les phrases qui n'en ont pas.

  let catalogue = null; // { version, phrases: { clé: texte } }
  const tampons = new Map(); // clé → promesse du son décodé (ou null s'il manque)
  let sortieVoix = null;
  let sourceVoix = null;
  let jeton = 0; // change à chaque nouvelle consigne : l'ancienne s'arrête
  let voixOccupee = false; // une consigne avec des fichiers est en train d'être dite

  if (location.protocol !== 'file:') {
    fetch('voix/catalogue.json?v=' + Date.now())
      .then(r => (r.ok ? r.json() : null))
      .then(c => { catalogue = c && c.phrases ? c : null; })
      .catch(() => { /* pas de fichiers : la voix du navigateur fera tout */ });
  }

  const aUnFichier = phrase => !!(catalogue && catalogue.phrases[clePhrase(phrase)]);

  function chargerTampon(cle) {
    if (!tampons.has(cle)) {
      tampons.set(cle, fetch(`voix/fichiers/${cle}.mp3?v=${catalogue.version}`)
        .then(r => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(r.status))))
        .then(donnees => new Promise((ok, ko) => contexte().decodeAudioData(donnees, ok, ko)))
        .catch(() => null));
    }
    return tampons.get(cle);
  }

  function jouerTampon(tampon) {
    return new Promise(fini => {
      const c = contexte();
      if (!sortieVoix) {
        sortieVoix = c.createGain();
        sortieVoix.connect(c.destination);
      }
      sortieVoix.gain.value = volumeVoix / 100;
      const s = c.createBufferSource();
      s.buffer = tampon;
      s.connect(sortieVoix);
      s.onended = () => { if (sourceVoix === s) sourceVoix = null; fini(); };
      sourceVoix = s;
      s.start();
    });
  }

  function taire() {
    jeton++;
    voixOccupee = false;
    if (sourceVoix) {
      try { sourceVoix.stop(); } catch (e) { /* déjà fini */ }
      sourceVoix = null;
    }
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }

  function dire(texte) {
    if (!actif) return;
    taire();
    Musique.parole();
    // Une phrase à la fois : des pauses plus naturelles entre les phrases,
    // et Chrome ne coupe plus les consignes longues au bout de 15 secondes.
    const phrases = decouperPhrases(texte);
    if (!phrases.some(aUnFichier)) {
      // Rien d'enregistré : la voix du navigateur lit toutes les phrases à la suite.
      if ('speechSynthesis' in window) phrases.forEach(p => speechSynthesis.speak(enonce(p)));
      return;
    }
    // Sinon, phrase après phrase : le fichier quand il existe, la voix du navigateur sinon.
    const monJeton = jeton;
    voixOccupee = true;
    phrases.filter(aUnFichier).forEach(p => chargerTampon(clePhrase(p))); // on charge tout d'avance
    (async () => {
      for (const p of phrases) {
        const tampon = aUnFichier(p) ? await chargerTampon(clePhrase(p)) : null;
        if (monJeton !== jeton) return;
        if (tampon) await jouerTampon(tampon);
        else await direUnePhrase(p);
        if (monJeton !== jeton) return;
      }
      voixOccupee = false;
      Musique.parole(); // la musique remonte doucement après la dernière phrase
    })();
  }

  function note(freq, debut, duree, type = 'sine', volume = 0.12) {
    if (!actif) return;
    try {
      const c = contexte();
      const t = c.currentTime + debut;
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(volume, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + duree);
      o.connect(g).connect(c.destination);
      o.start(t);
      o.stop(t + duree + 0.05);
    } catch (e) { /* pas de son, pas grave */ }
  }

  // ---------- Musique de fond, jouée par le navigateur (aucun fichier audio) ----------

  const Musique = (() => {
    const VOLUME = 1;
    const VOLUME_PAROLE = 0.2; // la musique descend à 20 % pendant que la voix parle
    const CROCHE = 60 / 112 / 2; // 112 battements par minute

    // 8 mesures : do, la mineur, fa, sol, do, la mineur, ré mineur, sol (numéros de notes MIDI).
    const ACCORDS = [
      [48, 52, 55], [45, 48, 52], [41, 45, 48], [43, 47, 50],
      [48, 52, 55], [45, 48, 52], [38, 41, 45], [43, 47, 50],
    ];
    // La mélodie, une case par croche (null = silence).
    const MELODIE = [
      [76, null, 79, null, 81, 79, 76, null],
      [72, null, 76, null, 74, 72, 69, null],
      [69, null, 72, null, 77, 76, 72, null],
      [74, null, 71, null, 67, null, null, null],
      [76, null, 79, null, 84, 83, 79, null],
      [81, null, 79, 76, 72, null, 76, null],
      [77, null, 76, 74, 69, null, 74, null],
      [71, null, 74, null, 79, 77, 74, 71],
    ];
    const ARPEGE = [0, 1, 2, 3, 2, 1, 2, 3];

    let sortie = null;
    let niveau = null;
    // Volume de la musique réglé par les parents, en pourcentage.
    let volumeReglage = Stockage.lire('algocadabra-volume-musique', 55);
    let bruit = null;
    let minuterie = null;
    let prochain = 0;
    let pas = 0;
    let volume = 0;
    let derniereParole = 0;

    const frequence = m => 440 * Math.pow(2, (m - 69) / 12);

    function son(type, f, t, duree, vol, vers = sortie) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = f;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0005, t + duree);
      o.connect(g).connect(vers);
      o.start(t);
      o.stop(t + duree + 0.05);
    }

    // Une clochette magique : la note plus une harmonique aiguë qui s'éteint vite.
    function clochette(m, t) {
      son('sine', frequence(m), t, 0.6, 0.05);
      son('sine', frequence(m) * 2.76, t, 0.18, 0.012);
    }

    function maracas(t) {
      const s = ctx.createBufferSource();
      s.buffer = bruit;
      const filtre = ctx.createBiquadFilter();
      filtre.type = 'bandpass';
      filtre.frequency.value = 7000;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.03, t);
      g.gain.exponentialRampToValueAtTime(0.0005, t + 0.05);
      s.connect(filtre).connect(g).connect(sortie);
      s.start(t);
      s.stop(t + 0.06);
    }

    function jouerPas(i, t) {
      const mesure = Math.floor(i / 8) % 8;
      const croche = i % 8;
      const accord = ACCORDS[mesure];
      if (croche % 2 === 0) son('triangle', frequence((croche % 4 === 0 ? accord[0] : accord[2]) - 12), t, 0.35, 0.09);
      son('triangle', frequence([...accord, accord[0] + 12][ARPEGE[croche]] + 12), t, 0.22, 0.022);
      if (MELODIE[mesure][croche] != null) clochette(MELODIE[mesure][croche], t);
      if (croche % 2 === 1) maracas(t);
    }

    function planifier() {
      while (prochain < ctx.currentTime + 0.25) {
        jouerPas(pas, prochain);
        prochain += CROCHE;
        pas = (pas + 1) % 64;
      }
    }

    // Baisse vite quand la voix commence, remonte doucement quand elle s'arrête.
    function regler() {
      if (!sortie) return;
      const parle = voixOccupee || ('speechSynthesis' in window && (speechSynthesis.speaking || speechSynthesis.pending));
      const cible = parle || performance.now() - derniereParole < 700 ? VOLUME_PAROLE : VOLUME;
      if (cible === volume) return;
      volume = cible;
      const t = ctx.currentTime;
      sortie.gain.cancelScheduledValues(t);
      sortie.gain.setTargetAtTime(cible, t, cible < VOLUME ? 0.06 : 0.5);
    }

    function demarrer() {
      if (minuterie || !actif || !musiqueActive) return;
      try {
        const c = contexte();
        if (!sortie) {
          sortie = c.createGain();
          sortie.gain.value = 0;
          // Volume général de la musique : nettement plus bas que la voix et les bruitages.
          niveau = c.createGain();
          niveau.gain.value = volumeReglage / 100;
          sortie.connect(niveau).connect(c.destination);
          bruit = c.createBuffer(1, c.sampleRate * 0.1, c.sampleRate);
          const d = bruit.getChannelData(0);
          for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
          setInterval(regler, 150);
        }
        volume = -1;
        prochain = c.currentTime + 0.1;
        minuterie = setInterval(planifier, 50);
        regler();
      } catch (e) { /* pas de musique, pas grave */ }
    }

    function arreter() {
      clearInterval(minuterie);
      minuterie = null;
      if (sortie) {
        sortie.gain.cancelScheduledValues(ctx.currentTime);
        sortie.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
        volume = 0;
      }
    }

    return {
      demarrer,
      arreter,
      parole() { derniereParole = performance.now(); regler(); },
      get reglage() { return volumeReglage; },
      reglerVolume(pourcentage) {
        volumeReglage = pourcentage;
        Stockage.ecrire('algocadabra-volume-musique', pourcentage);
        if (niveau) niveau.gain.setTargetAtTime(pourcentage / 100, ctx.currentTime, 0.05);
      },
      get enCours() { return !!minuterie; },
      get volume() { return volume; },
    };
  })();

  // Les navigateurs n'autorisent le son qu'après un premier geste de l'enfant.
  // Sur iPad et iPhone, le son ne s'ouvre qu'à la FIN d'un toucher (ou sur un clic), jamais au début :
  // on débloque donc l'audio et la voix à chacun de ces gestes.
  let voixDebloquee = false;
  function debloquer() {
    // Safari 16.4+ : jouer le son même quand l'iPad est en mode silencieux, comme une vidéo.
    if (navigator.audioSession) {
      try { navigator.audioSession.type = 'playback'; } catch (e) { /* ancien Safari */ }
    }
    try {
      // Un son vide joué pendant le geste : c'est ce qui réveille vraiment l'audio sur iOS.
      const c = contexte();
      const s = c.createBufferSource();
      s.buffer = c.createBuffer(1, 1, 22050);
      s.connect(c.destination);
      s.start(0);
    } catch (e) { /* pas de son, pas grave */ }
    if (!voixDebloquee && actif && 'speechSynthesis' in window) {
      // Une première phrase muette pendant un geste autorise ensuite la voix (iOS).
      const u = new SpeechSynthesisUtterance(' ');
      u.volume = 0;
      speechSynthesis.speak(u);
      voixDebloquee = true;
    }
    Musique.demarrer();
  }
  for (const geste of ['pointerup', 'touchend', 'click', 'keydown']) {
    document.addEventListener(geste, debloquer, { passive: true });
  }
  // Pas de musique quand la page est cachée (autre onglet, tablette en veille).
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend();
    else contexte(); // sur iOS, si ça ne repart pas tout seul, le prochain toucher le relancera
  });

  return {
    dire,
    taire,
    debloquer,
    pourLaVoix,
    voixFrancaises,
    get voix() { return voix; },
    // Choix fait par un parent dans « Pour les parents » ; null = choix automatique.
    choisirVoixParent(uri) {
      voixParent = uri;
      Stockage.ecrire('algocadabra-voix', uri);
      choisirVoix();
    },
    get voixParent() { return voixParent; },
    musique: Musique,
    pop: () => note(660, 0, 0.12, 'triangle'),
    pas: () => note(520, 0, 0.1, 'sine', 0.08),
    succes: () => { note(523, 0, 0.15); note(659, 0.12, 0.15); note(784, 0.24, 0.3); },
    fete: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => note(f, i * 0.12, 0.25, 'triangle')),
    oups: () => { note(330, 0, 0.15, 'sine', 0.1); note(262, 0.12, 0.25, 'sine', 0.1); },
    get actif() { return actif; },
    get musiqueActive() { return musiqueActive; },
    get volumeVoix() { return volumeVoix; },
    reglerVolumeVoix(pourcentage) {
      volumeVoix = pourcentage;
      Stockage.ecrire('algocadabra-volume-voix', pourcentage);
      if (sortieVoix) sortieVoix.gain.value = pourcentage / 100;
    },
    // Les consignes sont-elles enregistrées (fichiers Piper) ?
    get voixEnregistree() { return !!catalogue; },
    // Coupe ou remet tout le son (voix, bruitages et musique).
    basculer() {
      actif = !actif;
      Stockage.ecrire('algocadabra-son', actif);
      if (!actif) {
        taire();
        Musique.arreter();
      } else {
        Musique.demarrer();
      }
      return actif;
    },
    // Coupe ou remet seulement la musique.
    basculerMusique() {
      musiqueActive = !musiqueActive;
      Stockage.ecrire('algocadabra-musique', musiqueActive);
      if (musiqueActive) Musique.demarrer();
      else Musique.arreter();
      return musiqueActive;
    },
  };
})();

