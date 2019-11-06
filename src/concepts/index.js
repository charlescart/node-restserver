const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // devuelve puro application/json

app.use(require('./home/home.controller'));
app.use(require('./user/user.controller'));
app.use(require('./auth/auth.controller'));
app.use(require('./category/category.controller'));
app.use(require('./product/product.controller'));
app.use(require('./upload/upload.controller'));

module.exports = app;