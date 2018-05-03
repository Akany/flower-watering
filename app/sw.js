const cacheName = `assets-cache-${SW_VERSION}`;
/*
    @TODO
    Use webpack generated assets
*/
const cacheAssets = [
    '/',
    '/app.bundle.js'
];

self.addEventListener('install', (event) => {
    const cache = caches
        .open(cacheName)
        .then((cache) => cache.addAll(cacheAssets));

    event.waitUntil(cache);
});

self.addEventListener('activate', (event) => {
    const clean$ = caches
        .keys()
        .then((keys) => {
            const clean$ = keys
                .filter((key) => key !== cacheName)
                .map((key) => caches.delete(key));

            return Promise.all(clean$);
        });

    event.waitUntil(clean$);
});

self.addEventListener('fetch', (event) => {
    const cache = caches
        .match(event.request)
        .then((response) => response || fetch(event.request));

    event.respondWith(cache);
});

self.addEventListener('activate', () => {
    startWatcher();
});

function startWatcher() {
    const interval = 1000 * 60 * 60 * 2;
    const days = 2;

    checkDate(days);
    setInterval(() => checkDate(days), interval);
    
}

function checkDate(days) {
    return fetch('/api/watering')
        .then(response => response.json())
        .then(dates => dates[dates.length - 1])
        .then(ISODate => {
            if (!ISODate) {
                return;
            }

            if (new Date() - new Date(ISODate) > 1000 * 60 * 60 * 24 * days) {
                sendNotification(ISODate);
            }
        })
        .catch(() => {
            console.log('Failed to fetch watering status');
        });
}

function sendNotification() {
    var title = 'Hey, Bro!';
    var body = 'Time to take care about flowers!';
    var tag = 'watering';

    if (Notification.permission !== 'granted') {
        return;
    }

    self
        .registration
        .showNotification(title, {
            body: body,
            tag: tag
        });
}

self.addEventListener('notificationclick', (event) => {  
    event.notification.close();

    event.waitUntil(
        clients
            .matchAll({type: 'window'})
            .then((clientList) => {
                const client = clientList
                    .filter(client => client.visibilityState === 'visible')[0];

                if (client && client.focused) {
                    return;
                }

                if (client && !client.focused) {
                    return client.focus();
                }

                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
    );
});
