const express = require('express');
const { createUser } = require('./UserOperation');
const User = require('../../entities/User');
const { encryptPassword } = require('../../helpers/EncryptPassword');
const _ = require('underscore');
const { verifyToken } = require('../../middlewares/authentication');
const { verifyRole } = require('../../middlewares/roles');
const Validator = require('validatorjs');


const app = express();
Validator.useLang('es');

app.get('/user/:id', (req, res) => {
    User.find({ _id: req.params.id }, (err, users) => {
        if (err)
            return res.status(400).json({ success: false, msg: -1 });

        res.json({ success: true, msg: 1, users });
    });
});

app.get('/users', [verifyToken, verifyRole], async (req, res) => {
    let options = _.pick(req.query, 'page', 'limit');
    _.defaults(options, { page: 1, limit: 10, sort: { createdAt: 'desc' } });

    let users = await User.paginate({}, options).catch((err) => {
        res.status(400).json({ err, success: false, msg: -1 });
    });
    users = _.extend(users, { success: true, msg: 1 });
    return res.json(users);
});

app.post('/user', (req, res) => {
    createUser(_.pick(req.body, 'name', 'email', 'password', 'role', 'googleAt', 'img'))
        .then((result) => {
            return res.json({ success: true, msg: 1, user: result });
        }).catch((err) => {
            return res.status(400).json(err);
        });
});

app.put('/user/:id', [verifyToken, verifyRole], async (req, res) => {
    let id = req.params.id;
    let data = _.pick(req.body, 'name', 'email', 'role', 'password', 'img');
    let rules = {
        name: 'string|min:3',
        email: 'email',
        // password: 'present',
        role: 'in:USER_ROLE,ADMIN_ROLE',
    };
    let validation = new Validator(data, rules);

    if (validation.fails())
        return res.status(422).json(validation.errors.all());

    let userExist = await User.findById(id).catch((err) => {
        res.status(500).json({ err, success: false, msg: -1 });
    });

    if (!userExist)
        return res.json(userExist);

    if (data.password)
        data.password = await encryptPassword(data.password).catch((err) => {
            return res.json(err); // error al encriptar password
        });

    User.updateOne({ _id: id }, data, { runValidators: true, context: 'query' })
        .then((result) => { // nModified
            res.json({ result, success: true, msg: 1 });
        }).catch((err) => {
            res.status(400).json({ success: false, msg: -4 });
        });
});

app.delete('/user/:id', [verifyToken, verifyRole], async (req, res) => {
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
            return res.json({ err, success: false, msg: -1 });
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