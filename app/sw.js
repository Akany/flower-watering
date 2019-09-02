workbox
    .precaching
    .precacheAndRoute(self.__precacheManifest || []);

self.addEventListener('push', (event) => {
    sendNotification();
});

function sendNotification() {
    var title = 'Hey, Bro!';
    var body = 'Time to take care about flowers!';

    if (Notification.permission !== 'granted') {
        return;
    }

    self
        .registration
        .showNotification(title, {
            body: body
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
