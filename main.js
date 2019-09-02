const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

const webPush = require('web-push');

const MongoClient = require('mongodb').MongoClient;
const mongo_url = 'mongodb://akany:akany@ds014578.mlab.com:14578/flower-watering-test';
const mongo_name = 'flower-watering-test';

const PORT = process.env.PORT || 3010;
const MONGODB_URI = process.env.MONGODB_URI || mongo_url;
const MONGODB_NAME = process.env.MONGODB_NAME || mongo_name;

app.use(bodyParser.json());
app.use(bodyParser.json());

app.use(express.static('dist'));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

const keys = {
    publicKey: 'BMNLFF2Y6VihwtMLYNMQZbNgnQAoGg01TV3QLYcYtfrwyib0A4jAyU_Vb0KV8hgsKaUmHIV_MoT8vUgQ9AB0j5U',
    privateKey: 'eiaC4LqAX1_wWxCMqYIaaDWjjv8IJJlDex-_ls1MV0Q'
};

webPush.setVapidDetails(
    'http://localhost',
    keys.publicKey,
    keys.privateKey
);

let subscriptions = [];

app.get('/push/vapidPublicKey', (req, res) => {
    res.send(keys.publicKey);
});

app.post('/push/register', (req, res) => {
    subscriptions.push(req.body.subscription);
    res.send(201);
});

MongoClient
    .connect(MONGODB_URI, (err, client) => {
        const db = client
            .db(MONGODB_NAME);

        app.get('/api/watering', (req, res) => {
            getDates()
                .then(dates => res.send(dates));
        });
        app.put('/api/watering', (req, res) => {
            putDate(req.body.date)
                .then(getDates)
                .then(dates => res.send(dates));
        });

        app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

        setInterval(() => {
            getDates()
                .then((dates) => {
                    const [date] = dates;
                    const threshold = 1000 * 60 * 60 * 24 * 2;

                    if (new Date() - new Date(date).valueOf() > threshold) {
                        sendNotification(date);
                    }
                });
        }, 1000 * 60 * 60 * 4);

        function sendNotification(lastDate) {
            subscriptions
                .forEach((subscription) => {
                    webPush
                        .sendNotification(subscription, JSON.stringify(lastDate));
                });
        }

        function getDates() {
            return new Promise((resolve, reject) => {
                db
                .collection('watering')
                .find()
                .toArray((error, response) => {
                    resolve(response
                        .map((item) => item.date)
                        .reverse()
                    );
                });
            });
        }

        function putDate(date) {
            return db
                .collection('watering')
                .insert({date});
        }
    });