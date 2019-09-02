const express = require('express');
const { createUser } = require('./UserOperation');
const User = require('../../entities/user');
const { encryptPassword } = require('../../helpers/EncryptPassword');
const _ = require('underscore');

const app = express();

app.get('/user/:id', (req, res) => {
    User.find({}, 'name', (err, users) => {
        if (err)
            return res.status(400).json({ success: false, msg: -1 });

        res.json({ success: true, msg: 1, users });
    });
});

app.get('/users', async (req, res) => {
    let pg = _.pick(req.query, 'skip', 'limit');
    _.defaults(pg, { skip: 0, limit: 5 });

    try {
        let users = await User.find({/* googleAt: { $exists: true } */ }, null, { skip: parseInt(pg.skip), limit: Number(pg.limit) });
        let count = await User.countDocuments();
        return res.json({ users, count, success: true, msg: 1 });
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

    User.findById(id, `name role email`, async (err, user) => {
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
});

app.delete('/user', function (req, res) { // delete
    res.json(`delete user`);
});

module.exports = app;