"""Enregistre toutes les consignes d'Algocadabra avec Piper (voix française gratuite, hors ligne).

Une fois pour toutes :
    python -m pip install -r outils/voix/requirements.txt

Puis, à chaque fois qu'une phrase du site change :
    python outils/voix/generer-voix.py

Le script :
  1. demande à Node la liste de toutes les phrases (outils/voix/lister-phrases.js) ;
  2. télécharge la voix Piper la première fois (environ 60 Mo, rangée dans outils/voix/modeles/) ;
  3. enregistre chaque phrase en MP3 dans voix/fichiers/<clé>.mp3, sans refaire celles qui existent déjà ;
  4. supprime les fichiers des phrases qui n'existent plus et écrit voix/catalogue.json.

Le site joue ces fichiers quand ils existent, et garde la voix du navigateur pour le reste.
"""

import argparse
import datetime
import io
import json
import pathlib
import subprocess
import sys
import urllib.request
import wave

RACINE = pathlib.Path(__file__).resolve().parents[2]
MODELES = RACINE / 'outils' / 'voix' / 'modeles'
SORTIE = RACINE / 'voix'
FICHIERS = SORTIE / 'fichiers'
CATALOGUE = SORTIE / 'catalogue.json'

VOIX_PAR_DEFAUT = 'fr_FR-siwis-medium'
# Les voix Piper sont publiées sur Hugging Face : fr/fr_FR/<nom>/<qualité>/<voix>.onnx
URL_VOIX = 'https://huggingface.co/rhasspy/piper-voices/resolve/main/{langue}/{locale}/{nom}/{qualite}/{voix}{extension}'


def lister_phrases():
    resultat = subprocess.run(
        ['node', str(RACINE / 'outils' / 'voix' / 'lister-phrases.js'), '--json'],
        capture_output=True, encoding='utf-8', check=False,
    )
    if resultat.returncode != 0:
        sys.exit('Impossible de lister les phrases :\n' + resultat.stderr)
    return json.loads(resultat.stdout)


def telecharger_voix(voix):
    """Télécharge le modèle de la voix (.onnx et .onnx.json) s'il n'est pas déjà là."""
    locale, nom, qualite = voix.split('-')
    MODELES.mkdir(parents=True, exist_ok=True)
    chemins = []
    for extension in ('.onnx', '.onnx.json'):
        chemin = MODELES / (voix + extension)
        chemins.append(chemin)
        if chemin.exists():
            continue
        url = URL_VOIX.format(langue=locale.split('_')[0], locale=locale, nom=nom,
                              qualite=qualite, voix=voix, extension=extension)
        print(f'Téléchargement de {chemin.name}…')
        temporaire = chemin.with_suffix(chemin.suffix + '.partiel')
        urllib.request.urlretrieve(url, temporaire)
        temporaire.rename(chemin)
    return chemins[0]


def charger_piper(modele):
    try:
        from piper import PiperVoice
    except ImportError:
        sys.exit('Piper n\'est pas installé : python -m pip install -r outils/voix/requirements.txt')
    return PiperVoice.load(str(modele))


def synthetiser(voix, texte, lenteur):
    """Renvoie (échantillons 16 bits mono, fréquence) ; marche avec les anciennes et nouvelles versions de Piper."""
    try:
        from piper import SynthesisConfig  # piper-tts 1.3 et plus
    except ImportError:
        SynthesisConfig = None
    if SynthesisConfig is not None:
        morceaux = list(voix.synthesize(texte, syn_config=SynthesisConfig(length_scale=lenteur)))
        return b''.join(m.audio_int16_bytes for m in morceaux), morceaux[0].sample_rate
    tampon = io.BytesIO()
    with wave.open(tampon, 'wb') as w:
        voix.synthesize(texte, w, length_scale=lenteur)  # piper-tts 1.2
    tampon.seek(0)
    with wave.open(tampon, 'rb') as w:
        return w.readframes(w.getnframes()), w.getframerate()


def en_mp3(echantillons, frequence):
    try:
        import lameenc
    except ImportError:
        sys.exit('L\'encodeur MP3 n\'est pas installé : python -m pip install -r outils/voix/requirements.txt')
    # Un court silence au début : certains appareils mangent le tout début du son.
    silence = b'\x00\x00' * int(frequence * 0.05)
    encodeur = lameenc.Encoder()
    encodeur.set_bit_rate(48)
    encodeur.set_in_sample_rate(frequence)
    encodeur.set_channels(1)
    encodeur.set_quality(2)
    return encodeur.encode(silence + echantillons) + encodeur.flush()


def main():
    # La console Windows n'est pas toujours en UTF-8 : sans ça, les accents peuvent faire planter l'affichage.
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    parametres = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parametres.add_argument('--voix', default=VOIX_PAR_DEFAUT,
                            help=f'voix Piper, par exemple fr_FR-siwis-medium ou fr_FR-upmc-medium (défaut : {VOIX_PAR_DEFAUT})')
    parametres.add_argument('--lenteur', type=float, default=1.1,
                            help='plus grand = plus lent (défaut : 1.1, un peu plus lent pour les enfants)')
    parametres.add_argument('--tout', action='store_true', help='tout réenregistrer, même les phrases déjà faites')
    args = parametres.parse_args()

    phrases = lister_phrases()
    print(f'{len(phrases)} phrases à avoir.')

    ancien = json.loads(CATALOGUE.read_text(encoding='utf-8')) if CATALOGUE.exists() else {}
    # Si la voix ou la vitesse change, tout est à refaire.
    meme_voix = ancien.get('voix') == args.voix and ancien.get('lenteur') == args.lenteur
    FICHIERS.mkdir(parents=True, exist_ok=True)
    a_faire = [p for p in phrases
               if args.tout or not meme_voix or not (FICHIERS / (p['cle'] + '.mp3')).exists()]

    if a_faire:
        voix = charger_piper(telecharger_voix(args.voix))
        for i, p in enumerate(a_faire, 1):
            echantillons, frequence = synthetiser(voix, p['texte'], args.lenteur)
            (FICHIERS / (p['cle'] + '.mp3')).write_bytes(en_mp3(echantillons, frequence))
            print(f'[{i}/{len(a_faire)}] {p["texte"]}')
    else:
        print('Toutes les phrases sont déjà enregistrées.')

    # Les phrases qui n'existent plus sur le site : on retire leurs fichiers.
    cles = {p['cle'] for p in phrases}
    for fichier in FICHIERS.glob('*.mp3'):
        if fichier.stem not in cles:
            fichier.unlink()
            print(f'Supprimé (phrase disparue) : {fichier.name}')

    CATALOGUE.write_text(json.dumps({
        'voix': args.voix,
        'lenteur': args.lenteur,
        'version': datetime.datetime.now().strftime('%Y%m%d%H%M%S'),
        'phrases': {p['cle']: p['texte'] for p in phrases},
    }, ensure_ascii=False, indent=1), encoding='utf-8')
    taille = sum(f.stat().st_size for f in FICHIERS.glob('*.mp3'))
    print(f'Terminé : {len(cles)} fichiers, {taille / 1e6:.1f} Mo. Catalogue : {CATALOGUE.relative_to(RACINE)}')


if __name__ == '__main__':
    main()
