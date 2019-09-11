const express = require('express');
const User = require('../../entities/User');
const _ = require('underscore');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();


app.post('/login', async (req, res) => {
    let body = _.pick(req.body, 'email', 'password');

    let user = await User.findOne({ email: body.email }).catch((err) => {
        return res.status(500).json({ err, success: false, msg: -1 }); // Error de server
    });

    if (!user)
        return res.status(400).json({ success: false, msg: -2 }); // email not fount

    bcrypt.compare(body.password, user.password).then(async (compare) => {
        if (!compare)
            return res.json({ success: false, msg: -4 }); // password not mached

        let token = jwt.sign({ user }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRE_IN });
        return res.json({ token, user, success: true, msg: 1 });
    }).catch((err) => {
        res.status(500).json({ err, success: false, msg: -3 }) // error de server
    });
});

module.exports = app;