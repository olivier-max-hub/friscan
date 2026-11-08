# Friscan

Scanne les codes-barres de ton frigo, Friscan te propose des recettes simples et rapides (≤ 25 min).

## Mettre en ligne (GitHub Pages, comme « Mes recettes »)
1. Crée un dépôt `friscan` sur GitHub et dépose tous les fichiers de ce dossier à la racine.
2. Settings → Pages → Branch `main` / dossier `/ (root)` → Save.
3. Ouvre `https://<ton-compte>.github.io/friscan/` sur ton téléphone, puis « Ajouter à l'écran d'accueil ».

La caméra exige le HTTPS : GitHub Pages le fournit.

## Fichiers
- `index.html` : l'appli (Frigo, Scanner, Recettes)
- `data.js` : ~150 ingrédients reconnus + 67 recettes — c'est là qu'on ajoute des recettes
- `sw.js`, `manifest.webmanifest`, icônes : installation et mode hors ligne

## Fonctionnement
- Scan : `BarcodeDetector` natif (Android/Chrome), sinon ZXing chargé à la demande (iPhone).
- Fiche produit : API Open Food Facts (gratuite, sans clé).
- Le produit est rattaché à un ingrédient (mots-clés du nom puis catégories OFF) ; sinon l'utilisateur choisit.
- Les données restent sur le téléphone (localStorage).
