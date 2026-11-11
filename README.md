# Friscan

Scanne les codes-barres de ton frigo, Friscan te propose des recettes simples et rapides (≤ 25 min).

## Mettre en ligne (GitHub Pages, comme « Mes recettes »)
1. Crée un dépôt `friscan` sur GitHub et dépose tous les fichiers de ce dossier à la racine.
2. Settings → Pages → Branch `main` / dossier `/ (root)` → Save.
3. Ouvre `https://<ton-compte>.github.io/friscan/` sur ton téléphone, puis « Ajouter à l'écran d'accueil ».

La caméra exige le HTTPS : GitHub Pages le fournit.

## Fichiers
- `index.html` : l'appli (Réserves, Scanner, Recettes)
- `data.js` : ~150 ingrédients reconnus + 67 recettes — c'est là qu'on ajoute des recettes
- `sw.js`, `manifest.webmanifest`, icônes : installation et mode hors ligne

## Mes recettes
Friscan lit la liste (Google Sheets publié en CSV) et les fiches (script Apps Script) de « Mes recettes ».
Les adresses sont dans `data.js` (`MES_RECETTES`). Les recettes sont rechargées toutes les 6 h et gardées pour le hors-ligne.
Chaque carte ouvre la fiche dans « Mes recettes ».

## Dates de péremption
Facultatives : au scan, ou en touchant un produit dans le frigo. Les produits à 3 jours ou moins apparaissent dans « À consommer vite »
et le filtre « ⏰ Anti-gaspi » propose les recettes qui les utilisent.

Rappels (version 10) :
- « Activer les rappels » : notification la veille et le jour même. Sur Android avec l'appli installée, la vérification se fait chaque jour même appli fermée ; ailleurs, à l'ouverture de l'appli.
- « 📅 Rappel dans mon agenda » : fichier .ics avec une alarme la veille à 9 h (iPhone, Android, ordinateur).

## Liste de courses Cookapli
Dans « Recettes », le bouton « 🛒 Ajouter … à ma liste » envoie les ingrédients manquants dans la liste de courses de Cookapli
(`../cookapli/courses.html`, même site, même stockage local).

## Fonctionnement
- Scan : `BarcodeDetector` natif (Android/Chrome), sinon ZXing chargé à la demande (iPhone).
- Fiche produit : API Open Food Facts (gratuite, sans clé).
- Le produit est rattaché à un ingrédient (mots-clés du nom puis catégories OFF) ; sinon l'utilisateur choisit.
- Les données restent sur le téléphone (localStorage).
