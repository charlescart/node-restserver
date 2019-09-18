const express = require('express');
const _ = require('underscore');
const Category = require('../../entities/Category');
const Validator = require('validatorjs');
const Case = require('case');
const { verifyToken } = require('../../middlewares/authentication');
const { verifyRole } = require('../../middlewares/roles');

const app = express();
const rulesForCategory = {
    name: 'required|string|min:3',
    description: 'required|string|min:3'
};

app.get('/categories', [verifyToken], (req, res) => {
    let options = _.pick(req.query, 'page', 'limit');
    _.defaults(options, {
        page: 1, limit: 8, sort: { createdAt: 'desc' },
        populate: {
            path: 'user',
            select: 'name',
        },
    });

    let rules = {
        page: 'required|numeric|min:1',
        limit: 'required|numeric|min:1|max:20',
    };
    let validation = new Validator(options, rules);

    if (validation.fails())
        return res.status(422).json(validation.errors.all());

    Category.paginate({}, options).then((categories) => {
        res.json({ categories, success: true, msg: 1 });
    }).catch((err) => {
        res.status(500).json({ err, success: false, msg: -1 });
    });
});

app.get('/category/:id', [verifyToken], (req, res) => {
    let id = req.params.id;

    Category.findById(id).populate('user', 'name').then((category) => {
        if (category) return res.json({ category, success: true, msg: 1 });
        res.status(400).json({ success: false, msg: -3 });
    }).catch((err) => {
        res.status(500).json({ err, success: false, msg: -1 });
    });
});

app.post('/category', [verifyToken], (req, res) => {
    let data = _.pick(req.body, 'name', 'description');
    let validation = new Validator(data, rulesForCategory);

    if (validation.fails())
        return res.status(422).json(validation.errors.all());

    let category = new Category({
        name: Case.title(data.name),
        description: Case.sentence(data.description),
        user: req.user._id,
    });

    category.save().then((category) => {
        res.json({ category, success: true, msg: 1 });
    }).catch((err) => {
        res.status(500).json({ err, success: false, msg: -1 });
    });
});

app.put('/category/:id', [verifyToken], (req, res) => {
    // TODO: verificar jwt y role tiene que ser admin o creador del recurso
    let id = req.params.id;
    let data = _.pick(req.body, 'name', 'description');
    let validation = new Validator(data, rulesForCategory);

    if (validation.fails()) return res.status(422).json(validation.errors.all());

    data = _.mapObject(data, (val, key) => {
        if (key == 'name') return Case.title(val);
        return Case.sentence(val);
    });

    Category.findByIdAndUpdate(id, data, { runValidators: true, context: 'query', new: true })
        .then((category) => {
            if (!category) return res.status(400).json({ success: false, msg: -3 });
            res.json({ category, success: true, msg: 1 });
        }).catch(err => res.status(500).json({ err, success: false, msg: -1 }));
});

app.delete('', [], (req, res) => {
    // TODO: jwt verify and role is admin
});

module.exports = app;