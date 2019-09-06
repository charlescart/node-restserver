const express = require('express');
const app = express();

app.use(require('./home/HomeController'));
app.use(require('./user/UserController'));

module.exports = app;