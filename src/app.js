const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

app.get('/', function (req, res) { // root
    res.json('Hello World')
});

app.get('/user', function (req, res) { // index
    res.json(`get user`);
});

app.post('/user', function (req, res) { // create
    res.json({ body: req.body });
});

app.put('/user/:id', function (req, res) { // edit
    let id = req.params.id;
    res.json({ id });
});

app.delete('/user', function (req, res) { // delete
    res.json(`delete user`);
});

app.listen(process.env.PORT, () => {
    console.log(`Listening for port: ${process.env.PORT}, Mode: ${process.env.NODE_ENV}`);
});