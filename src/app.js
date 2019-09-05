const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // devuelve puro application/json
app.use(require('./concepts/user/UserController'));
app.use(require('./concepts/home/HomeController'));

const connections = {
    'development': `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
    'test': ``,
    'production': `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`,
    // `mongodb+srv://cafe:Ch4rl3scart$@cafe-635gq.mongodb.net/cafe`
};
mongoose.connect(connections[process.env.NODE_ENV], { useNewUrlParser: true, useCreateIndex: true })
    .catch((err) => {
        throw err;
    });

app.listen(process.env.PORT, () => {
    console.log(`Listening for port: ${process.env.PORT}, Mode: ${process.env.NODE_ENV}`);
});