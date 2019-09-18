const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongoosePaginate = require('mongoose-paginate-v2');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
        unique: true,
        uniqueCaseInsensitive: true,
    },
    description: {
        type: String,
        required: true,
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

categorySchema.plugin(uniqueValidator);
categorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Category', categorySchema);