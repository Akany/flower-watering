const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;
const mongo_url = 'mongodb://akany:akany5@ds241489.mlab.com:41489/heroku_kjjq8qp9';
const mongo_name = 'heroku_kjjq8qp9';

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
            db
                .collection('watering')
                .find()
                .toArray((error, response) => res.send(response.map((item) => item.date)));
        });
        app.put('/api/watering', (req, res) => {
            db
                .collection('watering')
                .insert({date: req.body.date})
                .then(() => res.send());
        });

        app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
    });