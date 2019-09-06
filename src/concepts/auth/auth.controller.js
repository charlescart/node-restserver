const express = require('express');
const app = express();


app.get('/login', function (req, res) {
    res.json({ msg: `Hello Word!`, success: true });
});

module.exports = app;