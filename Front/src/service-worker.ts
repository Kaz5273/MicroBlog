import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { Queue } from 'workbox-background-sync';

declare const self: ServiceWorkerGlobalScope;

// Précache des ressources statiques
precacheAndRoute(self.__WB_MANIFEST);

// File d'attente pour les posts en attente de synchronisation
const postQueue = new Queue('postQueue');

// Cache pour les requêtes API
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/posts'),
  new NetworkFirst({
    cacheName: 'api-posts',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50, // Nombre maximum d'entrées dans le cache
        maxAgeSeconds: 24 * 60 * 60 // 24 heures
      })
    ]
  })
);

// Gestion des requêtes POST pour les nouveaux posts
registerRoute(
  ({ url, request }) => url.pathname === '/api/posts' && request.method === 'POST',
  new NetworkFirst({
    cacheName: 'post-requests',
    plugins: [
      new BackgroundSyncPlugin('post-queue', {
        maxRetentionTime: 24 * 60 // Retenir pendant 24 heures
      })
    ]
  })
);

// Cache pour les images et autres ressources statiques
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 jours
      })
    ]
  })
);

// Cache pour les ressources JavaScript et CSS
registerRoute(
  ({ request }) => 
    request.destination === 'script' || 
    request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-resources'
  })
);