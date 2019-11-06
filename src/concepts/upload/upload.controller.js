const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
// const upload = multer({ dest: 'uploads/' });
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        // cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
    }
});

const upload = multer({
    storage: storage
});


app.post('/upload', upload.fields([{ name: 'pastimetro', maxCount: 1 }]), (req, res, next) => {
    if (!req.files) res.status(400).json({ success: false, msg: -1 });

    let file = req.files['pastimetro'][0];
    res.json({ file })
});

module.exports = app;