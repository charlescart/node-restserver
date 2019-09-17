const bcrypt = require('bcrypt');
const User = require('../../entities/User');
const { encryptPassword } = require('../../helpers/EncryptPassword');

const createUser = async (data) => {
    let { name, email, password, role, googleAt, img } = data;
    if (password)
        password = await encryptPassword(password);
    let user = new User({ name, email, password, role, googleAt, img });

    return await user.save();
}

const randomPassword = (length) => Math.random().toString(36).substring(length);

module.exports = {
    createUser,
    randomPassword
};