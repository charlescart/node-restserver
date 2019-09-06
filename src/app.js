const express = require('express');
const mongoose = require('mongoose');
const connections = {
    'development': `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
    'test': ``,
    'production': `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`,
    // `mongodb+srv://<user>:<password>@cafe-635gq.mongodb.net/cafe`
};

const app = express();

app.use('/api', require('./concepts'));

mongoose.connect(connections[process.env.NODE_ENV], { useNewUrlParser: true, useCreateIndex: true })
    .catch((err) => {
        throw err;
    });

app.listen(process.env.PORT, () => {
    console.log(`Listening for port: ${process.env.PORT}, Mode: ${process.env.NODE_ENV}`);
});