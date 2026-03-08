const CACHE_NAME = 'panic-button-v2';
const STATIC_ASSETS = ['/', '/index.html', '/static/js/main.chunk.js', '/static/css/main.chunk.css'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('newsapi.org') || e.request.url.includes('ipapi.co')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/index.html'))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      return res;
    }))
  );
});

// Push notification handler
self.addEventListener('push', (e) => {
  const data = e.data?.json() || { title: 'PANIC BUTTON', body: 'Breaking news detected!' };
  e.waitUntil(self.registration.showNotification(data.title, {
    body: data.body, icon: '/favicon.ico', badge: '/favicon.ico',
    tag: 'breaking-news', renotify: true,
    data: { url: data.url || '/' }
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data?.url || '/'));
});
