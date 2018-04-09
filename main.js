const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3010;

let wateringDate = new Date();

app.use(bodyParser.json());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

app.get('/api/watering', (req, res) => res.send(wateringDate.toISOString()));
app.put('/api/watering', (req, res) => {
    wateringDate = new Date(req.body.date);
    res.send(wateringDate);
});

app.use(express.static('dist'));

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));