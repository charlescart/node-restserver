const express = require('express');
const { createUser } = require('./UserOperation');
const User = require('../../entities/User');
const { encryptPassword } = require('../../helpers/EncryptPassword');
const _ = require('underscore');
const { verifyToken } = require('../../middlewares/authentication');


const app = express();

app.get('/user/:id', (req, res) => {
    User.find({ _id: req.params.id }, (err, users) => {
        if (err)
            return res.status(400).json({ success: false, msg: -1 });

        res.json({ success: true, msg: 1, users });
    });
});

app.get('/users', verifyToken, async (req, res) => {
    let options = _.pick(req.query, 'page', 'limit');
    _.defaults(options, { page: 1, limit: 10, sort: { createdAt: 'desc' } });

    try {
        let users = await User.paginate({}, options);
        users = _.extend(users, { success: true, msg: 1 });
        return res.json(users);
    } catch (err) {
        return res.status(400).json({ err, success: false, msg: -1 });
    }
});

app.post('/user', (req, res) => {
    createUser(_.pick(req.body, 'name', 'email', 'password', 'role', 'googleAt', 'img'))
        .then((result) => {
            return res.json({ success: true, msg: 1, user: result });
        }).catch((err) => {
            return res.status(400).json(err);
        });
});

app.put('/user/:id', async function (req, res) { // edit
    let id = req.params.id;
    let data = _.pick(req.body, 'name', 'email', 'role', 'password', 'img');

    User.findById(id, `name role email`, (err, user) => {
        if (err)
            return res.status(400).json({ success: false, msg: -3 });
    });

    if (data.password)
        encryptPassword(data.password).then(async (hash) => {
            data.password = hash;
            let result = await User.updateOne({ _id: id }, data, { runValidators: true, context: 'query' });

            if (result.nModified)
                return res.json({ success: true, msg: 1 });
            else
                return res.status(400).json({ success: false, msg: -4 });
        }).catch((err) => {
            return res.json(err);
        });
    // TODO: hacer el else de este if (if (data.password)), si no se envia la contraseña no estoy editando
});

app.delete('/user/:id', async (req, res) => {
    let id = req.params.id;

    // with promise
    User.deleteById(id)
        .then((user) => {
            // user is a json: { n: 0, nModified: 0, ok: 1 }
            if (user.n == 0)
                return res.status(400).json({ user, success: false, msg: -3 }); // _id not fount!
            else if (user.nModified == 0)
                return res.json({ user, success: false, msg: -4 }); // Document not modified

            return res.json({ user, success: true, msg: 1 });
        }).catch((err) => {
            return res.json({ err, success: false, msg: 1 });
        });

    // with callback
    /* User.deleteById(id, (err, user) => {
        if (err)
            return res.status(400).json({ err, success: false, msg: -1 });
        if (user.nModified == 0)
            return res.json({ user, success: false, msg: -2 });

        return res.json({ user, success: true, msg: 1 });
    }); */
});

module.exports = app;