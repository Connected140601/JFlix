const CACHE_NAME = 'jflix-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/logo.svg',
  '/images/logo/logo-192x192.png',
  '/images/logo/logo-512x512.png',
  '/css/account.css',
  '/css/auth.css',
  '/css/card-fix.css',
  '/css/common.css',
  '/css/details.css',
  '/css/donation-modal.css',
  '/css/home.css',
  '/css/homepage.css',
  '/css/install-modal.css',
  '/css/legal.css',
  '/css/loading.css',
  '/css/movie-categories.css',
  '/css/original-style.css',
  '/css/player.css',
  '/css/popup-trailer.css',
  '/css/premium-banner.css',
  '/css/responsive.css',
  '/css/search-results.css',
  '/js/anime.js',
  '/js/auth.js',
  '/js/cartoon.js',
  '/js/common.js',
  '/js/details.js',
  '/js/home.js',
  '/js/homepage.js',
  '/js/install-modal.js',
  '/js/korean.js',
  '/js/movies.js',
  '/js/navbar.js',
  '/js/player.js',
  '/js/premium-banner.js',
  '/js/tvshows.js'
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

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
