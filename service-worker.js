// --- CACHE CONFIGURATION ---
const CACHE_NAME = 'vipandroid-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/home.html',
  '/vendidos.html',
  '/js/vendidos.js',
  '/css/style.css',
  '/js/home.js',
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/imagens/logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // Garante que a nova versão seja ativada imediatamente
});

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
  self.clients.claim(); // Garante controle imediato
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});

// --- FIREBASE MESSAGING CONFIGURATION ---
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

// 🔔 Notificações recebidas em segundo plano (ex: com app fechado)
messaging.onBackgroundMessage(payload => {
  const title = payload.notification?.title || "Notificação";
  const options = {
    body: payload.notification?.body || "Você tem uma nova mensagem!",
    icon: '/icons/icon-192.png'
  };
  self.registration.showNotification(title, options);
});

// 🔔 Notificações via push direto do backend
self.addEventListener('push', event => {
  const data = event.data?.json() || {};
  const title = data.title || 'Nova Venda Confirmada!';
  const options = {
    body: data.body || 'Uma nova venda foi concluída!',
    icon: '/icons/icon-192.png',
    data: {
      url: data.url || '/vendidos.html'
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// ✅ Ao clicar na notificação → abre ou foca o app
self.addEventListener('notificationclick', function(event) {
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
