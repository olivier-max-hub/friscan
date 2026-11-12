/* Friscan — service worker : l'appli fonctionne hors ligne (sauf la recherche produit) */
const V = 'friscan-v19';
const SHELL = ['./', 'index.html', 'data.js?v=9', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V && k !== 'friscan-rappels').map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || /openfoodfacts\.org|google\.com|googleusercontent\.com/.test(u.hostname)) return; // toujours en ligne
  if (u.origin === location.origin) {
    // réseau d'abord pour avoir les mises à jour, cache si hors ligne
    // cache: 'no-cache' = toujours vérifier auprès du serveur s'il y a une nouvelle version
    e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(r => { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true })));
  } else if (/fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr\.net/.test(u.hostname)) {
    e.respondWith(caches.match(e.request).then(m => m || fetch(e.request).then(r => { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); return r; })));
  }
});

/* Rappels de péremption : vérification quotidienne (Android, appli installée) */
self.addEventListener('periodicsync', e => { if (e.tag === 'friscan-dlc') e.waitUntil(checkDlc()); });
async function checkDlc() {
  const c = await caches.open('friscan-rappels');
  const r = await c.match('dlc.json'); if (!r) return;
  const list = await r.json();
  const t = new Date(); t.setHours(0, 0, 0, 0);
  const day = t.toISOString().slice(0, 10);
  const last = await c.match('notified'); if (last && (await last.text()) === day) return;
  const due = list.map(x => { const [y, m, d] = x.d.split('-').map(Number); return { n: x.n, j: Math.round((new Date(y, m - 1, d) - t) / 864e5) }; })
    .filter(x => x.j >= 0 && x.j <= 1).sort((a, b) => a.j - b.j);
  if (!due.length) return;
  await c.put('notified', new Response(day));
  await self.registration.showNotification('⏰ À consommer vite', {
    body: due.slice(0, 4).map(x => `${x.n} (${x.j === 0 ? 'aujourd’hui' : 'demain'})`).join(' · ') + (due.length > 4 ? ` · +${due.length - 4}` : ''),
    icon: 'icon-192.png', badge: 'icon-192.png', tag: 'friscan-dlc', data: { url: './#recettes' }
  });
}
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => {
    const w = ws.find(x => x.url.startsWith(self.registration.scope));
    return w ? w.navigate(url).then(x => (x || w).focus()) : clients.openWindow(url);
  }));
});
