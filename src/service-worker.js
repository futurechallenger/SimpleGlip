const cacheStorageKey = 'simple-glip-pwa';

const cacheList = [
  '/',
  'index.html',
  'index.js',
  'assets/images/favicon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(cacheStorageKey)
    .then(cache => cache.addAll(cacheList))
    .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(cacheNames => Promise.all(cacheNames.map((name) => {
      if (name !== cacheStorageKey) {
        return caches.delete(name);
      }
    })))
  );
  return self.clients.claim();
});
