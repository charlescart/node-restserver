const bcrypt = require('bcrypt');
const saltRounds = Number(process.env.SALT_ROUNDS);

const encryptPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds)
            .then((hash) => {
                return resolve(hash);
            }).catch((err) => {
                return reject({ success: false, msg: -2 });
            });
    });
}

module.exports = {
    encryptPassword
};