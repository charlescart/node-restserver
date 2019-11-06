const jwt = require('jsonwebtoken');
const { decrypt } = require('simple-encryptor')(process.env.SIMPLE_ENCRYPTOR_KEY);

const verifyToken = (req, res, next) => {
    let token = req.get('Authorization');

    try {
        let payload = jwt.verify(token, process.env.TOKEN_SEED);
        req.user = decrypt(payload._u_);
        next();
    } catch (err) {
        res.status(401).json({ err, success: false, msg: -7 }); // jwt invalid, Unauthorized
    }
};

module.exports = {
    verifyToken,
};