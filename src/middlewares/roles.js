
const verifyRole = (req, res, next) => {
    if (!req.user)
        return res.status(401).json({ success: false, msg: -5 });

    if (req.user.role != 'ADMIN_ROLE')
        return res.status(401).json({ success: false, msg: -6 });

    next();
};

module.exports = {
    verifyRole,
};