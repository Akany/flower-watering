import { h, app } from 'hyperapp';

import axios from 'axios';

import '../node_modules/bulma/css/bulma.css';

import AppTitle from './components/app-title';
import AppContent from './components/app-content';

const state = {
    wateringDates: [],
    wateringDate: null,
    wateringStatus: 'ok',
    loading: false,
    hiddenListVisible: false
};

const actions = {
    putStatus,
    fetchStatus,
    onFetchStatus,
    showHiddenList
};

const view = (state, actions) =>
    h('section', {class: 'section'}, [
        h('div', {class: 'container'}, [
            AppTitle,
            AppContent
        ])
    ]);

const main = app(state, actions, view, document.body);

main.fetchStatus();

if ('serviceWorker' in navigator) {
    window
        .addEventListener('load', () => {
            navigator
                .serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }, (err) => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });

    navigator
        .serviceWorker
        .ready
        .then((registration) => {
            return registration
                .pushManager
                .getSubscription()
                .then((subscription) => {
                    if (subscription) {
                        return subscription;
                    }

                    return fetch('/push/vapidPublicKey')
                        .then((response) => response.text())
                        .then((vapidPublicKey) => urlBase64ToUint8Array(vapidPublicKey))
                        .then((vapidPublicKey) => {
                            return registration
                                .pushManager
                                .subscribe({
                                    userVisibleOnly: true,
                                    applicationServerKey: vapidPublicKey
                                });
                        })
                        .then((subscription) => {
                            fetch('/push/register', {
                                method: 'post',
                                headers: {
                                  'Content-type': 'application/json'
                                },
                                body: JSON.stringify({
                                  subscription: subscription
                                })
                            });
                        });
                });
        });
}

if ('Notification' in window) {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
}

function putStatus() {
    return (state, actions) => {
        axios.put('/api/watering', {date: new Date().toISOString()})
            .then((response) => actions.onFetchStatus(response.data));

        return {loading: true};
    }
}

function fetchStatus() {
    return (state, actions) => {
        axios.get('/api/watering')
            .then(response => {
                return actions.onFetchStatus(response.data)
            });

        return {loading: true};
    };
}

function onFetchStatus(dates) {
    return (state) => {
        const lastWateringDate = dates[0];

        return {
            wateringDates: [...dates],
            wateringDate: lastWateringDate,
            wateringStatus: toWateringStatus(lastWateringDate),
            loading: false
        };
    };

    function toWateringStatus(date) {
        const day = 1000 * 60 * 60 * 24;
        const timeDiff = (new Date() - new Date(date));

        if (timeDiff < day) {
            return 'ok';
        }

        if (timeDiff < day * 2) {
            return 'warning';
        }

        return 'danger';
    }
}

function showHiddenList() {
    return (state) => {
        return {hiddenListVisible: true};
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);

    return Uint8Array
        .from([...rawData]
        .map((char) => char.charCodeAt(0)));
}
