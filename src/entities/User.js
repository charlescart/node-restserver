const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongooseHidden = require('mongoose-hidden')({ defaultHidden: { _id: false } });
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseDelete = require('mongoose-delete');

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
        required: function () { // no se usa function de flecha por que se esta usando this
            return !this.googleAt; // la password es requerida solo cuando el campo googleAt no existe
        },
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
        index: true,
    },
    googleAt: {
        type: Date,
    },
}, { timestamps: true });

userSchema.plugin(uniqueValidator);
userSchema.plugin(mongooseHidden);
userSchema.plugin(mongoosePaginate);
userSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

module.exports = mongoose.model('User', userSchema);