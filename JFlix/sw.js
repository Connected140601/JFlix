const CACHE_NAME = 'jflix-cache-v4'; // A stable version
const urlsToCache = [
  // Do NOT cache the root '/' to avoid caching the redirect
  '/index.html',
  '/css/common.css',
  '/js/navbar.js',
  '/images/logo.svg',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
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

self.addEventListener('fetch', event => {
  event.respondWith(
    (async () => {
      const url = new URL(event.request.url);
      
      // If the request is for the root path, serve index.html from the cache.
      if (event.request.mode === 'navigate' && url.pathname === '/') {
        const cachedResponse = await caches.match('/index.html');
        if (cachedResponse) {
          return cachedResponse;
        }
      }

      // For all other requests, try cache first, then network.
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Fallback to network
      return fetch(event.request);
    })()
  );
});
