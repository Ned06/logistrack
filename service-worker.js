const CACHE_NAME = "stock-pwa-v1";

// On ajoute les CDNs pour que l'interface reste belle même sans réseau
const ASSETS_TO_CACHE = [
  "index.html",
  "manifest.json",
  "https://cdn.tailwindcss.com",
  "https://unpkg.com/lucide@latest",
  "https://cdn.jsdelivr.net/npm/chart.js"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Mise en cache des ressources...");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Stratégie : Cache d'abord, puis Réseau (très rapide pour les PWA)
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request).then(fetchRes => {
        // Optionnel : on pourrait mettre en cache les nouvelles requêtes ici
        return fetchRes;
      });
    })
  );
});

// Nettoyage des anciens caches (si tu passes en v2 plus tard)
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});