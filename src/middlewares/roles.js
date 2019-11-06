const User = require('../entities/User');

const verifyRole = (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, msg: -5 });

    User.findById(req.user._id, 'role').then((user) => {
        if (user.role != 'ADMIN_ROLE') return res.status(401).json({ success: false, msg: -6 });
        next();
    }).catch(err => res.status(500).json({ err, success: false, msg: -3 }));
};

module.exports = {
    verifyRole,
};