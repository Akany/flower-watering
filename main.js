const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

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