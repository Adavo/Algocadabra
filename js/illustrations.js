// Illustrations dessinées en vectoriel (SVG) : le paysage de la carte, le chat noir, les nuages.
// Tout est fait de formes simples et arrondies, dans un style doux pour les petits ;
// les dessins restent nets à toutes les tailles et ne pèsent presque rien.

// Le chat noir de la sorcière, assis.
const SVG_CHAT = `<svg viewBox="0 0 64 64" class="dessin-chat" aria-hidden="true">
  <path d="M46 52 Q60 50 58 34 Q57 28 53 30" fill="none" stroke="#24203a" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="32" cy="47" rx="15" ry="13" fill="#24203a"/>
  <path d="M21 22 L22 8 L30 16 Z M43 22 L42 8 L34 16 Z" fill="#24203a"/>
  <path d="M23.5 13 L24 18 L27 16 Z M40.5 13 L40 18 L37 16 Z" fill="#f9a8d4"/>
  <circle cx="32" cy="25" r="12.5" fill="#24203a"/>
  <ellipse cx="27" cy="24" rx="3.2" ry="4" fill="#fde047"/>
  <ellipse cx="37" cy="24" rx="3.2" ry="4" fill="#fde047"/>
  <ellipse cx="27.6" cy="24.6" rx="1.3" ry="2.6" fill="#1b1a2a"/>
  <ellipse cx="37.6" cy="24.6" rx="1.3" ry="2.6" fill="#1b1a2a"/>
  <circle cx="26.4" cy="22.6" r="0.9" fill="#fff"/>
  <circle cx="36.4" cy="22.6" r="0.9" fill="#fff"/>
  <path d="M30.6 29 L33.4 29 L32 30.6 Z" fill="#f9a8d4"/>
  <path d="M24 30 L17 29 M24 31.5 L17 32.5 M40 30 L47 29 M40 31.5 L47 32.5" stroke="#4b4567" stroke-width="0.8" stroke-linecap="round"/>
  <ellipse cx="26" cy="58" rx="5" ry="3" fill="#24203a"/>
  <ellipse cx="38" cy="58" rx="5" ry="3" fill="#24203a"/>
</svg>`;

// Un gros nuage tout rond, pour cacher les lieux pas encore atteints.
const SVG_NUAGE = `<svg viewBox="0 0 160 100" class="dessin-nuage" aria-hidden="true">
  <g fill="#ffffff">
    <circle cx="48" cy="58" r="30"/><circle cx="82" cy="44" r="38"/><circle cx="118" cy="60" r="28"/>
    <rect x="30" y="58" width="104" height="30" rx="15"/>
  </g>
  <g fill="#e9e3ff"><ellipse cx="82" cy="84" rx="54" ry="8"/></g>
  <circle cx="70" cy="34" r="9" fill="#ffffffcc"/>
</svg>`;

// Les petites formes communes à tous les dessins.
const etincelle = (x, y, t, c = '#fff7c2') => `<path d="M${x} ${y - t} Q${x} ${y} ${x + t} ${y} Q${x} ${y} ${x} ${y + t} Q${x} ${y} ${x - t} ${y} Q${x} ${y} ${x} ${y - t} Z" fill="${c}" class="scintille"/>`;

// Arbres ronds, sapins et champignons.
const arbre = (x, y, t = 1, c = '#3f9b4f', clair = '#6fd17a') => `<g transform="translate(${x} ${y}) scale(${t})">
  <rect x="-5" y="0" width="10" height="24" rx="4" fill="#7c4a2a"/>
  <circle cx="0" cy="-10" r="22" fill="${c}"/><circle cx="-12" cy="0" r="14" fill="${c}"/><circle cx="13" cy="-1" r="15" fill="${c}"/>
  <circle cx="-6" cy="-17" r="8" fill="${clair}" opacity="0.7"/>
</g>`;
const sapin = (x, y, t = 1) => `<g transform="translate(${x} ${y}) scale(${t})">
  <rect x="-4" y="14" width="8" height="14" rx="3" fill="#6b3f22"/>
  <path d="M0 -42 Q8 -30 18 -16 Q10 -16 8 -16 Q16 -4 26 10 Q14 12 0 12 Q-14 12 -26 10 Q-16 -4 -8 -16 Q-10 -16 -18 -16 Q-8 -30 0 -42 Z" fill="#2f7d45"/>
  <path d="M0 -42 Q8 -30 18 -16 Q10 -16 8 -16 Q14 -6 20 4 Q8 -8 0 -36 Z" fill="#4caf63" opacity="0.6"/>
</g>`;
const champignon = (x, y, t = 1) => `<g transform="translate(${x} ${y}) scale(${t})">
  <rect x="-5" y="-4" width="10" height="14" rx="4" fill="#fff4e6"/>
  <path d="M-14 -2 Q-14 -18 0 -18 Q14 -18 14 -2 Z" fill="#ef4444"/>
  <circle cx="-6" cy="-9" r="2.6" fill="#fff"/><circle cx="5" cy="-12" r="2" fill="#fff"/><circle cx="7" cy="-5" r="1.8" fill="#fff"/>
</g>`;
const tournesol = (x, y) => `<g transform="translate(${x} ${y})">
  <path d="M0 0 L0 34" stroke="#3f9b4f" stroke-width="4"/><ellipse cx="7" cy="20" rx="8" ry="4" fill="#4caf63" transform="rotate(-25 7 20)"/>
  ${Array.from({ length: 10 }, (_, i) => `<ellipse cx="0" cy="-12" rx="5" ry="9" fill="#fcd34d" transform="rotate(${i * 36})"/>`).join('')}
  <circle r="8" fill="#92400e"/><circle r="4" fill="#78350f"/>
</g>`;
const carotte = (x, y) => `<g transform="translate(${x} ${y})">
  <path d="M-6 0 L6 0 L0 12 Z" fill="#fb923c"/>
  <path d="M0 0 Q-7 -10 -4 -14 M0 0 Q0 -12 2 -16 M0 0 Q7 -9 6 -13" stroke="#3f9b4f" stroke-width="3" fill="none" stroke-linecap="round"/>
</g>`;
const salade = (x, y) => `<g transform="translate(${x} ${y})"><circle r="10" fill="#86efac"/><circle r="6" fill="#4ade80"/><path d="M-6 -2 Q0 4 6 -2" stroke="#22c55e" stroke-width="2" fill="none"/></g>`;
const nenuphar = (x, y, r = 13, fleur = false) => `<g transform="translate(${x} ${y})">
  <path d="M0 0 L${r} -4 A${r} ${r * 0.6} 0 1 1 ${r} 4 Z" fill="#3fae5a"/>
  ${fleur ? '<circle cx="-2" cy="-3" r="5" fill="#f9a8d4"/><circle cx="-2" cy="-3" r="2.2" fill="#fde047"/>' : ''}
</g>`;
const roseau = (x, y, h) => `<g><path d="M${x} ${y} Q${x - 3} ${y - h / 2} ${x + 2} ${y - h}" stroke="#4d7c0f" stroke-width="3" fill="none"/><ellipse cx="${x + 2}" cy="${y - h + 6}" rx="3.5" ry="9" fill="#7c4a2a"/></g>`;


// Le paysage de la carte (900 × 600). cheminD : le tracé du chemin de terre.
function svgPaysageCarte(cheminD) {
  // Quelques étoiles, dont certaines scintillent.
  const etoiles = [
    [60, 40, 2], [140, 90, 1.5], [210, 30, 2.2], [290, 70, 1.4], [360, 25, 1.8], [560, 35, 1.6],
    [620, 95, 2], [700, 30, 1.4], [850, 50, 2.2], [820, 130, 1.5], [90, 150, 1.4], [250, 140, 1.2],
    [-80, 60, 2], [-250, 120, 1.6], [-420, 30, 2], [-150, -80, 1.8], [980, 60, 2], [1150, 140, 1.5], [1320, 40, 2.2], [1050, -60, 1.6], [450, -60, 2], [200, -120, 1.5], [700, -140, 1.8],
  ].map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" class="${i % 3 ? '' : 'scintille'}" style="animation-delay:${i * 0.4}s"/>`).join('');
  return `<svg viewBox="0 0 900 600" class="paysage-carte" aria-hidden="true">
  <defs>
    <linearGradient id="pc-ciel" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="600">
      <stop offset="0" stop-color="#1a1446"/><stop offset="0.22" stop-color="#3d2a7d"/>
      <stop offset="0.38" stop-color="#9a5bb0"/><stop offset="0.47" stop-color="#f4a3a0"/><stop offset="0.55" stop-color="#ffd2a1"/>
    </linearGradient>
    <linearGradient id="pc-prairie" gradientUnits="userSpaceOnUse" x1="0" y1="280" x2="0" y2="640">
      <stop offset="0" stop-color="#9ee07f"/><stop offset="1" stop-color="#4f9e45"/>
    </linearGradient>
    <linearGradient id="pc-montagne" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8f7fd6"/><stop offset="1" stop-color="#4a3c8f"/>
    </linearGradient>
    <radialGradient id="pc-lac" cx="0.4" cy="0.35" r="0.7">
      <stop offset="0" stop-color="#b9f0ff"/><stop offset="0.6" stop-color="#4fb3ea"/><stop offset="1" stop-color="#2a86c6"/>
    </radialGradient>
    <linearGradient id="pc-mur" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#b294f0"/><stop offset="1" stop-color="#6d4cc2"/>
    </linearGradient>
    <radialGradient id="pc-lumiere" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#fff3b0"/><stop offset="1" stop-color="#fbbf24" stop-opacity="0"/>
    </radialGradient>
    <mask id="pc-lune"><circle cx="770" cy="78" r="34" fill="#fff"/><circle cx="786" cy="68" r="30" fill="#000"/></mask>
  </defs>

  <!-- Le ciel, la lune et les étoiles -->
  <rect x="-3000" y="-3000" width="6900" height="4000" fill="url(#pc-ciel)"/>
  <circle cx="770" cy="78" r="60" fill="#fff3c4" opacity="0.12"/>
  <circle cx="770" cy="78" r="34" fill="#fff3c4" mask="url(#pc-lune)"/>
  ${etoiles}
  ${etincelle(330, 45, 7)}${etincelle(600, 60, 6)}${etincelle(120, 110, 5)}

  <!-- Les montagnes derrière la maison -->
  <path d="M180 270 L292 150 Q314 128 336 150 L430 270 Z" fill="#6a5cb0"/>
  <path d="M470 270 L574 160 Q594 140 614 160 L730 270 Z" fill="#6a5cb0"/>
  <path d="M292 150 Q314 128 336 150 L328 160 L318 152 L308 162 L300 154 Z" fill="#f5f3ff"/>
  <path d="M574 160 Q594 140 614 160 L606 170 L596 162 L586 172 L580 164 Z" fill="#f5f3ff"/>
  <path d="M300 280 L418 104 Q450 62 482 104 L600 280 Z" fill="url(#pc-montagne)"/>
  <path d="M418 104 Q450 62 482 104 L472 120 L460 108 L450 124 L440 110 L428 122 Z" fill="#ffffff"/>
  <path d="M450 70 L482 104 L600 280 L470 280 Z" fill="#000" opacity="0.1"/>

  <!-- Les collines et la grande prairie -->
  <path d="M-3000 250 L-600 250 Q-300 200 0 262 Q120 205 260 246 Q380 280 520 240 Q680 198 900 252 Q1200 290 1500 230 L3900 230 L3900 4000 L-3000 4000 Z" fill="#8fd17a"/>
  <path d="M-3000 310 L-600 310 Q-300 270 0 300 Q150 262 300 290 Q450 314 600 284 Q760 256 900 296 Q1200 330 1500 280 L3900 280 L3900 4000 L-3000 4000 Z" fill="url(#pc-prairie)"/>
  <path d="M-3000 540 L-600 540 Q-300 500 0 520 Q200 480 450 505 Q700 530 900 490 Q1200 460 1500 520 L3900 520 L3900 4000 L-3000 4000 Z" fill="#478f3e" opacity="0.5"/>

  <!-- Le lac (à gauche) -->
  <ellipse cx="160" cy="366" rx="122" ry="68" fill="#2a86c6"/>
  <ellipse cx="160" cy="362" rx="112" ry="60" fill="url(#pc-lac)"/>
  <path d="M95 340 Q125 326 158 332" stroke="#ffffffaa" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M190 392 Q212 386 228 376" stroke="#ffffff88" stroke-width="3" fill="none" stroke-linecap="round"/>
  ${nenuphar(110, 380, 13, true)}${nenuphar(212, 350, 12)}${nenuphar(178, 398, 11)}${nenuphar(132, 352, 9)}
  ${roseau(52, 392, 46)}${roseau(64, 398, 38)}${roseau(262, 396, 42)}

  <!-- Le chemin de terre qui fait le tour de la maison -->
  <path d="${cheminD}" fill="none" stroke="#a8713f" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${cheminD}" fill="none" stroke="#e9c08d" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${cheminD}" fill="none" stroke="#f7dcb3" stroke-width="4" stroke-dasharray="2 16" stroke-linecap="round"/>

  <!-- Le potager (à droite) -->
  <rect x="660" y="312" width="164" height="86" rx="20" fill="#8a5a36"/>
  <path d="M676 334 L808 334 M676 355 L808 355 M676 376 L808 376" stroke="#a8744a" stroke-width="7" stroke-linecap="round"/>
  ${carotte(690, 330)}${carotte(722, 330)}${carotte(754, 330)}${carotte(786, 330)}
  ${salade(690, 357)}${salade(726, 357)}${salade(762, 357)}${salade(798, 357)}
  ${carotte(704, 372)}${carotte(740, 372)}${carotte(776, 372)}
  <g fill="#fff8ee">${Array.from({ length: 11 }, (_, i) => `<rect x="${652 + i * 17}" y="398" width="9" height="24" rx="4"/>`).join('')}
    <rect x="648" y="404" width="190" height="6" rx="3"/></g>
  ${tournesol(842, 296)}${tournesol(858, 336)}
  ${arbre(860, 430, 0.8)}

  <!-- La forêt (en bas) -->
  ${sapin(330, 548, 1.1)}${sapin(560, 552, 1.05)}${sapin(380, 586, 0.95)}${sapin(520, 590, 0.9)}${sapin(290, 596, 0.9)}${sapin(610, 596, 0.85)}
  ${arbre(600, 500, 0.75)}${arbre(300, 500, 0.8)}
  ${champignon(408, 590, 1.1)}${champignon(492, 594, 0.9)}${champignon(360, 520, 0.8)}

  <!-- Les bords du paysage, pour les écrans plus larges ou plus hauts -->
  ${arbre(-60, 330, 1)}${sapin(-160, 380, 1.1)}${arbre(-300, 420, 1.2)}${sapin(-420, 360, 1)}${champignon(-230, 470, 1.1)}
  ${arbre(960, 330, 1)}${sapin(1060, 380, 1.1)}${arbre(1200, 420, 1.2)}${sapin(1330, 360, 1)}${tournesol(1000, 450)}
  ${sapin(150, 660, 1.2)}${arbre(760, 650, 1.1)}${sapin(-80, 640, 1.2)}${arbre(1000, 640, 1.1)}${champignon(650, 680, 1.2)}

  <!-- Quelques arbres autour de la maison -->
  ${arbre(330, 300, 0.9)}${arbre(572, 306, 0.85)}

  <!-- La maison de la sorcière (au centre) -->
  <ellipse cx="452" cy="388" rx="88" ry="15" fill="#000" opacity="0.15"/>
  <rect x="484" y="226" width="18" height="40" rx="4" fill="#5b3f86"/>
  <g class="fumee-svg"><circle cx="493" cy="212" r="8" fill="#fff" opacity="0.7"/><circle cx="500" cy="192" r="10" fill="#fff" opacity="0.55"/><circle cx="510" cy="170" r="12" fill="#fff" opacity="0.4"/></g>
  <rect x="400" y="292" width="104" height="92" rx="14" fill="url(#pc-mur)"/>
  <path d="M434 384 L434 348 Q450 326 466 348 L466 384 Z" fill="#3b2a6b"/>
  <circle cx="460" cy="364" r="2.6" fill="#fcd34d"/>
  <circle cx="481" cy="322" r="18" fill="url(#pc-lumiere)"/>
  <circle cx="481" cy="322" r="11" fill="#ffe27a" stroke="#3b2a6b" stroke-width="4"/>
  <path d="M481 311 L481 333 M470 322 L492 322" stroke="#3b2a6b" stroke-width="2.4"/>
  <circle cx="420" cy="322" r="8" fill="#ffe27a" stroke="#3b2a6b" stroke-width="3"/>
  <ellipse cx="452" cy="294" rx="72" ry="13" fill="#2e2257"/>
  <path d="M398 292 Q428 262 440 222 Q450 190 488 172 Q468 204 476 236 Q488 270 506 292 Z" fill="#3b2a6b"/>
  <path d="M410 286 Q452 268 496 286 L498 296 Q452 278 406 296 Z" fill="#a855f7"/>
  <path d="M450 240 L453 248 L461 248 L455 253 L457 261 L450 256 L443 261 L445 253 L439 248 L447 248 Z" fill="#fcd34d"/>
  <path d="M418 392 L418 366" stroke="#5b3f86" stroke-width="3"/>
  <circle cx="418" cy="362" r="6" fill="#fde68a"/><circle cx="418" cy="362" r="12" fill="#fde68a" opacity="0.25"/>
</svg>`;
}

// ---------- Les décors des 5 lieux de l'aventure ----------
// Même repère que la scène d'un lieu (900 × 520) ; le dessin déborde largement pour remplir tout l'écran.
// cheminD : le tracé qui relie les 10 pierres et le cristal. Le milieu (y 230-330) et les bords restent
// libres pour les détails, les deux rangées de pierres (y 170 et 390) restent bien lisibles.

const citrouille = (x, y, t = 1) => `<g transform="translate(${x} ${y}) scale(${t})">
  <ellipse cx="-11" cy="0" rx="13" ry="15" fill="#ea7a1a"/><ellipse cx="11" cy="0" rx="13" ry="15" fill="#ea7a1a"/>
  <ellipse cx="0" cy="0" rx="13" ry="16" fill="#f59e0b"/>
  <path d="M0 -15 Q2 -24 8 -26" stroke="#3f7d2a" stroke-width="4" fill="none" stroke-linecap="round"/>
</g>`;
const fiole = (x, y, c, t = 1) => `<g transform="translate(${x} ${y}) scale(${t})">
  <rect x="-4" y="-26" width="8" height="10" rx="2" fill="#e9e3ff"/><rect x="-5" y="-30" width="10" height="5" rx="2" fill="#a16207"/>
  <circle cx="0" cy="-6" r="12" fill="#e9e3ff" opacity="0.5"/><path d="M-11 -3 A12 12 0 0 0 11 -3 Z" fill="${c}"/>
  <circle cx="-4" cy="-10" r="3" fill="#fff" opacity="0.8"/>
</g>`;
const livre = (x, y, c, h = 34) => `<rect x="${x}" y="${y - h}" width="12" height="${h}" rx="2" fill="${c}"/><rect x="${x + 2}" y="${y - h + 6}" width="8" height="3" fill="#fde68a"/>`;
const bougie = (x, y) => `<g transform="translate(${x} ${y})">
  <ellipse cx="0" cy="-30" rx="14" ry="18" fill="#fde68a" opacity="0.25" class="scintille"/>
  <rect x="-6" y="-20" width="12" height="22" rx="3" fill="#fff4e6"/><path d="M0 -20 Q-5 -27 0 -34 Q5 -27 0 -20 Z" fill="#fbbf24"/>
</g>`;
const nuageDoux = (x, y, t = 1, c = '#ffffff') => `<g transform="translate(${x} ${y}) scale(${t})" fill="${c}">
  <circle cx="-30" cy="4" r="18"/><circle cx="0" cy="-6" r="26"/><circle cx="30" cy="4" r="18"/><rect x="-48" y="4" width="96" height="18" rx="9"/>
</g>`;
const sapinCouleur = (x, y, t, c) => `<g transform="translate(${x} ${y}) scale(${t})">
  <rect x="-4" y="14" width="8" height="14" rx="3" fill="#6b3f22"/>
  <path d="M0 -42 Q8 -30 18 -16 Q10 -16 8 -16 Q16 -4 26 10 Q14 12 0 12 Q-14 12 -26 10 Q-16 -4 -8 -16 Q-10 -16 -18 -16 Q-8 -30 0 -42 Z" fill="${c}"/>
</g>`;
const canard = (x, y, t = 1, sens = 1) => `<g transform="translate(${x} ${y}) scale(${t * sens} ${t})">
  <ellipse cx="0" cy="0" rx="20" ry="12" fill="#fff8e1"/><path d="M14 -4 Q24 -6 22 6 Z" fill="#fff8e1"/>
  <circle cx="-14" cy="-14" r="9" fill="#fff8e1"/><path d="M-22 -14 L-31 -11 L-22 -10 Z" fill="#f59e0b"/>
  <circle cx="-16" cy="-16" r="1.6" fill="#1b1a2a"/><path d="M-4 -2 Q6 -8 12 0" stroke="#e5d6b0" stroke-width="2.5" fill="none"/>
</g>`;
const rocher = (x, y, t = 1, c = '#8b8fb0', neige = false) => `<g transform="translate(${x} ${y}) scale(${t})">
  <path d="M-30 10 Q-28 -14 -6 -20 Q14 -26 26 -6 Q34 6 28 10 Z" fill="${c}"/><path d="M-6 -20 Q14 -26 26 -6 Q10 -10 -6 -20 Z" fill="#fff" opacity="${neige ? 0.9 : 0.15}"/>
</g>`;

// Un sol (ou un ciel) qui s'étend loin dans toutes les directions.
const solLoin = (y, c) => `<rect x="-3000" y="${y}" width="6900" height="4000" fill="${c}"/>`;

const DECORS_LIEUX = {
  // Dans la maison de la sorcière, le matin : murs de bois violet, plancher, étagères de potions.
  maison: d => `
  <defs>
    <linearGradient id="dl-mur" gradientUnits="userSpaceOnUse" x1="0" y1="-300" x2="0" y2="100"><stop offset="0" stop-color="#2c1856"/><stop offset="1" stop-color="#5b3a8f"/></linearGradient>
    <linearGradient id="dl-sol" gradientUnits="userSpaceOnUse" x1="0" y1="100" x2="0" y2="600"><stop offset="0" stop-color="#9a6a42"/><stop offset="1" stop-color="#6e4428"/></linearGradient>
    <linearGradient id="dl-fenetre" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#93c5fd"/><stop offset="1" stop-color="#fde2c4"/></linearGradient>
  </defs>
  ${solLoin(-3000, 'url(#dl-mur)')}
  ${Array.from({ length: 30 }, (_, i) => `<rect x="${-1500 + i * 130}" y="-3000" width="4" height="3104" fill="#00000022"/>`).join('')}
  ${solLoin(100, 'url(#dl-sol)')}
  ${Array.from({ length: 14 }, (_, i) => `<path d="M-3000 ${130 + i * i * 6 + i * 20} L3900 ${130 + i * i * 6 + i * 20}" stroke="#5a3820" stroke-width="3" opacity="0.5"/>`).join('')}
  <rect x="-3000" y="92" width="6900" height="14" fill="#3b2361"/>
  <!-- La fenêtre ronde, le soleil du matin -->
  <circle cx="450" cy="10" r="74" fill="#3b2361"/><circle cx="450" cy="10" r="62" fill="url(#dl-fenetre)"/>
  <circle cx="480" cy="34" r="16" fill="#fde047"/>${nuageDoux(420, 0, 0.5)}
  <path d="M450 -52 L450 72 M388 10 L512 10" stroke="#3b2361" stroke-width="7"/>
  <path d="M376 76 Q450 112 524 76" stroke="#7c3aed" stroke-width="10" fill="none" stroke-linecap="round"/>
  <!-- Les étagères -->
  <g><rect x="80" y="20" width="200" height="12" rx="4" fill="#8a5a36"/>${fiole(110, 20, '#a855f7')}${fiole(150, 20, '#22c55e', 0.8)}${livre(176, 20, '#ef4444')}${livre(190, 20, '#3b82f6', 30)}${livre(204, 20, '#facc15', 38)}${fiole(250, 20, '#f472b6', 0.9)}</g>
  <g><rect x="620" y="20" width="200" height="12" rx="4" fill="#8a5a36"/>${fiole(650, 20, '#38bdf8', 0.9)}${livre(680, 20, '#22c55e', 30)}${livre(694, 20, '#a855f7')}${fiole(740, 20, '#f59e0b')}${fiole(790, 20, '#ef4444', 0.8)}</g>
  <g><rect x="-330" y="-40" width="220" height="12" rx="4" fill="#8a5a36"/>${livre(-310, -40, '#f472b6')}${livre(-296, -40, '#22c55e', 28)}${fiole(-250, -40, '#facc15')}${fiole(-200, -40, '#a855f7', 0.8)}</g>
  <g><rect x="1010" y="-40" width="220" height="12" rx="4" fill="#8a5a36"/>${fiole(1040, -40, '#22c55e')}${livre(1080, -40, '#3b82f6')}${livre(1094, -40, '#ef4444', 28)}${fiole(1150, -40, '#f472b6', 0.9)}</g>
  <!-- Une guirlande d'étoiles -->
  <path d="M-200 -70 Q120 -20 340 -70 M560 -70 Q780 -20 1100 -70" stroke="#c4b5fd" stroke-width="2" fill="none"/>
  ${[[0, -42], [120, -36], [240, -46], [660, -46], [780, -36], [900, -42]].map(([x, y]) => etincelle(x, y, 9, '#fde047')).join('')}
  <!-- Le chemin : un long tapis -->
  <path d="${d}" fill="none" stroke="#5b21b6" stroke-width="58" stroke-linejoin="round"/>
  <path d="${d}" fill="none" stroke="#8b5cf6" stroke-width="46" stroke-linejoin="round"/>
  <path d="${d}" fill="none" stroke="#fcd34d" stroke-width="3" stroke-dasharray="10 10" stroke-linejoin="round"/>
  <!-- Au milieu : un tapis rond et le chaudron -->
  <ellipse cx="450" cy="282" rx="150" ry="44" fill="#be185d" opacity="0.8"/><ellipse cx="450" cy="282" rx="128" ry="34" fill="#f472b6" opacity="0.6"/>
  <ellipse cx="450" cy="300" rx="62" ry="12" fill="#000" opacity="0.25"/>
  <path d="M398 262 Q396 304 450 306 Q504 304 502 262 Z" fill="#26213a"/><ellipse cx="450" cy="262" rx="56" ry="11" fill="#3b3355"/><ellipse cx="450" cy="262" rx="46" ry="7" fill="#4ade80"/>
  <circle cx="436" cy="246" r="7" fill="#86efac" class="scintille"/><circle cx="462" cy="236" r="5" fill="#bbf7d0" class="scintille" style="animation-delay:0.8s"/>
  ${citrouille(310, 290, 0.9)}${citrouille(600, 296, 0.8)}
  <!-- Le bas de la pièce -->
  ${bougie(250, 500)}${bougie(640, 494)}${citrouille(450, 490, 1.1)}${citrouille(120, 490, 0.9)}
  ${bougie(-100, 300)}${bougie(1000, 300)}${citrouille(-60, 420)}${citrouille(960, 430, 1.2)}
  <!-- Le balai, à droite -->
  <g transform="translate(905 220) rotate(14)"><rect x="-4" y="-120" width="8" height="150" rx="4" fill="#8a5a36"/><path d="M-20 30 L20 30 L28 80 L-28 80 Z" fill="#facc15"/><path d="M-20 34 L20 34" stroke="#a16207" stroke-width="5"/></g>`,

  // Le potager, en fin de matinée : grand soleil, barrière blanche, rangées de légumes.
  potager: d => `
  <defs>
    <linearGradient id="dl-ciel" gradientUnits="userSpaceOnUse" x1="0" y1="-400" x2="0" y2="100"><stop offset="0" stop-color="#38bdf8"/><stop offset="1" stop-color="#d9f3ff"/></linearGradient>
    <linearGradient id="dl-herbe" gradientUnits="userSpaceOnUse" x1="0" y1="80" x2="0" y2="600"><stop offset="0" stop-color="#9ee07f"/><stop offset="1" stop-color="#4f9e45"/></linearGradient>
  </defs>
  ${solLoin(-3000, 'url(#dl-ciel)')}
  <circle cx="760" cy="-30" r="70" fill="#fde047" opacity="0.25"/><circle cx="760" cy="-30" r="44" fill="#fde047"/>
  ${nuageDoux(160, -40)}${nuageDoux(520, -70, 0.8)}${nuageDoux(-200, -10, 1.1)}${nuageDoux(1100, -50, 0.9)}
  <path d="M-3000 80 Q-200 20 200 70 Q500 30 800 66 Q1100 30 3900 70 L3900 200 L-3000 200 Z" fill="#7cc46a"/>
  ${solLoin(84, 'url(#dl-herbe)')}
  <g fill="#fff8ee">${Array.from({ length: 70 }, (_, i) => `<rect x="${-1200 + i * 48}" y="50" width="12" height="44" rx="5"/>`).join('')}
    <rect x="-1200" y="60" width="3360" height="7" rx="3"/><rect x="-1200" y="80" width="3360" height="7" rx="3"/></g>
  ${tournesol(40, 60)}${tournesol(90, 40)}${tournesol(820, 50)}${tournesol(870, 70)}${tournesol(-300, 50)}${tournesol(1200, 50)}
  <!-- Le chemin de terre -->
  <path d="${d}" fill="none" stroke="#a8713f" stroke-width="56" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${d}" fill="none" stroke="#e9c08d" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Au milieu : les plates-bandes -->
  <rect x="250" y="246" width="420" height="76" rx="22" fill="#8a5a36"/>
  <path d="M270 268 L650 268 M270 298 L650 298" stroke="#a8744a" stroke-width="8" stroke-linecap="round"/>
  ${[290, 340, 390, 440, 490, 540, 590, 630].map(x => carotte(x, 264)).join('')}
  ${[300, 352, 404, 456, 508, 560, 612].map(x => salade(x, 298)).join('')}
  <!-- Le bas et les côtés -->
  <rect x="140" y="460" width="300" height="60" rx="18" fill="#8a5a36"/><rect x="500" y="460" width="300" height="60" rx="18" fill="#8a5a36"/>
  ${[170, 220, 270, 320, 370, 410].map(x => salade(x, 486)).join('')}${[530, 580, 630, 680, 730, 770].map(x => carotte(x, 482)).join('')}
  <rect x="-500" y="200" width="320" height="70" rx="20" fill="#8a5a36"/>${[-470, -420, -370, -320, -270, -220].map(x => carotte(x, 226)).join('')}
  <rect x="1080" y="200" width="320" height="70" rx="20" fill="#8a5a36"/>${[1110, 1160, 1210, 1260, 1310, 1360].map(x => salade(x, 234)).join('')}
  <!-- L'épouvantail tout gentil -->
  <g transform="translate(880 280)"><rect x="-3" y="-20" width="6" height="80" fill="#8a5a36"/><rect x="-40" y="-6" width="80" height="6" rx="3" fill="#8a5a36"/>
    <path d="M-18 -8 L18 -8 L22 34 L-22 34 Z" fill="#ef4444"/><circle cx="0" cy="-24" r="16" fill="#fde68a"/><circle cx="-5" cy="-26" r="2" fill="#1b1a2a"/><circle cx="5" cy="-26" r="2" fill="#1b1a2a"/>
    <path d="M-5 -19 Q0 -15 5 -19" stroke="#1b1a2a" stroke-width="2" fill="none"/><path d="M-26 -36 L26 -36 L14 -48 L-14 -48 Z" fill="#a16207"/></g>
  <!-- L'arrosoir -->
  <g transform="translate(30 250)"><rect x="-20" y="-20" width="40" height="34" rx="8" fill="#38bdf8"/><path d="M20 -10 L44 -26" stroke="#38bdf8" stroke-width="7" stroke-linecap="round"/><path d="M-20 -14 Q-36 -4 -20 8" stroke="#0284c7" stroke-width="5" fill="none"/></g>
  ${arbre(-120, 140, 1.2)}${arbre(1020, 150, 1.2)}${arbre(-80, 520, 1.3)}${arbre(980, 520, 1.3)}`,

  // La forêt enchantée, l'après-midi : arbres d'automne, rayons de lumière, champignons.
  foret: d => `
  <defs>
    <linearGradient id="dl-ciel" gradientUnits="userSpaceOnUse" x1="0" y1="-400" x2="0" y2="100"><stop offset="0" stop-color="#f59e0b"/><stop offset="1" stop-color="#fde68a"/></linearGradient>
    <linearGradient id="dl-mousse" gradientUnits="userSpaceOnUse" x1="0" y1="90" x2="0" y2="600"><stop offset="0" stop-color="#6b8e23"/><stop offset="1" stop-color="#3f5a1e"/></linearGradient>
  </defs>
  ${solLoin(-3000, 'url(#dl-ciel)')}
  ${Array.from({ length: 24 }, (_, i) => sapinCouleur(-1100 + i * 140, 60, 2.2, '#4d6b2a')).join('')}
  ${Array.from({ length: 20 }, (_, i) => arbre(-1040 + i * 160, 70, 1.8, ['#ea580c', '#f59e0b', '#b45309'][i % 3], '#fcd34d')).join('')}
  ${solLoin(92, 'url(#dl-mousse)')}
  <path d="M300 -400 L380 -400 L560 520 L420 520 Z M620 -400 L670 -400 L780 520 L700 520 Z M-40 -400 L20 -400 L120 520 L40 520 Z" fill="#fff7c2" opacity="0.12"/>
  <!-- Le chemin de terre et de mousse -->
  <path d="${d}" fill="none" stroke="#5c3b1e" stroke-width="56" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${d}" fill="none" stroke="#a87b4f" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Au milieu : la souche et le rond de champignons -->
  <ellipse cx="450" cy="300" rx="70" ry="14" fill="#000" opacity="0.2"/>
  <path d="M410 300 L414 258 L486 258 L490 300 Z" fill="#7c4a2a"/><ellipse cx="450" cy="258" rx="36" ry="10" fill="#d6a76f"/><ellipse cx="450" cy="258" rx="20" ry="5" fill="none" stroke="#a87b4f" stroke-width="2"/>
  ${champignon(360, 300, 1.2)}${champignon(540, 302, 1.1)}${champignon(390, 278, 0.8)}${champignon(510, 276, 0.8)}${champignon(300, 282, 0.9)}${champignon(600, 284, 0.9)}
  ${[[260, 250], [640, 252], [450, 228]].map(([x, y]) => etincelle(x, y, 8)).join('')}
  <!-- Les feuilles tombées -->
  ${Array.from({ length: 26 }, (_, i) => { const x = (i * 137) % 1100 - 100, y = 460 + (i * 53) % 90; return `<ellipse cx="${x}" cy="${y}" rx="9" ry="5" fill="${['#ea580c', '#f59e0b', '#b45309'][i % 3]}" transform="rotate(${i * 47} ${x} ${y})"/>`; }).join('')}
  <!-- Les arbres du devant -->
  ${arbre(40, 280, 1.6, '#ea580c', '#fdba74')}${sapinCouleur(-120, 300, 2, '#2f6b3a')}${arbre(870, 300, 1.6, '#f59e0b', '#fde68a')}${sapinCouleur(1020, 300, 2, '#2f6b3a')}
  ${sapinCouleur(-60, 560, 2.2, '#2f6b3a')}${arbre(140, 580, 1.8, '#b45309', '#f59e0b')}${arbre(760, 580, 1.8, '#ea580c', '#fdba74')}${sapinCouleur(960, 560, 2.2, '#2f6b3a')}${champignon(300, 560, 1.4)}${champignon(600, 566, 1.2)}`,

  // Le lac aux nénuphars, au coucher du soleil : un ponton de bois sur l'eau.
  lac: d => `
  <defs>
    <linearGradient id="dl-ciel" gradientUnits="userSpaceOnUse" x1="0" y1="-400" x2="0" y2="96"><stop offset="0" stop-color="#4c1d95"/><stop offset="0.5" stop-color="#db2777"/><stop offset="1" stop-color="#fdba74"/></linearGradient>
    <linearGradient id="dl-eau" gradientUnits="userSpaceOnUse" x1="0" y1="96" x2="0" y2="600"><stop offset="0" stop-color="#f9a8d4"/><stop offset="0.25" stop-color="#7c6fd6"/><stop offset="1" stop-color="#2a4a9a"/></linearGradient>
  </defs>
  ${solLoin(-3000, 'url(#dl-ciel)')}
  <circle cx="450" cy="96" r="120" fill="#fde68a" opacity="0.25"/><circle cx="450" cy="96" r="70" fill="#fdba74"/>
  ${nuageDoux(160, -20, 0.9, '#f9a8d4')}${nuageDoux(760, -40, 1, '#f9a8d4')}${nuageDoux(-260, -60, 1.1, '#f0abfc')}
  <path d="M-3000 96 Q-400 40 100 80 Q250 60 340 96 Z M560 96 Q700 50 900 74 Q1400 30 3900 96 Z" fill="#4c1d95" opacity="0.5"/>
  ${solLoin(96, 'url(#dl-eau)')}
  ${[120, 150, 186, 230].map((y, i) => `<path d="M${390 + i * 12} ${y} L${510 - i * 12} ${y}" stroke="#fde68a" stroke-width="5" stroke-linecap="round" opacity="${0.8 - i * 0.15}"/>`).join('')}
  ${Array.from({ length: 16 }, (_, i) => `<path d="M${-400 + i * 110} ${140 + (i * 71) % 380} q16 -6 32 0" stroke="#ffffff66" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('')}
  <!-- Le ponton de bois -->
  <path d="${d}" fill="none" stroke="#5c3b1e" stroke-width="58" stroke-linejoin="round"/>
  <path d="${d}" fill="none" stroke="#b07a4a" stroke-width="48" stroke-linejoin="round"/>
  <path d="${d}" fill="none" stroke="#7c4a2a" stroke-width="48" stroke-dasharray="3 22" stroke-linejoin="round"/>
  <!-- Au milieu : nénuphars et canards -->
  ${nenuphar(320, 280, 22, true)}${nenuphar(400, 300, 16)}${nenuphar(560, 270, 20)}${nenuphar(630, 300, 18, true)}${nenuphar(250, 300, 14)}
  ${canard(470, 282, 1.1)}${canard(520, 296, 0.75)}
  <!-- Les rives, en bas et sur les côtés -->
  <path d="M-3000 470 Q-200 450 100 480 Q450 500 800 476 Q1200 450 3900 470 L3900 4000 L-3000 4000 Z" fill="#4f9e45"/>
  <path d="M-3000 486 Q-200 470 100 496 Q450 516 800 492 Q1200 466 3900 486 L3900 4000 L-3000 4000 Z" fill="#3f7d3a"/>
  ${roseau(150, 500, 60)}${roseau(166, 506, 48)}${roseau(700, 498, 58)}${roseau(716, 504, 44)}${roseau(420, 510, 50)}
  ${roseau(10, 300, 70)}${roseau(26, 306, 56)}${roseau(880, 290, 70)}${roseau(864, 296, 54)}
  ${nenuphar(960, 200, 18, true)}${nenuphar(-80, 220, 18, true)}${canard(1040, 320, 1)}${canard(-160, 300, 1, -1)}
  ${arbre(-200, 520, 1.6)}${arbre(1100, 520, 1.6)}${arbre(300, 560, 1.2)}${arbre(600, 566, 1.3)}`,

  // Le sommet, la nuit : la montagne enneigée, la grande lune, une mer de nuages en bas.
  sommet: d => `
  <defs>
    <linearGradient id="dl-ciel" gradientUnits="userSpaceOnUse" x1="0" y1="-500" x2="0" y2="200"><stop offset="0" stop-color="#05061a"/><stop offset="1" stop-color="#2a3a8a"/></linearGradient>
    <linearGradient id="dl-roche" gradientUnits="userSpaceOnUse" x1="0" y1="60" x2="0" y2="600"><stop offset="0" stop-color="#6d74b8"/><stop offset="1" stop-color="#3b3f7a"/></linearGradient>
    <mask id="dl-lune"><circle cx="740" cy="-10" r="44" fill="#fff"/><circle cx="760" cy="-24" r="38" fill="#000"/></mask>
  </defs>
  ${solLoin(-3000, 'url(#dl-ciel)')}
  ${Array.from({ length: 70 }, (_, i) => `<circle cx="${(i * 197) % 2600 - 850}" cy="${-420 + (i * 89) % 470}" r="${1.2 + (i % 4) * 0.5}" fill="#fff" class="${i % 3 ? '' : 'scintille'}" style="animation-delay:${i * 0.3}s"/>`).join('')}
  ${etincelle(200, -30, 9)}${etincelle(560, -80, 7)}${etincelle(-200, -100, 8)}${etincelle(1100, -60, 8)}
  <circle cx="740" cy="-10" r="80" fill="#fff3c4" opacity="0.12"/><circle cx="740" cy="-10" r="44" fill="#fff3c4" mask="url(#dl-lune)"/>
  <path d="M-260 -150 L-80 -90" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.7"/><circle cx="-80" cy="-90" r="4" fill="#fff"/>
  <!-- La montagne : on est tout en haut -->
  <path d="M-3000 200 L-900 -50 L-600 30 L-300 -70 L0 -10 L450 -40 L900 -10 L1200 -80 L1500 20 L1800 -60 L3900 200 L3900 4000 L-3000 4000 Z" fill="#4b4f94"/>
  <path d="M-900 -50 L-840 -10 L-780 -30 L-720 0 L-600 30 L-750 -20 Z M-300 -70 L-240 -30 L-190 -50 L-120 -20 L0 -10 L-160 -40 Z M1200 -80 L1260 -40 L1320 -56 L1390 -24 L1500 20 L1340 -30 Z" fill="#f5f3ff"/>
  <path d="M-3000 110 Q-500 60 0 100 Q450 80 900 100 Q1400 70 3900 110 L3900 4000 L-3000 4000 Z" fill="url(#dl-roche)"/>
  <path d="M-3000 110 Q-500 60 0 100 Q450 80 900 100 Q1400 70 3900 110 L3900 140 Q1400 100 900 128 Q450 108 0 128 Q-500 90 -3000 140 Z" fill="#f5f3ff"/>
  <!-- Le chemin de pierres et de neige -->
  <path d="${d}" fill="none" stroke="#2f3268" stroke-width="56" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="${d}" fill="none" stroke="#c7cbef" stroke-width="44" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Au milieu : la longue-vue et quelques rochers -->
  <g transform="translate(450 300)"><path d="M0 -20 L-22 24 M0 -20 L22 24 M0 -20 L0 26" stroke="#a16207" stroke-width="5" stroke-linecap="round"/>
    <g transform="rotate(-28)"><rect x="-30" y="-34" width="70" height="20" rx="8" fill="#facc15"/><rect x="34" y="-37" width="12" height="26" rx="4" fill="#fde68a"/></g></g>
  ${rocher(320, 300, 1.1, '#8b8fb0', true)}${rocher(590, 302, 1, '#8b8fb0', true)}${rocher(250, 276, 0.7)}${rocher(650, 274, 0.7)}
  ${rocher(-80, 260, 1.8, '#5e63a8', true)}${rocher(990, 270, 1.8, '#5e63a8', true)}${sapinCouleur(30, 280, 1.4, '#1f4a3a')}${sapinCouleur(880, 300, 1.4, '#1f4a3a')}
  <!-- La mer de nuages, tout en bas -->
  <g fill="#e0e7ff" opacity="0.9">${Array.from({ length: 30 }, (_, i) => `<circle cx="${-1200 + i * 120}" cy="${500 + (i % 3) * 14}" r="${50 + (i % 4) * 10}"/>`).join('')}<rect x="-3000" y="520" width="6900" height="3500"/></g>
  <g fill="#ffffff">${Array.from({ length: 24 }, (_, i) => `<circle cx="${-1100 + i * 150}" cy="${540 + (i % 2) * 16}" r="${44 + (i % 3) * 8}"/>`).join('')}<rect x="-3000" y="560" width="6900" height="3500"/></g>`,
};

function svgDecorLieu(id, cheminD) {
  const dessin = DECORS_LIEUX[id] || DECORS_LIEUX.maison;
  return `<svg viewBox="0 0 900 520" class="paysage-carte" aria-hidden="true">${dessin(cheminD)}</svg>`;
}
