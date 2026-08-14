const CACHE_NAME = 'compass-v9';
const urlsToCache = ['./', './index.html', './manifest.json'];

// 1. Установка и мгновенное добавление новых файлов
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Принудительно активируем новый скрипт
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// 2. Очистка СТАРОГО кэша (v1, v2 и т.д.) при запуске
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Удаляем старый кэш:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Захватываем контроль над страницей
  );
});

// 3. Отдача файлов из нового кэша
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
