const CACHE_NAME = 'sat-prep-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/mobile-index.html',
  '/styles/main.css',
  '/scripts/main.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/fallback.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request)
          .catch(() => {
            // Return offline page if fetch fails
            return caches.match('/fallback.html');
          });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});