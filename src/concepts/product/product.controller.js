const express = require('express');
const { verifyToken } = require('../../middlewares/authentication');
const { verifyRole } = require('../../middlewares/roles');
const _ = require('underscore');
const Validator = require('validatorjs');
const Product = require('../../entities/Product');
const Case = require('case');
const stringArray = require('string-array');

const app = express();

const rulesPoduct = {
    name: 'required|string|min:3',
    price: 'required|numeric|min:1',
    description: 'required|string|min:3',
    left: 'numeric|min:1',
    categories: 'required',
    user: 'required',
};

app.get('/products', [verifyToken], (req, res) => {
    let options = _.pick(req.query, 'page', 'limit');
    let rules = { page: 'required|min:1', limit: 'required|min:1|max:20' };
    _.defaults(options, {
        page: 1, limit: 8, sort: { createdAt: 'desc' },
        populate: {
            path: 'categories user',
            select: 'name description',
        },
    });
    let validation = new Validator(options, rules);

    if (validation.fails()) return res.status(422).json(validation.errors.all());

    Product.paginate({}, options).then((products) => {
        res.json({ products, success: true, msg: 1 });
    }).catch((err) => {
        res.status(500).json({ err, success: false, msg: -1 });
    });
});

app.get('/product/:id', [verifyToken], (req, res) => {
    let id = req.params.id;

    Product.findById(id)
        .populate({ path: 'categories', select: 'name description' })
        .populate({ path: 'user', select: 'name' })
        .then((product) => {
            if (!product) return res.status(400).json({ success: false, msg: -3 });
            res.json({ product, success: true, msg: 1 });
        }).catch((err) => {
            res.status(400).json({ err, success: false, msg: -1 });
        });
});

app.post('/product', [verifyToken], (req, res) => {
    let data = _.pick(req.body, 'name', 'price', 'description', 'left', 'categories');
    data.user = req.user._id; // TODO: validar que el ObjectId sea de un documento existente, validator id npm
    data.categories = stringArray.parse(data.categories).array;
    let validation = new Validator(data, rulesPoduct);

    if (validation.fails()) return res.status(422).json(validation.errors.all());
    data = _.mapObject(data, (val, key) => {
        if (key == 'name') return Case.title(val);
        if (key == 'description') return Case.sentence(val);
        return val;
    });

    let product = new Product(data);
    product.save().then((product) => {
        res.json({ product, success: true, msg: 1 });
    }).catch((err) => {
        res.status(500).json({ err, success: false, msg: -1 });
    });
});

app.put('/product/:id', [verifyToken, verifyRole], (req, res) => {

});

app.delete('/product/:id', [verifyToken, verifyRole], (req, res) => {

});

module.exports = app;