const CACHE_NAME = 'daybook-v1';
const ASSETS = [
  './index.html',
  './script.js',
  './icon-192.png'
];

// Install the Service Worker and cache the files
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

// Serve files from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
