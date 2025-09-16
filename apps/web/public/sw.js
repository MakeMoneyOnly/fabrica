// Service Worker for fabrica Store
// Handles caching, offline functionality, and background sync

const CACHE_NAME = 'fabrica-store-v1';
const STATIC_CACHE_NAME = 'fabrica-static-v1';
const DYNAMIC_CACHE_NAME = 'fabrica-dynamic-v1';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/apple-touch-icon.png',
  '/favicon.ico'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  '/api/products',
  '/api/categories'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - handle requests with cache strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) return;

  // Handle API requests with network-first strategy
  if (API_CACHE_PATTERNS.some(pattern => url.pathname.startsWith(pattern))) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Handle static assets and pages with cache-first strategy
  if (request.destination === 'document' ||
      request.destination === 'style' ||
      request.destination === 'script' ||
      request.destination === 'image' ||
      request.destination === 'font') {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // Default network-first for other requests
  event.respondWith(networkFirstStrategy(request));
});

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Cache-first strategy failed:', error);
    // Return offline fallback for critical pages
    if (request.destination === 'document') {
      return caches.match('/offline.html') || new Response('Offline', { status: 503 });
    }
    throw error;
  }
}

// Network-first strategy for dynamic content
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network-first strategy failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);

  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

// Background sync handler
async function handleBackgroundSync() {
  try {
    // Process any queued offline actions
    const cache = await caches.open('offline-queue');
    const keys = await cache.keys();

    for (const request of keys) {
      try {
        await fetch(request);
        await cache.delete(request);
      } catch (error) {
        console.log('Failed to sync request:', error);
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received', event);

  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/apple-touch-icon.png',
      badge: '/apple-touch-icon.png',
      data: data.data || {}
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'fabrica Store', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event);

  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
