const CACHE_NAME = 'rentvora-pwa-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/images/rentvora-logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Never cache auth, api, or dashboard routes in service worker
  if (url.pathname.startsWith('/auth') || url.pathname.startsWith('/api') || url.pathname.startsWith('/customer') || url.pathname.startsWith('/owner') || url.pathname.startsWith('/admin')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
