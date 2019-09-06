const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // devuelve puro application/json

app.use(require('./home/home.controller'));
app.use(require('./user/user.controller'));

module.exports = app;