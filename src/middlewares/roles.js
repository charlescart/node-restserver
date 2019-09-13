const User = require('../entities/User');

const verifyRole = async (req, res, next) => {
    if (!req.user)
        return res.status(401).json({ success: false, msg: -5 });

    let user = await User.findById(req.user._id, 'role').catch((err) => {
        res.status(500).json({ err, success: false, msg: -3 });
    });

    if (user.role != 'ADMIN_ROLE')
        return res.status(401).json({ success: false, msg: -6 });

    next();
};

module.exports = {
    verifyRole,
};