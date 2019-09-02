const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongooseHidden = require('mongoose-hidden')({ defaultHidden: { _id: false } });

let roles = { values: ['USER_ROLE', 'ADMIN_ROLE'] };

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        uniqueCaseInsensitive: true,
    },
    password: {
        type: String,
        required: true,
        hide: true,
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: roles,
    },
    deletedAt: {
        type: Date,
    },
    googleAt: {
        type: Date,
    },
}, { timestamps: true });

userSchema.plugin(uniqueValidator);
userSchema.plugin(mongooseHidden);
module.exports = mongoose.model('User', userSchema);