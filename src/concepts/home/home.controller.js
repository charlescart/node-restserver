const express = require('express');

const app = express();


app.get('/', function (req, res) {
    res.json({ msg: `Api Runing...`, success: true });
});

module.exports = app;