// --- CACHE CONFIGURATION ---
const CACHE_NAME = 'vipandroid-cache-v3';
const urlsToCache = [
  '/',                 // index.html
  '/index.html',
  '/vendidos.html',
  '/js/vendidos.js',
  '/js/home.js',
  '/css/style.css',
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/imagens/logo.png'
];

// --- INSTALL ---
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// --- ACTIVATE ---
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      )
    )
  );
  self.clients.claim();
});

// --- FETCH: CACHE COM NETWORK UPDATE (corrigido e otimizado) ---
self.addEventListener('fetch', event => {
  // Ignora requisições que não sejam GET (ex: POST para Firebase)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Busca na rede em segundo plano
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          // Só armazena se a resposta for válida e do mesmo domínio
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse.clone();
        })
        .catch(() => cachedResponse); // Se offline, usa cache
      // Retorna primeiro o cache (mais rápido)
      return cachedResponse || fetchPromise;
    })
  );
});

// --- FIREBASE MESSAGING ---
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBfQdAX3P6VU7GWMIK5pLq7IYRuTimDvvo",
  authDomain: "vip-android-746dd.firebaseapp.com",
  projectId: "vip-android-746dd",
  storageBucket: "vip-android-746dd.appspot.com",
  messagingSenderId: "1095417596528",
  appId: "1:1095417596528:web:5a8a835451989808918265"
});

const messaging = firebase.messaging();

// --- Notificações em segundo plano ---
messaging.onBackgroundMessage(payload => {
  const title = payload.notification?.title || "Notificação";
  const options = {
    body: payload.notification?.body || "Você tem uma nova mensagem!",
    icon: '/icons/icon-192.png'
  };
  self.registration.showNotification(title, options);
});

// --- Push direto do backend ---
self.addEventListener('push', event => {
  const data = event.data?.json() || {};
  const title = data.title || 'Nova Venda Confirmada!';
  const options = {
    body: data.body || 'Uma nova venda foi concluída!',
    icon: '/icons/icon-192.png',
    data: { url: data.url || '/vendidos.html' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// --- Ao clicar na notificação ---
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const destino = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(destino) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(destino);
    })
  );
});
