// Les décors magiques des jeux « Pour les petits ».
// Un décor différent est tiré à chaque manche : fées, licornes, chatons, potions…
// Rien n'est présenté comme « pour filles » ou « pour garçons ».

const DECORS = [
  {
    id: 'sorciere',
    heros: '🐈‍⬛', nomHeros: 'le chat de la sorcière',
    but: '🧪', nomBut: 'la potion',
    obstacle: '🎃', nomObstacles: 'les citrouilles',
    motifs: ['🎃', '🧪', '🔮', '⭐', '🍄'],
    tri: '🎃',
    histoires: [
      { titre: 'La potion arc-en-ciel', etapes: [['💧', "Verser l'eau dans le chaudron"], ['🍄', 'Ajouter un champignon'], ['✨', "Ajouter la poussière d'étoile"], ['🌈', 'La potion est prête']] },
      { titre: 'Le balai volant', etapes: [['🧹', 'Prendre son balai'], ['🪄', 'Dire la formule magique'], ['🌙', "S'envoler vers la lune"]] },
    ],
  },
  {
    id: 'fees',
    heros: '🧚', nomHeros: 'la fée',
    but: '🌸', nomBut: 'la fleur',
    obstacle: '🍄', nomObstacles: 'les champignons',
    motifs: ['🌸', '🦋', '🌼', '🐞', '🍄'],
    tri: '🦋',
    histoires: [
      { titre: 'Planter une fleur', etapes: [['🌰', 'On met la graine dans la terre'], ['💧', 'On arrose'], ['🌱', 'Une petite pousse sort'], ['🌷', 'La fleur a poussé']] },
      { titre: 'Le papillon', etapes: [['🥚', 'Un tout petit œuf'], ['🐛', 'Une chenille en sort'], ['🦋', 'Elle devient un papillon']] },
    ],
  },
  {
    id: 'licornes',
    heros: '🦄', nomHeros: 'la licorne',
    but: '🌈', nomBut: "l'arc-en-ciel",
    obstacle: '☁️', nomObstacles: 'les nuages',
    motifs: ['⭐', '💖', '🌙', '🌈', '💎'],
    tri: '💖',
    histoires: [
      { titre: 'Se préparer pour le bal', etapes: [['🛁', 'Prendre son bain'], ['👗', 'Mettre sa belle tenue'], ['👑', 'Poser la couronne'], ['💃', 'Danser au bal']] },
      { titre: 'Fabriquer un collier', etapes: [['💎', 'Choisir les perles'], ['🧵', 'Enfiler les perles'], ['📿', 'Fermer le collier']] },
    ],
  },
  {
    id: 'cuisine',
    heros: '🐭', nomHeros: 'la petite souris',
    but: '🧁', nomBut: 'le gâteau',
    obstacle: '🍫', nomObstacles: 'les chocolats',
    motifs: ['🍓', '🍪', '🧁', '🍒', '🍰'],
    tri: '🍓',
    histoires: [
      { titre: 'Faire un gâteau', etapes: [['🥚', 'Casser les œufs'], ['🥣', 'Tout mélanger'], ['♨️', 'Faire cuire au four'], ['🎂', 'Décorer et souffler les bougies']] },
      { titre: 'Le pique-nique', etapes: [['🧺', 'Préparer le panier'], ['🌳', 'Aller au parc'], ['😋', 'Manger le goûter']] },
    ],
  },
  {
    id: 'chatons',
    heros: '🐱', nomHeros: 'le chaton',
    but: '🧶', nomBut: 'la pelote de laine',
    obstacle: '🪴', nomObstacles: 'les plantes',
    motifs: ['🐱', '🧶', '🐟', '🐾', '🥛'],
    tri: '🐟',
    histoires: [
      { titre: 'Prendre soin du chaton', etapes: [['🥛', 'Donner du lait'], ['🧶', 'Jouer avec la pelote'], ['😴', 'Faire un gros dodo']] },
      { titre: 'Se coiffer', etapes: [['🚿', 'Se laver les cheveux'], ['💨', 'Sécher les cheveux'], ['🎀', 'Mettre un joli nœud']] },
    ],
  },
  {
    id: 'hibou',
    heros: '🦉', nomHeros: 'le hibou',
    but: '🌕', nomBut: 'la lune',
    obstacle: '🌲', nomObstacles: 'les sapins',
    motifs: ['🦉', '🌕', '⭐', '🌲', '🦇'],
    tri: '🦉',
    histoires: [
      { titre: 'La nuit dans la forêt', etapes: [['🌇', 'Le soleil se couche'], ['🌕', 'La lune se lève'], ['🦉', 'Le hibou se réveille']] },
    ],
  },
  {
    id: 'ocean',
    heros: '🧜', nomHeros: 'la sirène',
    but: '🐚', nomBut: 'le coquillage',
    obstacle: '🪨', nomObstacles: 'les rochers',
    motifs: ['🐚', '🐙', '🐟', '🦀', '⭐'],
    tri: '🐙',
    histoires: [
      { titre: 'Le château de sable', etapes: [['🪣', 'Remplir le seau de sable'], ['🏖️', 'Retourner le seau'], ['🏰', 'Le château est fini'], ['🌊', 'La vague arrive']] },
    ],
  },
  {
    id: 'espace',
    heros: '🚀', nomHeros: 'la fusée',
    but: '🪐', nomBut: 'la planète',
    obstacle: '☄️', nomObstacles: 'les comètes',
    motifs: ['⭐', '🌙', '🪐', '☀️', '🛸'],
    tri: '🌍',
    histoires: [
      { titre: 'Partir sur la Lune', etapes: [['🧑‍🚀', 'Mettre la combinaison'], ['🚀', 'Monter dans la fusée'], ['🔥', 'Décollage !'], ['🌙', 'Arriver sur la Lune']] },
    ],
  },
  {
    id: 'dinos',
    heros: '🦕', nomHeros: 'le dinosaure',
    but: '🥚', nomBut: "l'œuf",
    obstacle: '🌋', nomObstacles: 'les volcans',
    motifs: ['🦖', '🦕', '🥚', '🌿', '🌋'],
    tri: '🦖',
    histoires: [
      { titre: 'Bébé dinosaure', etapes: [['🥚', 'Un gros œuf'], ['🐣', "L'œuf éclot"], ['🦖', 'Le bébé a grandi']] },
    ],
  },
];

// Histoires de la vie quotidienne, proposées avec tous les décors.
const HISTOIRES_COMMUNES = [
  { titre: 'Se laver les mains', etapes: [['💧', 'Mouiller ses mains'], ['🧼', 'Mettre du savon'], ['🚰', 'Rincer'], ['🧻', 'Essuyer ses mains']] },
  { titre: 'Se brosser les dents', etapes: [['🪥', 'Mettre le dentifrice'], ['🦷', 'Brosser ses dents'], ['😁', 'Faire un grand sourire']] },
  { titre: "S'habiller pour sortir", etapes: [['🧦', 'Mettre les chaussettes'], ['👟', 'Mettre les chaussures'], ['🚪', 'Sortir dehors']] },
  { titre: 'Le bonhomme de neige', etapes: [['❄️', 'Il neige'], ['⚪', 'Faire une grosse boule'], ['⛄', 'Le bonhomme de neige est fini'], ['☀️', 'Le soleil le fait fondre']] },
  { titre: 'Le matin', etapes: [['⏰', 'Le réveil sonne'], ['🪥', 'Se brosser les dents'], ['👕', "S'habiller"], ['🥣', 'Prendre le petit-déjeuner'], ['🎒', "Partir à l'école"]] },
];

// ---------- L'aventure : le voyage du chat de la sorcière ----------
// Les 5 lieux se suivent, de la maison jusqu'au sommet de la montagne, du matin à la nuit.
// Chaque lieu est un décor complet (mêmes champs que DECORS), plus ce qu'il faut pour la carte.

const MONDES_AVENTURE = [
  {
    id: 'maison',
    nom: 'La maison de la sorcière',
    dans: 'dans la maison de la sorcière', vers: 'la maison de la sorcière',
    icone: '🏠', ami: '🧙‍♀️',
    cristal: '#a855f7', couleurCristal: 'violet',
    ciel: ['#4c2a7a', '#241047'], // le matin, encore dans la maison
    decorations: ['🕯️', '📕', '🔮', '🕸️'],
    heros: '🐈‍⬛', nomHeros: 'le chat',
    but: '🧪', nomBut: 'la potion',
    obstacle: '🎃', nomObstacles: 'les citrouilles',
    motifs: ['🎃', '🧪', '🔮', '🕯️', '📕'],
    tri: '🎃',
    histoires: [
      { titre: 'Le balai volant', etapes: [['🧹', 'Prendre son balai'], ['🪄', 'Dire la formule magique'], ['🌙', "S'envoler vers la lune"]] },
      { titre: 'La potion arc-en-ciel', etapes: [['💧', "Verser l'eau dans le chaudron"], ['🍄', 'Ajouter un champignon'], ['✨', "Ajouter la poussière d'étoile"], ['🌈', 'La potion est prête']] },
      { titre: 'Allumer le chaudron', etapes: [['🪵', 'Mettre du bois'], ['🔥', 'Allumer le feu'], ['💧', "Verser l'eau"], ['🍄', 'Ajouter un champignon'], ['✨', 'La potion brille']] },
    ],
  },
  {
    id: 'potager',
    nom: 'Le potager magique',
    dans: 'au potager magique', vers: 'le potager magique',
    icone: '🥕', ami: '🐰',
    cristal: '#22c55e', couleurCristal: 'vert',
    ciel: ['#1d6b4a', '#0d3326'], // la fin de matinée
    decorations: ['🌻', '🐞', '🥬', '🦋'],
    heros: '🐰', nomHeros: 'le lapin',
    but: '🥕', nomBut: 'la carotte',
    obstacle: '🐌', nomObstacles: 'les escargots',
    motifs: ['🥕', '🍅', '🥬', '🌻', '🐞'],
    tri: '🍅',
    histoires: [
      { titre: 'La tomate', etapes: [['🌱', 'Une pousse sort de terre'], ['🌼', 'Une fleur apparaît'], ['🍅', 'La tomate est mûre']] },
      { titre: 'La soupe de légumes', etapes: [['🥕', 'Cueillir les légumes'], ['🧺', 'Les mettre dans le panier'], ['🍲', 'Les faire cuire'], ['😋', 'Manger la soupe']] },
      { titre: 'Le papillon du jardin', etapes: [['🥚', 'Un petit œuf sur une feuille'], ['🐛', 'Une chenille en sort'], ['🍃', 'Elle mange beaucoup de feuilles'], ['😴', "Elle s'endort dans son cocon"], ['🦋', 'Elle devient un papillon']] },
    ],
  },
  {
    id: 'foret',
    nom: 'La forêt enchantée',
    dans: 'dans la forêt enchantée', vers: 'la forêt enchantée',
    icone: '🌲', ami: '🦉',
    cristal: '#f97316', couleurCristal: 'orange',
    ciel: ['#3f5a1e', '#1b2a0c'], // l'après-midi, sous les arbres
    decorations: ['🌲', '🍄', '🧚', '🍂'],
    heros: '🐿️', nomHeros: "l'écureuil",
    but: '🌰', nomBut: 'la noisette',
    obstacle: '🌲', nomObstacles: 'les sapins',
    motifs: ['🦉', '🍄', '🧚', '🦋', '🌰'],
    tri: '🍄',
    histoires: [
      { titre: "L'écureuil", etapes: [['🌰', 'Trouver une noisette'], ['🕳️', 'La cacher dans un trou'], ['❄️', 'La manger en hiver']] },
      { titre: 'La nuit dans la forêt', etapes: [['🌇', 'Le soleil se couche'], ['🌕', 'La lune se lève'], ['🦉', 'Le hibou se réveille'], ['🧚', 'Les fées dansent']] },
      { titre: 'La cabane', etapes: [['🪵', 'Ramasser du bois'], ['🔨', 'Construire la cabane'], ['🚪', 'Ouvrir la porte'], ['🕯️', 'Allumer une bougie'], ['😴', 'Dormir bien au chaud']] },
    ],
  },
  {
    id: 'lac',
    nom: 'Le lac aux nénuphars',
    dans: 'au bord du lac aux nénuphars', vers: 'le lac aux nénuphars',
    icone: '🐸', ami: '🐸',
    cristal: '#3b82f6', couleurCristal: 'bleu',
    ciel: ['#b4532a', '#3b1d4f'], // le coucher du soleil
    decorations: ['🌿', '🐟', '🦆', '🌅'],
    heros: '🐸', nomHeros: 'la grenouille',
    but: '🦆', nomBut: 'le canard',
    obstacle: '🪨', nomObstacles: 'les rochers',
    motifs: ['🐸', '🐟', '🦆', '🐚', '💧'],
    tri: '🐟',
    histoires: [
      { titre: 'Le bain du canard', etapes: [['🦆', 'Le canard arrive au lac'], ['💦', "Il plonge dans l'eau"], ['🪶', 'Il secoue ses plumes']] },
      { titre: 'Le bateau en papier', etapes: [['📄', 'Prendre une feuille'], ['✋', 'La plier en bateau'], ['🌊', "Le poser sur l'eau"], ['⛵', 'Le bateau flotte']] },
      { titre: 'Le pique-nique au lac', etapes: [['🧺', 'Préparer le panier'], ['🚶', "Marcher jusqu'au lac"], ['🍓', 'Manger les fraises'], ['🌅', 'Regarder le coucher du soleil'], ['🏠', 'Rentrer à la maison']] },
    ],
  },
  {
    id: 'sommet',
    nom: 'Le sommet des étoiles',
    dans: 'au sommet des étoiles', vers: 'le sommet des étoiles',
    icone: '⛰️', ami: '🐉',
    cristal: '#facc15', couleurCristal: 'doré',
    ciel: ['#1e2a6b', '#05061a'], // la nuit
    decorations: ['⭐', '🌙', '🔭', '☄️'],
    heros: '🐉', nomHeros: 'le petit dragon',
    but: '🌟', nomBut: "l'étoile",
    obstacle: '☁️', nomObstacles: 'les nuages',
    motifs: ['⭐', '🌙', '☄️', '🐉', '🔭'],
    tri: '⭐',
    histoires: [
      { titre: "L'étoile filante", etapes: [['🌌', 'La nuit tombe'], ['🌠', 'Une étoile filante passe'], ['🤞', 'Faire un vœu']] },
      { titre: "Le dragon s'envole", etapes: [['🐉', 'Le dragon se réveille'], ['💨', 'Il bat des ailes'], ['☁️', 'Il monte au-dessus des nuages'], ['🌙', 'Il arrive près de la lune']] },
      { titre: 'Regarder les étoiles', etapes: [['⛰️', 'Monter en haut de la montagne'], ['🔭', 'Installer la longue-vue'], ['🌙', 'Regarder la lune'], ['⭐', 'Compter les étoiles'], ['😴', "S'endormir sous le ciel"]] },
    ],
  },
];

// Tous les décors du jeu (jeu libre et aventure) : pour lister toutes les phrases à enregistrer.
function tousLesDecors() {
  return [...DECORS, ...MONDES_AVENTURE];
}

let dernierDecor = null;

// Un décor au hasard, jamais deux fois de suite le même.
function tirerDecor() {
  const choix = DECORS.filter(d => d !== dernierDecor);
  dernierDecor = choix[hasard(choix.length)];
  return dernierDecor;
}
