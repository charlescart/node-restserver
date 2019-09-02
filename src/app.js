const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // devuelve puro application/json
app.use(require('./concepts/user/UserController'));
app.use(require('./concepts/home/HomeController'));

mongoose.connect(`mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`, { useNewUrlParser: true, useCreateIndex: true })
    .catch((err) => {
        throw err;
    });

app.listen(process.env.PORT, () => {
    console.log(`Listening for port: ${process.env.PORT}, Mode: ${process.env.NODE_ENV}`);
});