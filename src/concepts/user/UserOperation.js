const bcrypt = require('bcrypt');
const User = require('../../entities/User');
const { encryptPassword } = require('../../helpers/EncryptPassword');

const createUser = async (data) => {
    let { name, email, password, role, googleAt } = data;
    password = await encryptPassword(password);
    let user = new User({ name, email, password, role, googleAt });

    return await user.save();
}

module.exports = {
    createUser,
};