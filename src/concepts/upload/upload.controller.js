const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const User = require('../../entities/User');

const app = express();

app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 }, safeFileNames: true, preserveExtension: true }));

app.put('/upload/:type/:id', (req, res) => {
    let { type, id } = req.params, typeValids = ['user', 'product'];

    if (typeValids.indexOf(type) < 0) return res.status(400).json({ success: false, msg: -3 });
    if (!req.files || Object.keys(req.files).length === 0)
        return res.status(400).json({ success: false, msg: -1 });

    let file = req.files.file;
    let extFile = file.name.split('.'), extValids = ['text', 'png', 'jpg'];
    extFile = extFile[extFile.length - 1];

    if (extValids.indexOf(extFile) < 0) return res.status(400).json({ success: false, msg: -2 });

    file.mv(path.join(`./uploads/${type}/${Date.now()}.${extFile}`), (err) => {
        if (err) return res.status(500).json({ err, success: false, msg: -1 });

        res.json({ success: true, msg: 1 });
    });
});

module.exports = app;