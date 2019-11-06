const express = require('express');
const User = require('../../entities/User');
const _ = require('underscore');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { encrypt } = require('simple-encryptor')(process.env.SIMPLE_ENCRYPTOR_KEY);
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { createUser, randomPassword } = require('../user/UserOperation');
const { encryptPassword } = require('../../helpers/EncryptPassword');

const app = express();


app.post('/sign-in', async (req, res) => {
    let body = _.pick(req.body, 'email', 'password');

    let user = await User.findOne({ email: body.email }).catch((err) => {
        res.status(500).json({ err, success: false, msg: -1 }); // Error de server
    });

    if (!user)
        return res.status(400).json({ success: false, msg: -8 }); // email not found

    if (user.googleAt && !user.password) {
        user.password = await encryptPassword(body.password).catch((err) => {
            res.status(400).json(err);
        });
        await user.save();
    }

    if (user.password)
        bcrypt.compare(body.password, user.password).then((compare) => {
            if (!compare)
                return res.status(400).json({ success: false, msg: -8 }); // password not mached

            let _u_ = encrypt(_.pick(user, '_id'));
            let token = jwt.sign({ _u_ }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRE_IN });
            res.json({ token, success: true, msg: 1 });
        }).catch((err) => {
            res.status(500).json({ err, success: false, msg: -2 }) // error de server
        });
    else
        return res.status(400).json({ success: false, msg: -8 }); // password not found
});

app.post('/sign-up-google', async (req, res) => {
    verify(req.body.idToken)
        .then(async (gUser) => {
            let user = await User.findOne({ email: gUser.email }).catch(err => {
                res.status(500).json({ err, success: false, msg: -3 });
            });

            if (!user) { // si el user no existe, crear
                let data = {
                    name: gUser.name, email: gUser.email, role: 'USER_ROLE',
                    googleAt: new Date(), img: gUser.picture,
                };

                user = await createUser(data);
            }

            let _u_ = encrypt(_.pick(user, '_id'));
            let token = jwt.sign({ _u_ }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRE_IN });
            res.json({ token, success: true, msg: 1 });
        }).catch(err => {
            res.status(400).json(err);
        });
});

const verify = async (token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    return payload;
}

module.exports = app;