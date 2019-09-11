const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    let token = req.get('Authorization');

    try {
        let payload = jwt.verify(token, process.env.TOKEN_SEED);
        req.user = payload.user;
        next();
    } catch (err) {
        return res.status(401).json({ err, success: false, msg: -6 }); // jwt invalid
    }
};

module.exports = {
    verifyToken,
};