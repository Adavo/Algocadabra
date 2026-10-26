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
];

let dernierDecor = null;

// Un décor au hasard, jamais deux fois de suite le même.
function tirerDecor() {
  const choix = DECORS.filter(d => d !== dernierDecor);
  dernierDecor = choix[hasard(choix.length)];
  return dernierDecor;
}
