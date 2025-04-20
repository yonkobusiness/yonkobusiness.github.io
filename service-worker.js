// service-worker.js
const CACHE_NAME = 'yonko-business-v5';
const urlsToCache = [
  '/',
  '/index.html',
  '/404.html',
  '/403.html',
  '/500.html',
  '/502.html',
  '/cart.html',
  '/about.html',
  '/catalog.html',
  '/product.html',
  '/pwa-install-banner.js',
  '/cart.js',
  '/loadingscreen.js',
  
  // Add your CSS, JS and main assets here
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened successfully');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate Service Worker and clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control immediately without reload
  return self.clients.claim();
});

// Fetch strategy: Cache-first, then network with cache update
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if found
        if (response) {
          return response;
        }

        // Clone the request - request streams can only be used once
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then((response) => {
            // Check for valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response - response streams can only be used once
            const responseToCache = response.clone();

            // Add the new response to cache
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
                console.log('Resource cached:', event.request.url);
              });

            return response;
          })
          .catch(() => {
            // If fetch fails (offline), try to return the cached 404.html
            if (event.request.mode === 'navigate') {
              return caches.match('/yonkobusiness.github.io/404.html');
            }
            // For non-navigation requests, just return whatever we have
            return response;
          });
      })
  );
});

// Optional: Add background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-form-data') {
    event.waitUntil(syncFormData());
  }
});

// Helper function for background sync
function syncFormData() {
  // Implementation for syncing data when back online
  return new Promise((resolve) => {
    // Retrieve saved form data from IndexedDB and send
    console.log('Syncing form data with server');
    resolve();
  });
}
