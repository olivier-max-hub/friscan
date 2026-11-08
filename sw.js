/* Friscan — service worker : l'appli fonctionne hors ligne (sauf la recherche produit) */
const V = 'friscan-v3';
const SHELL = ['./', 'index.html', 'data.js', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.hostname.endsWith('openfoodfacts.org')) return; // toujours en ligne
  if (u.origin === location.origin) {
    // réseau d'abord pour avoir les mises à jour, cache si hors ligne
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true })));
  } else if (/fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr\.net/.test(u.hostname)) {
    e.respondWith(caches.match(e.request).then(m => m || fetch(e.request).then(r => { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); return r; })));
  }
});
